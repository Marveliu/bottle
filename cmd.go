// Copyright 2019 The bottle Authors
// This file is part of the bottle library.
//
// The bottle library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The bottle library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the bottle library. If not, see <http://www.gnu.org/licenses/>.

package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"path"
	"time"

	"github.com/vntchain/go-vnt/accounts/abi"
	cmdutils "github.com/vntchain/go-vnt/cmd/utils"
	"github.com/vntchain/go-vnt/core/wavm/utils"
	cli "gopkg.in/urfave/cli.v1"
)

var (
	gitCommit = ""
	app       = cmdutils.NewApp(gitCommit, "the bottle command line interface")
	// flags that configure the node
	contractCodeFlag = cli.StringFlag{
		Name:  "code",
		Usage: "Specific a contract code path",
	}
	outputFlag = cmdutils.DirectoryFlag{
		Name:  "output",
		Usage: "Specific a output directory path",
	}
	includeFlag = cmdutils.DirectoryFlag{
		Name:  "include",
		Usage: "Specific the head file directory need by contract",
	}
	abiFlag = cli.StringFlag{
		Name:  "abi",
		Usage: "Specific a abi path need by contract",
	}
	wasmFlag = cli.StringFlag{
		Name:  "wasm",
		Usage: "Specific a wasm path",
	}
	compressFileFlag = cli.StringFlag{
		Name:  "file",
		Usage: "Specific a compress file path to decompress",
	}
	compileCmd = cli.Command{
		Action:    compile,
		Name:      "compile",
		Usage:     "Compile contract code to wasm and compress",
		ArgsUsage: "<code file>",
		Category:  "COMPILE COMMANDS",
		Description: `
		wasmgen compile

Compile contract code to wasm and compress
		`,
		Flags: []cli.Flag{
			contractCodeFlag,
			outputFlag,
			includeFlag,
		},
	}
	compressCmd = cli.Command{
		Action:    compress,
		Name:      "compress",
		Usage:     "Compress wasm and abi",
		ArgsUsage: "<code file> <abi file>",
		Category:  "COMPRESS COMMANDS",
		Description: `
		wasmgen compress

Compress wasm and abi
		`,
		Flags: []cli.Flag{
			wasmFlag,
			abiFlag,
			outputFlag,
		},
	}
	decompressCmd = cli.Command{
		Action:    decompress,
		Name:      "decompress",
		Usage:     "Deompress file into wasm and abi",
		ArgsUsage: "<code file> <abi file>",
		Category:  "DECOMPRESS COMMANDS",
		Description: `
		wasmgen decompress

Deompress file into wasm and abi
		`,
		Flags: []cli.Flag{
			compressFileFlag,
			outputFlag,
		},
	}
	hintCmd = cli.Command{
		Action:    hint,
		Name:      "hint",
		Usage:     "Contract hint",
		ArgsUsage: "<code file> <abi file>",
		Category:  "HINT COMMANDS",
		Description: `
		wasmgen hint

Contract hint
		`,
		Flags: []cli.Flag{
			contractCodeFlag,
		},
	}
)

func compile(ctx *cli.Context) error {
	start := time.Now()
	codePath = ctx.String(contractCodeFlag.Name)
	includeDir = ctx.String(includeFlag.Name)
	outputDir = ctx.String(outputFlag.Name)
	if codePath == "" {
		fmt.Printf("Error:No Contract Code\n")
		os.Exit(-1)
	}
	// fmt.Printf("Input file\n")
	// fmt.Printf("Contract path :%s\n", codePath)
	mustCFile(codePath)
	if outputDir == "" {
		outputDir = path.Join(path.Dir(codePath), "output")
	}
	if includeDir == "" {
		includeDir = path.Dir(codePath)
	}

	if wasmCeptionFlag = os.Getenv("VNT_WASMCEPTION"); wasmCeptionFlag == "" {
		return fmt.Errorf("未找到VNT_WASMCEPTION的环境变量，请按照readme的步骤下载并设置wasmception")
	}
	code, err := ioutil.ReadFile(codePath)
	if err != nil {
		return err
	}
	cmd([]string{codePath})
	abigen := newAbiGen(code)
	abigen.removeComment()
	abigen.parseMethod()
	// abigen.parseKey()
	abigen.parseEvent()
	abigen.parseCall()
	abigen.parseConstructor()

	var pack []interface{}
	if abigen.abi.Constructor.Name != "" {
		pack = append(pack, abigen.abi.Constructor)
	}

	for _, v := range abigen.abi.Methods {
		pack = append(pack, v)
	}
	for _, v := range abigen.abi.Events {
		pack = append(pack, v)
	}
	for _, v := range abigen.abi.Calls {
		pack = append(pack, v)
	}
	res, err := json.Marshal(pack)
	if err != nil {
		return err
	}
	err = writeFile(path.Join(outputDir, "abi.json"), res)
	if err != nil {
		return err
	}
	// fmt.Printf("Output file\n")
	// fmt.Printf("Abi path: %s\n", path.Join(outputDir, "abi.json"))
	abires, err := abi.JSON(bytes.NewBuffer(res))
	if err != nil {
		return err
	}

	pre := abigen.insertRegistryCode()
	// pre = abigen.insertMutableCode(pre)
	codeOutput := path.Join(outputDir, "precompile.c")
	err = writeFile(codeOutput, pre)
	if err != nil {
		return err
	}
	// fmt.Printf("Precompile code path: %s\n", codeOutput)
	wasmOutput := path.Join(outputDir, abires.Constructor.Name+".wasm")
	SetEnvPath()
	BuildWasm(codeOutput, wasmOutput)
	// fmt.Printf("Wasm path: %s\n", wasmOutput)
	wasm, err := ioutil.ReadFile(wasmOutput)
	if err != nil {
		return err
	}
	cpsPath := path.Join(outputDir, abires.Constructor.Name+".compress")
	cpsRes := utils.CompressWasmAndAbi(res, wasm, nil)
	err = writeFile(cpsPath, cpsRes)
	if err != nil {
		return err
	}
	fmt.Printf("Input file\n")
	fmt.Printf("Contract path :%s\n", codePath)
	fmt.Printf("Output file\n")
	fmt.Printf("Abi path: %s\n", path.Join(outputDir, "abi.json"))
	fmt.Printf("Precompile code path: %s\n", codeOutput)
	fmt.Printf("Wasm path: %s\n", wasmOutput)
	fmt.Printf("Compress Data path: %s\n", cpsPath)
	fmt.Printf("Please use %s when you want to create a contract\n", abires.Constructor.Name+".compress")
	fmt.Printf("time duration 2:", time.Since(start))
	return nil
}

