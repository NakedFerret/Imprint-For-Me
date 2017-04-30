var crypto = require("crypto");
var eccrypto = require("eccrypto");

// A new random 32-byte private key.
var privateKey = crypto.randomBytes(32);

// Corresponding uncompressed (65-byte) public key
var publicKey = eccrypto.getPublic(privateKey);

var str = "message to sign";

// Always hash you message to sign!
var msg = crypto.createHash("sha256").update(str).digest();

eccrypto.sign(privateKey, msg).then(function(sig) {
  console.log("Message:", str);
  console.log("Hash (hex):", msg.toString('hex'));
  console.log("Signature in DER format (hex):", sig.toString('hex'));

  console.log('\n');
  console.log("Message:", str.length, 'chars |', Buffer.from(str).length, 'bytes');
  console.log('Hash:', msg.length, 'bytes |', msg.toString('hex').length, 'hex chars |', msg.toString('base64').length, 'base64 chars');
  console.log('Signature:', sig.length, 'bytes |', sig.toString('hex').length, 'hex chars |', sig.toString('base64').length, 'base64 chars');

  eccrypto.verify(publicKey, msg, sig).then(function() {
    console.log("Signature is OK");
  }).catch(function() {
    console.log("Signature is BAD");
  });
});
