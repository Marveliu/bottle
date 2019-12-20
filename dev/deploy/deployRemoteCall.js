
var common = require('./common')
var fs = require('fs');
var vntkit = require('vnt-kit');
var vnt = common.vnt;

var codeFile = '/Users/mac/gopath/src/github.com/vntchain/bottle/dev/build/contracts/RemoteCall.compress';
var abiFile = '/Users/mac/gopath/src/github.com/vntchain/bottle/dev/build/contracts/RemoteCall.abi';
var wasmabi = fs.readFileSync(abiFile);
var abi = JSON.parse(wasmabi.toString('utf-8'));

var contractAddress = '0xd0d98a348150f11ccd9ee34ecd228c2021a9986b';


function testcall(addr){
    var contract = vnt.core.contract(abi)
    var data = contract.packFunctionData("testcall", [addr]);
    common.sendTx(common.account1, contractAddress, data, null)
}

// common.deploy(abiFile, codeFile);
testcall("0xd366c2ffb8af877fef79028c63dbf62dd51efc81")