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
    console.log(staticify.getVersionedPath('/styles.css'));
    res.render('home');
});

var findUserByPubKey = db.prepare('SELECT * FROM users WHERE publicKey = ?');
var insertUser = db.prepare('INSERT INTO users (name, publicKey) VALUES (:name, :publicKey)');
var findProphecyBySignature = db.prepare('SELECT * FROM prophecies WHERE signature = ?');
var insertProphecy = db.prepare('INSERT INTO prophecies (message, userId, signature) VALUES (:message, :userId, :signature)');

app.post('/prophecy', function(req, res) {
  // TODO: throw error if any inputs are missing
  var message = req.body.message;
  var timestamp = req.body.timestamp;
  var publicKey = req.body.publicKey;
  var signature = req.body.signature;

  var user = findUserByPubKey.get(Buffer.from(publicKey, 'base64'));

  // TODO: insert user if not found

  var verified = nacl.sign.detached.verify(
    Buffer.from(message + timestamp), 
    Buffer.from(signature, 'base64'), 
    user.publicKey
  );

  if (!verified) {
    res.status = 406;
    return res.send({
      message: 'Signature is invalid'
    });
  }
    
  var prophecy = findProphecyBySignature.get(Buffer.from(signature, 'base64'));

  // TODO: create new prophecy if not found

  // TODO: create new prophecy if message or timestamp don't match

  res.send('OK');
});

app.listen(3000, '127.0.0.1', function() {
  console.log('Listening on port 3000');
});

