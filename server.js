var express = require('express');
var path = require('path');
var Handlebars = require('express-handlebars');
var staticify = require("staticify")(path.join(__dirname, "static"));

var app = express();

app.use(staticify.middleware);

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

app.listen(3000, '127.0.0.1', function() {
  console.log('Listening on port 3000');
});

