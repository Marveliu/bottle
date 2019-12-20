var common = require('./common')
var fs = require('fs');
var vntkit = require('vnt-kit');
var vnt = common.vnt;

var abiFile = '/Users/mac/gopath/src/github.com/vntchain/bottle/dev/build/contracts/Supervisor.abi';
var wasmabi = fs.readFileSync(abiFile);
var abi = JSON.parse(wasmabi.toString('utf-8'));

var contractAddress = '0x0000000000000000000000000000000000000008';

var metaFile = 'transactionBiz.toml';

function regBizMeta() {
    var meta = "0x" + fs.readFileSync(metaFile).toString('hex');
    var contract = vnt.core.contract(abi)
    var data = contract.packFunctionData("RegBizMeta", [meta]);
    common.sendTx(common.account1, contractAddress, data, null)
}

function GetBizMetaTemplate(n) {
    var contract = vnt.core.contract(abi).at(contractAddress);
    r = contract.GetBizMetaTemplate.call(n);
    fs.writeFile('biz.c', r, function (err) {
        if (err) {
            console.log(err);
        }
    })
}

// regBizMeta()
GetBizMetaTemplate(321)