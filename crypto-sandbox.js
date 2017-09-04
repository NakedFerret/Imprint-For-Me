var nacl = require("tweetnacl");

var keyPair = nacl.sign.keyPair();

var message = "I'm calling it now Donald trump starts WWIII";

var signature = nacl.sign.detached(Buffer.from(message), keyPair.secretKey);
var verification = nacl.sign.detached.verify(Buffer.from(message), signature, keyPair.publicKey);

console.log('Pub Key:', keyPair.publicKey.length, 'bytes', Buffer.from(keyPair.publicKey).toString('base64').length, ' base64 chars');
console.log('Message:', message);
console.log('Signature:', signature.length, 'bytes,', Buffer.from(signature).toString('base64').length, ' base64 chars');
console.log('Verfication:', verification);

