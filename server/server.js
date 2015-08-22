var http = require('http');
var async = require('async');
var express = require('express');
var socketio = require('socket.io');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var request = require ('request');
var path = require('path');

var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);

app.use(express.static(__dirname + "/../client"));
app.use(bodyParser.json());
// app.use(favicon(__dirname + '/../client/favicon.ico'));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


var messages = [];
var sockets = [];

io.on("connection", function(socket){
  console.log("a user connected");
  sockets.push(socket); // add a new socket to the sockets list

  socket.on('disconnect', function () {
    sockets.splice(sockets.indexOf(socket), 1);
    // updateRoster();
  });

  socket.on("keypress", function(data){
    var socketId = sockets.indexOf(socket);
    io.emit("returning the key", {id: socketId, data: data});
  });

  socket.on("Start the game", function(){
    console.log("I received a start message from the client");
    io.emit("Start the game on the client");
  });

  socket.on('message', function (msg) {
    var text = String(msg || '');

    if (!text)
      return;

    socket.get('name', function (err, name) {
      var data = {
        name: name,
        text: text
      };

      broadcast('message', data);
      messages.push(data);
    });
  });


});

// app.listen(port, function() {
//     console.log('Tower Scum is running on http://localhost:' + port);
// });


// ========== THIS IS THE SOCKET-RELATED MAGIC ==========
function updateRoster() {
  async.map(
    sockets,
    function (socket, callback) {
      socket.get('name', callback);
    },
    function (err, names) {
      broadcast('roster', names);
    }
  );
}

function broadcast(event, data) {
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
}

// ========== END OF SOCKET-RELATED MAGIC ==========
app.post('/games/create', function(req, res){

  var url  = 'https://hooks.slack.com/services/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';
  var payload = { "channel": "#random", 
                        "username": "webhookbot", 
                        "text": "I got "+ JSON.stringify(req.body), 
                        "icon_emoji": ":ghost:"
              };

  request({
    url: url,
    method: "POST",
    json: true,
    body: payload 
}, function (error, response, body){
    console.log(response);
});

  res.sendStatus(200);
  console.log(req.body);
})

app.get('/', function(req, res){
  // var id = req.query.id
  console.log("Hey");
  console.log (req.query);
  res.render('index.ejs')
})

/* 
url/?id='USER1_ID'

*/


server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Tower Scum server listening at", addr.address + ":" + addr.port);
});

// ========== SEND MESSAGE BACK TO SLACK ==========
// app.post('/games/create', function(req, res){
//   var url  = 'https://hooks.slack.com/services/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';
//   var payload = { "channel": "#random", 
//                         "username": "webhookbot", 
//                         "text": "This is posted to #general and comes from a bot named webhookbot. <https://www.google.com | Click Here> for details", 
//                         "icon_emoji": ":ghost:"
//               };

//   request({
//     url: url,
//     method: "POST",
//     json: true,
//     body: payload 
// }, function (error, response, body){
//     console.log(response);
// });

//   console.log(req.body);
// })

