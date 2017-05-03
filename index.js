require('dotenv').config()
var nacl = require("tweetnacl");

var keyPair = nacl.sign.keyPair();

var message = "I'm calling it now Donald trump starts WWIII";

var signature = nacl.sign.detached(Buffer.from(message), keyPair.secretKey);

console.log('Message:', message);
console.log('Signature:', signature.length, 'bytes,', Buffer.from(signature).toString('base64').length, ' base64 chars');

var knex = require('knex')({
  client: process.env.KNEX_DB_CLIENT,
  connection: {
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password: process.env.DB_PASS,
    database : process.env.DB
  }
});

console.log(knex.select().from('users').toString());

knex.select().from('users').then(function(data) {
  console.log(data);
});

