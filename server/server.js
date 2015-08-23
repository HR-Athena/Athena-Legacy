var http = require('http');
var async = require('async');
var express = require('express');
var socketio = require('socket.io');
var favicon = require('serve-favicon');
var request = require ('request');
// var path = require('path');
var textStore = require('./textStore.js');

var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);

app.use(express.static(__dirname + "/../client"));
// app.use(favicon(__dirname + '/../client/favicon.ico'));
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

var messages = [];
var sockets = [];
var games = {};

io.on("connection", function(socket){
  console.log("a user connected");
  sockets.push(socket); // add a new socket to the sockets list
  console.log(sockets.length,'sockets now connected');
  console.log("at id:",sockets.indexOf(socket));

  // socket.on('disconnect', function () {
  //   sockets.splice(sockets.indexOf(socket), 1);
  //   console.log('a user disconnected');
  //   console.log(sockets.length,'sockets now connected');
  //   // updateRoster();
  // });

  socket.on('disconnect', function () {
    // sockets.splice(sockets.indexOf(socket), 1);
    // updateRoster();
    // console.log("games during disconnect", games);
    for(var key in games){
      // console.log("key", key);
      // console.log("games", games);
      // console.log("games[key]", games[key]);
      if (games[key] && games[key].player1 === socket){
        games[key].player1 = undefined;
      }
      if (games[key] && games[key].player2 === socket){
        games[key].player2 = undefined;
      }
      if(games[key] && games[key].viewers){
        for(var i = 0; i < games[key].viewers.length; i++){
          if(games[key].viewers[i] === socket){
            games[key].viewers.splice(i, 1);
          }
        }
      } 
    }

  });

  socket.on("credentials", function(credentials){
    console.log("received the following credentials", credentials);
    var gameId = credentials.id;
    var name = credentials.name;
    if(!games[gameId]){
      games[gameId] = {};
    }
    if(name){
      if(!games[gameId].player1){
        // console.log("player 1 if statement");
        games[gameId].player1 = socket;
        socket.emit("assign player", "player1");
      } else if(!games[gameId].player2){
        // console.log("player 2 if statement");
        games[gameId].player2 = socket;
        socket.emit("assign player", "player2");
      } else {
        if(!games[gameId].viewers){
          games[gameId].viewers = [];
        }
        games[gameId].viewers.push(socket);
      }
    }
    // console.log("the games object now is:", games);
    sockets.splice(sockets.indexOf(socket), 1);
  });

  //Sync key presses between views
  socket.on("keypress", function(data){
    data = JSON.parse(data);
    // console.log('data received from client:',data);
    var player1Level, newText1, player2Level, newText2, updateText1, updateText2;
    // newText1 = 'Starting';
    // newText2 = 'Starting';
    var gameId = data.credentials.id;
    var player = data.credentials.player;
    var player1Socket = games[gameId].player1;
    var player2Socket = games[gameId].player2;
    // console.log('games[gameId]:',games[gameId]);
    var roomSockets = [];
    if(player1Socket){
      if (player1Socket.text === undefined) {
        player1Socket.text = 'Starting';
      }
      roomSockets.push(player1Socket);
    }
    if(player2Socket){
      if (player2Socket.text === undefined) {
        player2Socket.text = 'Starting';
      }
      roomSockets.push(player2Socket);
    }
    if(games[gameId].viewers){
      roomSockets = roomSockets.concat(games[gameId].viewers);
    }

    if (player === 'player1') {
      //Check player 1 text
      if (data.input === player1Socket.text[0]) {
      // if (data.input === data.player1.text[0]) {
        player1Socket.text = player1Socket.text.slice(1);
        data.player1.text = player1Socket.text;
        if (player1Socket.text.length === 0) {
          player1Level = data.player1.level;
          // console.log('level:',player1Level,'textStore:',textStore[player1Level]);
          if (!newText1) {
            data.player1.updateText = textStore[player1Level][0];
            player1Socket.text = data.player1.updateText;
          } else {
            data.player1.updateText = newText1;
            player1Socket.text = data.player1.updateText;
          }
        }
      }
    // Player 2 Checks if socketId is 1
    } else if (player === 'player2') {
      //Check player2 Text
      if (data.input === player2Socket.text[0]) {
      // if (data.input === data.player1.text[0]) {
        player2Socket.text = player2Socket.text.slice(1);
        data.player2.text = player2Socket.text;
        if (player2Socket.text.length === 0) {
          player1Level = data.player2.level;
          // console.log('level:',player1Level,'textStore:',textStore[player1Level]);
          if (!newText1) {
            data.player2.updateText = textStore[player1Level][0];
            player2Socket.text = data.player2.updateText;
          } else {
            data.player2.updateText = newText1;
            player2Socket.text = data.player2.updateText;
          }
        }
      }
    }
    
    roomSockets.forEach(function(socket){
      console.log('player1 data to client:',data.player1);
      console.log('player2 data to client:',data.player2);
      socket.emit("returning the player data", {data: data});
    });
    // io.emit("returning the player data", {id: socketId, data: JSON.stringify(data)});
  });

  socket.on("Start the game", function(data){
    // console.log("I received a start message from the client");
    // io.emit("Start the game on the client");
    if (data.player) {
      var gameId = data.id;
      var player1Socket = games[gameId].player1;
      var player2Socket = games[gameId].player2;
      var roomSockets = [];
      if(player1Socket){
        roomSockets.push(player1Socket);
      }
      if(player2Socket){
        roomSockets.push(player2Socket);
      }
      if(games[gameId].viewers){
        roomSockets = roomSockets.concat(games[gameId].viewers);
      }
      roomSockets.forEach(function(socket){
        socket.emit("Start the game on the client");
      });
    }
  });

  // socket.on('message', function (msg) {
  //   var text = String(msg || '');

  //   if (!text)
  //     return;

  //   socket.get('name', function (err, name) {
  //     var data = {
  //       name: name,
  //       text: text
  //     };

  //     broadcast('message', data);
  //     messages.push(data);
  //   });
  // });


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

app.get('/games/create', function(req, res){

  // console.log("HERE IS A GET REQUEST FROM SLACK");
  // console.log(req.query);
  var player1 = req.query.user_name;
  var player2 = req.query.text;
  // console.log("whole req", req);

  var url  = 'https://hooks.slack.com/services/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';
  var gameUrlForPlayer1 = "https://towerscum-legacy.herokuapp.com/?id=" + req.query.user_id.toLowerCase() + "&player=" + player1;
  var gameUrlForPlayer2 = "https://towerscum-legacy.herokuapp.com/?id=" + req.query.user_id.toLowerCase() + "&player=" + player2;
  var messageForPlayer1 = "You have been challenged to a game of TowerScum: <" + gameUrlForPlayer1 + "| Click Here>";
  var messageForPlayer2 = "You have been challenged to a game of TowerScum: <" + gameUrlForPlayer2 + "| Click Here>";
  var payloadForPlayer1 = { "channel": "@" + player1, 
                        "username": "webhookbot", 
                        "text": messageForPlayer1,
                        "icon_emoji": ":ghost:"
              };
  var payloadForPlayer2 = { "channel": player2, // @sign is already in the message
                        "username": "webhookbot", 
                        "text": messageForPlayer2,
                        "icon_emoji": ":ghost:"
              };

  request({
    url: url,
    method: "POST",
    json: true,
    body: payloadForPlayer1
  }, function (error, response, body){
  });

  request({
    url: url,
    method: "POST",
    json: true,
    body: payloadForPlayer2
  }, function (error, response, body){
  });

  res.sendStatus(200);
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Tower Scum server listening at", addr.address + ":" + addr.port);
});

