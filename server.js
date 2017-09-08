var express = require('express');
var path = require('path');
var Handlebars = require('express-handlebars');
var staticify = require("staticify")(path.join(__dirname, "static"));
var bodyParser = require('body-parser');
var Database = require('better-sqlite3');
var nacl = require('tweetnacl');

var db = new Database('test.db');

var app = express();

app.use(staticify.middleware);
app.use(bodyParser.json());

var hbs = Handlebars.create({
  defaultLayout: 'main',
  helpers: {
    getAsset: staticify.getVersionedPath
  }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

var findUserByPubKey = db.prepare('SELECT * FROM users WHERE publicKey = ?');
var insertUser = db.prepare('INSERT INTO users (name, publicKey) VALUES (:name, :publicKey)');
var findProphecyBySignature = db.prepare('SELECT * FROM prophecies WHERE signature = ?');
var insertProphecy = db.prepare('INSERT INTO prophecies (message, timestamp, userId, signature) VALUES (:message, :timestamp, :userId, :signature)');

app.post('/prophecy', function(req, res) {
  // TODO: throw error if any inputs are missing
  var message = req.body.message;
  var timestamp = req.body.timestamp;
  var publicKey = req.body.publicKey;
  var signature = req.body.signature;

  if (message === undefined || timestamp === undefined ||
      publicKey === undefined || signature === undefined) {
    res.status = 400;
    res.send ({
      message: 'Missing parameters'
    });
  }

  if (message.trim().length === 0) {
    res.status = 400;
    return res.send({
      message: 'Message must be more than 0 chars'
    });
  }

  if (message.length > 130) {
    res.status = 400;
    return res.send({
      message: 'Message must be up to 130 chars'
    });
  }

  if (timestamp.length != 10) {
    res.status = 400;
    return res.send({
      message: 'Timestamp must be 10 char numeric string'
    });
  }

  publicKey = Buffer.from(publicKey, 'base64');
  signature = Buffer.from(signature, 'base64');

  if (publicKey.length !== 32) {
    res.status = 400;
    return res.send({
      message: 'Public key must be 32 bytes long'
    });
  }

  if (signature.length !== 64) {
    res.status = 400;
    return res.send({
      message: 'Signature must be 64 bytes long'
    }); 
  }

  var user = findUserByPubKey.get(publicKey);

  // TODO: insert user if not found

  var verified = nacl.sign.detached.verify(
    Buffer.from(message + timestamp), 
    signature, 
    user.publicKey
  );

  if (!verified) {
    res.status = 400;
    return res.send({
      message: 'Signature is invalid'
    });
  }
    
  var prophecy = findProphecyBySignature.get(signature);

  if (prophecy === undefined || 
      prophecy.message !== message || prophecy.timestamp !== timestamp) {
    insertProphecy.run({
      signature: signature,
      message: message,
      timestamp: timestamp,
      userId: user.id
    });
  }

  res.send('OK');
});

app.listen(3000, '127.0.0.1', function() {
  console.log('Listening on port 3000');
});

