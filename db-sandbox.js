var Database = require('better-sqlite3');
var db = new Database('test.db');
 
var rows = db.prepare('SELECT * FROM users').all();
console.log(rows);
