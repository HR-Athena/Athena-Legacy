var http = require('http');
var async = require('async');
var express = require('express');
var socketio = require('socket.io');
var favicon = require('serve-favicon');
var request = require ('request');
var path = require('path');
var textStore = require('./textStore.js');

var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(__dirname + "/../landing"));
app.use("/multiplayer", express.static(__dirname + "/../client"));
app.use("/original", express.static(__dirname + "/../original-version"));

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

  socket.on('disconnect', function () {
    console.log("sockets", sockets.indexOf(socket));
    if(sockets.indexOf(socket) !== -1){
      console.log("found socket in the sockets array");
      sockets.splice(sockets.indexOf(socket), 1);
    } else {
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
    }
  });

  socket.on("credentials", function(credentials){
    console.log("received the following credentials", credentials);
    var gameId = credentials.id;
    if(gameId){
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
      } else {
        if(!games[gameId].viewers){
          games[gameId].viewers = [];
        }
        games[gameId].viewers.push(socket);
      }
      // if (games[gameId].player1 && games[gameId].player2) {
      //   games[gameId].player1.emit('Two players connected');
      //   games[gameId].player2.emit('Two players connected');
      // }
      // console.log("the games object now is:", games);
      sockets.splice(sockets.indexOf(socket), 1);
    }
  });

  var updateGame = function(char, player, id) {
    var gameRoom = games[id];
    // console.log('gameRoom',gameRoom);
    var returnObj = {
      player1: {
        updateText: false,
        text: gameRoom.properties.player1.text
      },
      player2: {
        updateText: false,
        text: gameRoom.properties.player2.text
      }
    };
    var playerProperties = gameRoom.properties[player];
    if (char === playerProperties.text[0]) {
      playerProperties.text = playerProperties.text.slice(1);
    }
    if (playerProperties.text.length === 0) {
      playerProperties.counter++;
      returnObj[player].updateText = true;
      if (playerProperties.counter % 2 === 0 && playerProperties.level < 10) {
        playerProperties.level++;
      }
      var index = Math.floor(Math.random() * textStore[playerProperties.level].length);
      console.log('index of newText',index,'level:',playerProperties.level,'counter:',playerProperties.counter);
      var newText = textStore[playerProperties.level][index];
      console.log('newText is:',newText);
      playerProperties.text = newText;
    }
    returnObj[player].text = playerProperties.text;
    // console.log('returnObj is:',returnObj);
    return returnObj;
  };

  //Sync key presses between views
  socket.on("keypress", function(data){
    var char = data.input;
    var gameId = data.id;
    var player = data.player;
    if (player) {
      var player1Socket = games[gameId].player1;
      var player2Socket = games[gameId].player2;
      // console.log('games[gameId]:',games[gameId]);
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

      var clientData = updateGame(char, player, gameId);
      
      roomSockets.forEach(function(socket){
        // console.log('data to client:',clientData);
        socket.emit("returning the player data", clientData);
      });
    }
    // io.emit("returning the player data", {id: socketId, data: JSON.stringify(data)});
  });

  socket.on("Start the game", function(data){
    // console.log("I received a start message from the client");
    // io.emit("Start the game on the client");
    if (data.player) {
      var gameId = data.id;
      games[gameId].properties = {
        player1: {
          text: 'Starting',
          level: 1,
          counter: 0
        },
        player2: {
          text: 'Starting',
          level: 1,
          counter: 0
        }
      };
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
      console.log('roomSockets Array:',roomSockets);
      roomSockets.forEach(function(socket){
        socket.emit("Start the game on the client");
      });
    }
  });

});


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
  var gameUrlForPlayer1 = "https://towerscum-legacy.herokuapp.com/multiplayer/?id=" + req.query.user_id.toLowerCase() + "&player=" + player1;
  var gameUrlForPlayer2 = "https://towerscum-legacy.herokuapp.com/multiplayer/?id=" + req.query.user_id.toLowerCase() + "&player=" + player2;
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


// LINKS FOR MULTIPLAYER
var multiplayerLinks = [];

var generateRoomId = function() {
  var symbols = "0123456789abcdefghijklmnopqrstuvwxyz";
  var id = '';
  for (var i = 0; i < 6; i++){
    var symbolIndex = Math.floor(Math.random() * symbols.length);
    var symbol = symbols[symbolIndex];
    id += symbol;
  }
  return id;
};

var generateMultiplayerLinks = function(){
  var id = generateRoomId();
  var url1 = "/multiplayer/?id=" + id + "&player=1";
  var url2 = "/multiplayer/?id=" + id + "&player=2";
  multiplayerLinks.push(url1);
  multiplayerLinks.push(url2);
};

// END OF LINKS FOR MULTIPLAYER

app.get('/', function(req, res){
  console.log("multiplayer links", multiplayerLinks);
  if(multiplayerLinks.length === 0){
    generateMultiplayerLinks();
  }
  res.render('index.ejs', {multiplayerLinks: multiplayerLinks});
});

app.get('/multiplayer', function(req, res){
  multiplayerLinks.shift();
  res.render('multiplayer.ejs');
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Tower Scum server listening at", addr.address + ":" + addr.port);
});

