var common = require('./common')
var fs = require('fs');
var vntkit = require('vnt-kit');
var vnt = common.vnt;

var abiFile = '/Users/mac/gopath/src/github.com/vntchain/bottle/dev/build/contracts/Supervisor.abi';
var wasmabi = fs.readFileSync(abiFile);
var abi = JSON.parse(wasmabi.toString('utf-8'));
var contractAddress = '0x0000000000000000000000000000000000000008';


var contract = vnt.core.contract(abi).at(contractAddress);
common.watch(contract, 17781)