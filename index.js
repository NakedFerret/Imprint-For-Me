var nacl = require("tweetnacl");

var keyPair = nacl.sign.keyPair();

var message = "I'm calling it now Donald trump starts WWIII";

var signature = nacl.sign.detached(Buffer.from(message), keyPair.secretKey);

console.log('Message:', message);
console.log('Signature:', signature.length, 'bytes,', Buffer.from(signature).toString('base64').length, ' base64 chars');

