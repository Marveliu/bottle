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
var key1 = JSON.parse(fs.readFileSync(from1Keystore).toString("utf-8"));
var from2 = '0x1043180ab29bf65ea58657672beabce17b42ad68';
var from2Keystore = '/Users/mac/gopath/src/github.com/vntchain/go-vnt/dev/testnet/node0/keystore/UTC--2019-11-27T13-24-27.886013000Z--1043180ab29bf65ea58657672beabce17b42ad68';
var key2 = JSON.parse(fs.readFileSync(from2Keystore).toString("utf-8"));
var pass2 = '';

vnt.personal.unlockAccount(from1, pass1);
vnt.personal.unlockAccount(from2, pass2);

function deployWasmContractWithPrivateKey(abiFile, codeFile) {
    var wasmabi = fs.readFileSync(abiFile);
    var abi = JSON.parse(wasmabi.toString('utf-8'));
    var contract = vnt.core.contract(abi).codeFile(codeFile);
    var deployContract = contract.packContructorData();
    // var value = vnt.toHex(vnt.toWei(100, 'vnt'))
    var account = vntkit.account.decrypt(key1, pass1, false);
    sendRawTransaction(account, null, deployContract, null)
}

function sendRawTransaction(account, to, data, value) {
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
    tx.sign(new Buffer(account.privateKey.substring(2, ), 'hex'));
    var serializedTx = tx.serialize();
    vnt.core.sendRawTransaction('0x' + serializedTx.toString('hex'), function (err, txHash) {
        if (err) {
            console.log('err happened: ', err)
            console.log('transaction hash: ', txHash);
        } else {
            console.log('transaction hash: ', txHash);
        }
        getTransactionReceipt(txHash)
    });
}

function getTransactionReceipt(tx) {
    var receipt = vnt.core.getTransactionReceipt(tx);
    if (!receipt) {
        setTimeout(function () {
            getTransactionReceipt(tx)
        }, 1000);
    } else {
        console.log("tx receipt: ", receipt)
        console.log("tx status: ", receipt.status)
        console.log("contract address: ", receipt.contractAddress)
    }
}

function transferMoney(to, value) {
    var account = vntkit.account.decrypt(key1, pass1, false);
    sendRawTransaction(account, to, "", vnt.toHex(vnt.toWei(value, 'vnt')))
}

function watchEvent(contract,from){
    contract.allEvents({
        fromBlock: from,
       toBlock: 'latest'
   }).watch(function (error, result) {
       console.log(error, result);
   })
}

exports.deploy = deployWasmContractWithPrivateKey
exports.sendTx = sendRawTransaction
exports.watch = watchEvent
exports.vnt = vnt
exports.account1 = vntkit.account.decrypt(key1, pass1, false);
exports.account2 = vntkit.account.decrypt(key2, pass2, false);