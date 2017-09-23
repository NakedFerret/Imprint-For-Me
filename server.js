var express = require('express');
var path = require('path');
var Handlebars = require('express-handlebars');
var staticify = require("staticify")(path.join(__dirname, "static"));
var bodyParser = require('body-parser');
var Database = require('better-sqlite3');
var nacl = require('tweetnacl');
var constants = require('./src/constants');
var ajv = require('ajv')({ allErrors: true});
const getRandomInt = require('./src/utils/getRandomInt');

var prophecySchema = require('./src/schema/prophecy');

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
var findUserById = db.prepare('SELECT * FROM users WHERE id = ?');
var insertUser = db.prepare('INSERT INTO users (name, publicKey) VALUES (:name, :publicKey)');
var findProphecyBySignature = db.prepare('SELECT * FROM prophecies WHERE signature = ?');
var insertProphecy = db.prepare('INSERT INTO prophecies (message, timestamp, userId, signature) VALUES (:message, :timestamp, :userId, :signature)');

function padDigits(number, digits) {
  return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}

app.post('/prophecy', function(req, res) {
  const prophecyValidate = ajv.compile(prophecySchema);
  const valid = prophecyValidate(req.body);

  if (!valid) {
    res.status = 400;
    return res.send({ message: ajv.errorsText(prophecyValidate.errors) }); 
  }

  const { 
    message,
    timestamp,
    publicKey: publicKeyString,
    signature: signatureString
  } = req.body;

  var publicKey = Buffer.from(publicKeyString, 'base64');
  var signature = Buffer.from(signatureString, 'base64');

  var verified = nacl.sign.detached.verify(
    Buffer.from(message + timestamp), 
    signature, 
    publicKey
  );

  if (!verified) {
    res.status = 400;
    return res.send({
      message: 'Signature is invalid'
    });
  }

  var user = findUserByPubKey.get(publicKey);

  if (user === undefined) {
    var animalPart = constants.animals[Math.floor(Math.random() * constants.animals.length)];
    var adjectivePart = constants.adjectives[Math.floor(Math.random() * constants.adjectives.length)];
    var number = padDigits(getRandomInt(0,1000), 3);

    var insertResult = insertUser.run({ 
      name: adjectivePart + animalPart + number, 
      publicKey: publicKey
    });
    user = findUserById.get(insertResult.lastInsertROWID);
  }
    
  var prophecy = findProphecyBySignature.get(signature);

  if (
    prophecy === undefined || 
    prophecy.message !== message || prophecy.timestamp !== timestamp
  ) {
    insertProphecy.run({
      signature: signature,
      message: message,
      timestamp: timestamp,
      userId: user.id
    });
  }

  res.send({
   prophecy: {
     message: message,
     timestamp: timestamp,
     signature: signatureString,
   },
   user: {
     name: user.name,
     publicKey: publicKeyString,
   }
  });
});

app.listen(3000, function() {
  console.log('Listening on port 3000');
});

