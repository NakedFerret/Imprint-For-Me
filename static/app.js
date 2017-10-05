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

function handleAPIResponse(response) {
  if (response.status === 400) {
    var error = new Error();
    error.apiError = true;
    error.response = response;
    throw error;
  }
  return response.json();
};

function onCreateClick() {
  var messageInput = document.querySelector('#messageInput');
  var outputBox = document.querySelector('#outputBox');
  var outputMessage = document.querySelector('.message');
  var copyButton = document.querySelector('#copyProof');
  var usernameDisplay = document.querySelector('#username');

  outputBox.className = "hidden";
  outputMessage.innerText = "";
  copyButton.className = "hidden";

  var message = messageInput.value;
  if (message.trim().length === 0) {
    outputMessage.innerText = "Must have a message"
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
  })
  .then(handleAPIResponse)
  .then(function(data) {
    localStorage.setItem('username', data.user.name);
    usernameDisplay.className = "";
    usernameDisplay.innerText = 'Hello, ' + data.user.name + '!';

    outputBox.className = "";
    outputBox.value = data.prophecy.message + '\n' + data.prophecy.timestamp +
      '\n' + data.user.publicKey + '\n' + data.prophecy.signature;

    copyButton.className = "";
    
  }).catch( function (error) {
    if (error.apiError === true) {
      error.response.json().then(function(text) {
        outputMessage.innerText = 'API error: ' + JSON.stringify(text);
      });
    } else {
      outputMessage.innerText = 'Network error :(';
    }
  });

  localStorage.setItem('secretKey', encodeBase64(keyPair.secretKey));
}

function onVerifyClick() {
  var messageInput = document.querySelector('#verificationInput');
  var outputMessage = document.querySelector('.message');
  var usernameDisplay = document.querySelector('#username');

  outputMessage.innerHTML = '';

  var message = messageInput.value;
  if (message.trim().length === 0) {
    outputMessage.innerText = "Must have a message"
    return;
  }

  var payload = { message: message };

  fetch('/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(handleAPIResponse)
  .then( function(data) {
     outputMessage.innerHTML = tmpl('verificationMessage', {
       date: Date(data.prophecy.timestamp),
       username: data.user.name,
       message: data.prophecy.message
     });
  }).catch( function (error) {
    // TODO detect if 400 ? show invalid : show error;
    console.error(error)
  });
}

function onCopyProof() {
  var copyBuffer = document.createElement('textarea');
  var outputBox = document.querySelector('#outputBox');

  document.body.appendChild(copyBuffer);
  copyBuffer.value = outputBox.value;
  copyBuffer.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
  } catch (err) {
    console.log('Oops, unable to copy');
  }

  document.body.removeChild(copyBuffer);
}
