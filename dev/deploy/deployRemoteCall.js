var fs = require('fs');
var Vnt = require('vnt');
var vntkit = require('vnt-kit');
var TX = require('ethereumjs-tx');
var vnt = new Vnt();
var privider = 'http://localhost:8545';
var chainid = 1012;
vnt.setProvider(new vnt.providers.HttpProvider(privider));

var from1 = '0xf3f6c5ba187f165e64c651c0e1167091d067089c';
var from1Keystore = '/Users/mac/gopath/src/github.com/vntchain/go-vnt/dev/testnet/node0/keystore/UTC--2019-11-26T11-39-58.659128000Z--f3f6c5ba187f165e64c651c0e1167091d067089c';
var pass1 = '';
var from2 = '0x1043180ab29bf65ea58657672beabce17b42ad68';
var from2Keystore = '/Users/mac/gopath/src/github.com/vntchain/go-vnt/dev/testnet/node0/keystore/UTC--2019-11-27T13-24-27.886013000Z--1043180ab29bf65ea58657672beabce17b42ad68';
var pass2 = '';
var toAddr = '0x5641166a9efee39886b66baa4fe6fc84383a2706';


vnt.personal.unlockAccount(from1, pass1);
vnt.personal.unlockAccount(from2, pass2);
vnt.personal.unlockAccount(toAddr, "");


var codeFile ='/Users/mac/gopath/src/github.com/vntchain/vnt-contract-demo/contract/output/Hello.compress';
var abiFile ='/Users/mac/gopath/src/github.com/vntchain/vnt-contract-demo/contract/output/Hello.abi';
var wasmabi = fs.readFileSync(abiFile);
var abi = JSON.parse(wasmabi.toString('utf-8'));
var key1 = JSON.parse(fs.readFileSync(from1Keystore).toString("utf-8"))
var key2 = JSON.parse(fs.readFileSync(from2Keystore).toString("utf-8"))

function deployWasmContractWithPrivateKey() {
    var contract = vnt.core.contract(abi).codeFile(codeFile);
    var deployContract = contract.packContructorData();
    // var value = vnt.toHex(vnt.toWei(100, 'vnt'))
    var account = vntkit.account.decrypt(key1, pass1, false);
    sendRawTransaction(account, null, deployContract, null)
}

function getTransactionReceipt(tx) {
    var receipt = vnt.core.getTransactionReceipt(tx);
    if (!receipt) {
        setTimeout(function() {
            getTransactionReceipt(tx)
        }, 1000);
    } else {
        console.log("tx receipt: ", receipt)
        console.log("tx status: ", receipt.status)
        console.log("contract address: ", receipt.contractAddress)
    }
}

function sendRawTransaction(account,to,data,value){
    var nonce = vnt.core.getTransactionCount(account.address);
    var options = {
        nonce: nonce,
        to: to,
        gasPrice: vnt.toHex(vnt.toWei(18, 'Gwei')),
        gasLimit: vnt.toHex(4000000),
        data: data,
        value: value,
        chainId: chainid
    };
    var tx = new TX(options);
    tx.sign(new Buffer(account.privateKey.substring(2,),'hex'));
    var serializedTx = tx.serialize();
    vnt.core.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, txHash) {
        if (err) {
            console.log('err happened: ', err)
            console.log('transaction hash: ', txHash);
        } else {
            console.log('transaction hash: ', txHash);
        }
        getTransactionReceipt(txHash)
    });
}

function transferMoney(to, value){
    var account = vntkit.account.decrypt(key1, pass1, false);
    sendRawTransaction(account,to,"",vnt.toHex(vnt.toWei(value, 'vnt')))
}

function SetNickName() {
    var contract = vnt.core.contract(abi);
    var data = contract.packFunctionData("SetNickName", ["Marveliu"]);
    var account = vntkit.account.decrypt(key1, pass1, false);
    sendRawTransaction(account, contractAddress, data, null)
    // var events = contract.at(contractAddress).allEvents({fromBlock: 3440, toBlock: 'latest'});
    // events.watch(function(error, result){
    //   console.log(error,result);
    // });
}

function SayHello() {
    var contract = vnt.core.contract(abi).at(contractAddress);
    var msg = contract.SayHello.call();
    console.log(msg);
    // var events = contract.allEvents({fromBlock: 0, toBlock: 'latest'});
    // events.watch(function(error, result){
    //   console.log(error,result);
    // });
}

// deployWasmContractWithPrivateKey();
var contractAddress = '0x011d7527f8de564bdfce5033701d9c6ecbfa688e';
SetNickName()
// SayHello()