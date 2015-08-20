var express = require('express');
var favicon = require('serve-favicon');

var app = express();

var port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/../client"));
// app.use(favicon(__dirname + '/../client/favicon.ico'));

app.listen(port, function() {
    console.log('Tower Scum is running on http://localhost:' + port);
});

