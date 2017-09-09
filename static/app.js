window.onload = function() {
 var username = localStorage.getItem('username');

 if (username === null) {
   return;
 }

 var usernameDisplay = document.querySelector('#username');
 usernameDisplay.innerText = 'Hello, ' + username + '!'; 
 usernameDisplay.className = "";
}

function decodeUTF8(s) {
  if (typeof s !== 'string') throw new TypeError('expected string');
  var i, d = unescape(encodeURIComponent(s)), b = new Uint8Array(d.length);
  for (i = 0; i < d.length; i++) b[i] = d.charCodeAt(i);
  return b;
};

function encodeBase64(arr) {
  var i, s = [], len = arr.length;
  for (i = 0; i < len; i++) s.push(String.fromCharCode(arr[i]));
  return btoa(s.join(''));
};

function validateBase64(s) {
  if (!(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(s))) {
    throw new TypeError('invalid encoding');
  }
}

function decodeBase64(s) {
  validateBase64(s);
  var i, d = atob(s), b = new Uint8Array(d.length);
  for (i = 0; i < d.length; i++) b[i] = d.charCodeAt(i);
  return b;
};

function onCreateClick() {
  console.log('Create message clicked');
  var messageInput = document.querySelector('#messageInput');

  var message = messageInput.value;
  if (message.trim().length === 0) {
    // TODO: show error message
    return;
  }

  var timestamp = Math.floor(Date.now() / 1000) + "";
  var storedKey = localStorage.getItem('secretKey');
  var keyPair = storedKey !== null ? 
    nacl.sign.keyPair.fromSecretKey(decodeBase64(storedKey)) :
    nacl.sign.keyPair();

  var signature = nacl.sign.detached(
    decodeUTF8(message+timestamp), 
    keyPair.secretKey
  );

  var payload = {
    message: message,
    timestamp: timestamp,
    publicKey: encodeBase64(keyPair.publicKey),
    signature: encodeBase64(signature)
  };

  fetch('/prophecy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then( function(response) {
    return response.json();
  }).then( function(data) {
    localStorage.setItem('username', data.user.name);
  }).catch( function (error) {
    console.error(error)
  });

  localStorage.setItem('secretKey', encodeBase64(keyPair.secretKey));
}
