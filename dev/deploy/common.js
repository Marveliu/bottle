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

