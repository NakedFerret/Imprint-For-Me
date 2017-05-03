var express = require('express');
var assets = require('express-asset-versions');
var app = express();
var path = require('path');

var assetPath = path.join(__dirname, 'public');
app.use('/public', express.static(assetPath));
app.use(assets('/public', assetPath));

app.listen(3000, function() {
  console.log('App listening on 3000');
});
