var common = require('./common')
var fs = require('fs');
var vntkit = require('vnt-kit');
var vnt = common.vnt;

var codeFile = '/Users/mac/gopath/src/github.com/vntchain/bottle/dev/build/contracts/Hello.compress';
var abiFile = '/Users/mac/gopath/src/github.com/vntchain/bottle/dev/build/contracts/Hello.abi';
var contractAddress = '0x1e9c411f7739db0791a86cf2938f8904c6d3400a';
var wasmabi = fs.readFileSync(abiFile);
var abi = JSON.parse(wasmabi.toString('utf-8'));


function SetNickName() {
    var contract = vnt.core.contract(abi);
    var data = contract.packFunctionData("SetNickName", ["Marveliu"]);
    common.sendTx(common.account1, contractAddress, data, null)
}

function SayHello() {
    var contract = vnt.core.contract(abi).at(contractAddress);
    var msg = contract.SayHello.call();
    console.log(msg);
}

common.deploy(abiFile, codeFile);
// SetNickName()
// var contract = vnt.core.contract(abi).at(contractAddress);
// common.watch(contract, 17544)

// SayHello()
