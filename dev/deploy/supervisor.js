var common = require('./common')
var fs = require('fs');
var vntkit = require('vnt-kit');
var vnt = common.vnt;

var abiFile = '/Users/mac/gopath/src/github.com/vntchain/bottle/dev/build/contracts/Supervisor.abi';
var wasmabi = fs.readFileSync(abiFile);
var abi = JSON.parse(wasmabi.toString('utf-8'));

var contractAddress = '0x0000000000000000000000000000000000000008';
var metaFile = 'transactionBiz.toml';
var config = "{\"AccountBlackLists\":[\"0x13f6c5ba187f165e64c651c0e1167091d067089c\",\"0x23f6c5ba187f165e64c651c0e1167091d067089c\"],\"MngNodes\":{\"123\":{\"Id\":1,\"Name\":\"监查院\",\"Desc\":\"陈萍萍\",\"Ip\":\"127.0.0.1:9999\",\"Status\":1,\"Addr\":\"0xf3f6c5ba187f165e64c651c0e1167091d067089c\",\"Pubkey\":\"12334\"}}}"

function regBizMeta() {
    var meta = "0x" + fs.readFileSync(metaFile).toString('hex');
    var contract = vnt.core.contract(abi)
    var data = contract.packFunctionData("RegBizMeta", [meta]);
    common.sendTx(common.account1, contractAddress, data, null)
}

function GetBizMetaTemplate(n) {
    var contract = vnt.core.contract(abi).at(contractAddress);
    r = contract.GetBizMetaTemplate.call(n);
    fs.writeFile('transaction.c', r, function (err) {
        if (err) {
            console.log(err);
        }
    })
}

function UpdateConfig(){
    var contract = vnt.core.contract(abi)
    var data = contract.packFunctionData("UpdateConfig", [config]);
    common.sendTx(common.account1, contractAddress, data, null)
}

function GetConfig(){
    var contract = vnt.core.contract(abi).at(contractAddress);
    r = contract.GetConfig.call();
    console.log(r)
}

function GetBizContract(addr){
    var contract = vnt.core.contract(abi).at(contractAddress);
    r = contract.GetBizContract.call(addr);
    console.log(r)
}

// regBizMeta()
// GetBizMetaTemplate(321)
// UpdateConfig()
// GetConfig()
GetBizContract("0x298cb06cb267529e0928cd421c064154951ec9ad")