var common = require('./common')
var fs = require('fs');
var vnt = common.vnt;

var codeFile = '/Users/mac/gopath/src/github.com/vntchain/bottle/dev/build/contracts/BizContract.compress';
var abiFile = '/Users/mac/gopath/src/github.com/vntchain/bottle/dev/build/contracts/BizContract.abi';
var contractAddress = '0x292971a0450f6f4dfa851d5779f06ef10ee40fa4';

function TestReport() {
    var wasmabi = fs.readFileSync(abiFile);
    var abi = JSON.parse(wasmabi.toString('utf-8'));
    var contract = vnt.core.contract(abi).at(contractAddress);
    contract.trans.call();
}

// common.deploy(abiFile, codeFile);
TestReport()