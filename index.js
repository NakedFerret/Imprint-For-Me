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
  console.log("Message length:", str.length);
  console.log("Hash (buffer):", msg);
  console.log("Hash (hex string);", msg.toString('hex'));
  console.log("Hash (base64 string);", msg.toString('base64'));
  console.log("Hash length:", msg.length);
  console.log("Hash hex length in chars:", msg.toString('hex').length);
  console.log("Hash base64 length in chars:", msg.toString('base64').length);
  console.log("Signature in DER format (hex):", sig.toString('hex'));
  console.log("Signature in DER format (base64):", sig.toString('base64'));
  console.log("Signature Length:", sig.length);
  console.log("Signature hex string chars:", sig.toString('hex').length);
  console.log("Signature base64 string chars:", sig.toString('base64').length);
  eccrypto.verify(publicKey, msg, sig).then(function() {
    console.log("Signature is OK");
  }).catch(function() {
    console.log("Signature is BAD");
  });
});
