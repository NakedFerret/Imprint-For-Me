var nacl = require('tweetnacl');
var Database = require('better-sqlite3');
var db = new Database('test.db');

var keyPair = nacl.sign.keyPair();

var randomNumber = Math.floor(Math.random() * 10000);

var timestamp = Math.floor(Date.now() / 1000);
var message = process.argv[2];

var signature = nacl.sign.detached(Buffer.from(message + timestamp), keyPair.secretKey);

console.log(JSON.stringify({
  message: message,
  timestamp: timestamp + "",
  publicKey: Buffer.from(keyPair.publicKey).toString('base64'),
  signature: Buffer.from(signature).toString('base64')
}));

