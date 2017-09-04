console.log("Hey there");

function decodeUTF8(s) {
  if (typeof s !== 'string') throw new TypeError('expected string');
  var i, d = unescape(encodeURIComponent(s)), b = new Uint8Array(d.length);
  for (i = 0; i < d.length; i++) b[i] = d.charCodeAt(i);
  return b;
};

function onCreateClick() {
  console.log('Create message clicked');
  var messageInput = document.querySelector('#messageInput');

  var message = messageInput.value;
  var timestamp = Math.floor(Date.now() / 1000);
  var keyPair = nacl.sign.keyPair();
  var signature = nacl.sign.detached(
    decodeUTF8(message+timestamp), 
    keyPair.secretKey
  );

  console.log({
    message: message,
    timestamp: timestamp,
    keyPair: keyPair,
    signature
  });
}