func compress(ctx *cli.Context) error {
	wasmPath = ctx.String(wasmFlag.Name)
	abiPath = ctx.String(abiFlag.Name)
	outputDir = ctx.String(outputFlag.Name)
	if wasmPath == "" {
		fmt.Printf("Error:No Wasm File\n")
		os.Exit(-1)
	}
	if abiPath == "" {
		fmt.Printf("Error:No Abi File\n")
		os.Exit(-1)
	}

	if outputDir == "" {
		outputDir = path.Join(path.Dir(wasmPath), "output")
	}

	wasm, err := ioutil.ReadFile(wasmPath)
	if err != nil {
		return err
	}
	abijson, err := ioutil.ReadFile(abiPath)
	if err != nil {
		return err
	}

	abires, err := abi.JSON(bytes.NewBuffer(abijson))
	if err != nil {
		return err
	}
	cpsPath := path.Join(outputDir, abires.Constructor.Name+".compress")
	cpsRes := utils.CompressWasmAndAbi(abijson, wasm, nil)
	err = writeFile(cpsPath, cpsRes)
	if err != nil {
		return err
	}
	fmt.Printf("Input file\n")
	fmt.Printf("Wasm path :%s\n", wasmPath)
	fmt.Printf("Abi path :%s\n", abiPath)
	fmt.Printf("Output file\n")
	fmt.Printf("Compress Data path: %s\n", cpsPath)
	fmt.Printf("Please use %s when you want to create a contract\n", abires.Constructor.Name+".compress")
	return nil
}

func decompress(ctx *cli.Context) error {
	compressPath = ctx.String(compressFileFlag.Name)
	outputDir = ctx.String(outputFlag.Name)
	if compressPath == "" {
		fmt.Printf("Error:No Compress File\n")
	}
	if outputDir == "" {
		outputDir = path.Join(path.Dir(compressPath), "output")
	}
	comContent, err := ioutil.ReadFile(compressPath)
	if err != nil {
		return err
	}
	wasmcode, _, err := utils.DecodeContractCode(comContent)
	if err != nil {
		return err
	}
	abires, err := abi.JSON(bytes.NewBuffer(wasmcode.Abi))
	if err != nil {
		return err
	}
	wasmoutputPath := path.Join(outputDir, abires.Constructor.Name+".wasm")
	err = writeFile(wasmoutputPath, wasmcode.Code)
	if err != nil {
		return err
	}
	abioutputPath := path.Join(outputDir, "abi.json")
	err = writeFile(abioutputPath, wasmcode.Abi)
	if err != nil {
		return err
	}
	fmt.Printf("Input file\n")
	fmt.Printf("Compress file path :%s\n", compressPath)
	fmt.Printf("Output file\n")
	fmt.Printf("wasm path: %s\n", wasmoutputPath)
	fmt.Printf("abi path: %s\n", abioutputPath)
	return nil
}

func hint(ctx *cli.Context) error {
	fmt.Printf("hint\n")
	codePath = ctx.String(contractCodeFlag.Name)
	// fileContent = readfile(codePath)
	code, err := ioutil.ReadFile(codePath)
	if err != nil {
		return err
	}
	cmd([]string{codePath})
	// jsonres, _ := json.Marshal(varLists)
	// fmt.Printf("vallist %s\n", jsonres)

	// structres, _ := json.Marshal(structLists)
	// fmt.Printf("structres %s\n", structres)
	hint := newHint(codePath, code)
	msg, err := hint.contructorCheck()
	fmt.Printf("msg %+v,err %s\n", msg, err)
	msg, err = hint.keyCheck()
	fmt.Printf("msg %+v,err %s\n", msg, err)
	msg, err = hint.callCheck()
	fmt.Printf("msg %+v,err %s\n", msg, err)
	msg, err = hint.eventCheck()
	fmt.Printf("msg %+v,err %s\n", msg, err)
	msg, err = hint.payableCheck()
	fmt.Printf("msg %+v,err %s\n", msg, err)
	msg, err = hint.exportCheck()
	fmt.Printf("msg %+v,err %s\n", msg, err)
	msg, err = hint.checkUnmutableFunction()
	fmt.Printf("msg %+v,err %s\n", msg, err)
	return nil
}
