var http = require('http');
var async = require('async');
var express = require('express');
var socketio = require('socket.io');
var favicon = require('serve-favicon');
var textStore = require('./textStore.js');

var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);

app.use(express.static(__dirname + "/../client"));
// app.use(favicon(__dirname + '/../client/favicon.ico'));

var messages = [];
var sockets = [];

io.on("connection", function(socket){
  console.log("a user connected");
  sockets.push(socket); // add a new socket to the sockets list
  console.log(sockets.length,'sockets now connected');
  console.log("at id:",sockets.indexOf(socket));

  socket.on('disconnect', function () {
    sockets.splice(sockets.indexOf(socket), 1);
    console.log('a user disconnected');
    console.log(sockets.length,'sockets now connected');
    // updateRoster();
  });

  //Sync key presses between views
  socket.on("keypress", function(data){
    var playerLevel, newText;
    data = JSON.parse(data);
    var socketId = sockets.indexOf(socket);
    //Player 1 Checks if socketid is 0
    if (socketId === 0) {
      //Check player 1 text
      if (data.input === data.player1.text[0]) {
        data.player1.text = data.player1.text.slice(1);
        if (data.player1.text.length === 0) {
          //Add new text string
          if (data.player2.counter % 5 === 0 && data.player2.level < 10) {
            //Reset player counter
            // data.player1.counter = 0;
            //Increment level
            data.player1.level++;
            var playerLevel = data.player1.level;
            var newText = textStore[playerLevel][Math.floor( Math.random() * textStore[playerLevel].length-1 )];
            if (!newText) {
              data.player1.updateText = textStore[playerLevel][0];
            } else {
              data.player1.updateText = newText;
            }
          } else {
            playerLevel = data.player1.level;
            newText = textStore[playerLevel][Math.floor( Math.random() * textStore[playerLevel].length-1 )];
            if (!newText) {
              data.player1.updateText = textStore[playerLevel][0];
            } else {
              data.player1.updateText = newText;
            }
          }
          //Trigger another action
        }
      } else {
        //Do Something
      }
    // Player 2 Checks if socketId is 1
    } else if (socketId === 1) {
      //Check player2 Text
      if (data.input === data.player2.text[0]) {
        data.player2.text = data.player2.text.slice(1);
        if (data.player2.text.length === 0) {
          //Add new text string
          if (data.player2.counter % 5 === 0 && data.player2.level < 10) {
            //Reset player counter
            // data.player2.counter = 0;
            //Increment level
            data.player2.level++;
            playerLevel = data.player2.level;
            newText = textStore[playerLevel][Math.floor( Math.random() * textStore[playerLevel].length-1 )];
            if (!newText) {
              data.player2.updateText = textStore[playerLevel][0];
            } else {
              data.player2.updateText = newText;
            }
          } else {
            playerLevel = data.player2.level;
            newText = textStore[playerLevel][Math.floor( Math.random() * textStore[playerLevel].length-1 )];
            if (!newText) {
              data.player2.updateText = textStore[playerLevel][0];
            } else {
              data.player2.updateText = newText;
            }
          }
          //Trigger another action
        } else {
        //Do Something
        }
      }
    }
    io.emit("returning the player data", {id: socketId, data: JSON.stringify(data)});
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

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Tower Scum server listening at", addr.address + ":" + addr.port);
});

