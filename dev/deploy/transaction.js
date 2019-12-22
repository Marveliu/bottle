var common = require('./common')
var fs = require('fs');
var vntkit = require('vnt-kit');
var vnt = common.vnt;

var codeFile = '/Users/mac/gopath/src/github.com/vntchain/bottle/dev/build/contracts/transaction.compress';
var abiFile = '/Users/mac/gopath/src/github.com/vntchain/bottle/dev/build/contracts/transaction.abi';
var contractAddress = '0x298cb06cb267529e0928cd421c064154951ec9ad';
var wasmabi = fs.readFileSync(abiFile);
var abi = JSON.parse(wasmabi.toString('utf-8'));


function publish(){
    var contract = vnt.core.contract(abi)
    var data = contract.packFunctionData("publish", []);
    common.sendTx(common.account1, contractAddress, data, null)
}

function trans(){
    var contract = vnt.core.contract(abi)
    var data = contract.packFunctionData("trans", []);
    common.sendTx(common.account1, contractAddress, data, null)
}

// common.deploy(abiFile, codeFile);
// publish()
trans()
