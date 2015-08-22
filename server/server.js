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
var games = {};

// var games = {gameId: {player1: socket, player2: socket, viewers: []}};
// var games = {gameId: {players: [], viewers:[]}};


io.on("connection", function(socket){
  console.log("a user connected");
  sockets.push(socket); // add a new socket to the sockets list
  console.log("games", games);

  socket.on('disconnect', function () {
    // sockets.splice(sockets.indexOf(socket), 1);
    // updateRoster();
    console.log("games during disconnect", games);
    for(var key in games){
      console.log("key", key);
      console.log("games", games);
      console.log("games.key", games.key);
      if (games.key.player1 === socket){
        games.key.player1 = undefined;
      }
      if (games.key.player2 === socket){
        games.key.player2 = undefined;
      }
      for(var i = 0; i < games.key.viewers.length; i++){
        if(games.key.viewers[i] === socket){
          games.key.viewers.splice(i, 1);
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
        console.log("player 1 if statement");
        games[gameId].player1 = socket;
        socket.emit("assign player", "player1");
      } else if(!games[gameId].player2)
        console.log("player 2 if statement");
        games[gameId].player2 = socket;
        socket.emit("assign player", "player2");
    } else {
      if(!games[gameId].viewers){
        games[gameId].viewers = [];
      }
      games[gameId].viewers.push(socket);
    }
    console.log("the games object now is:", games);
    sockets.splice(sockets.indexOf(socket), 1);
  });


  // PREVIOUS STRUCTURE OF GAMEID OBJECT
    // if(!games[gameId][player1] && name){
    //   // socket.name = name
    //   games[gameId][player1] = socket;
    //   socket.emit("assign player", "player1");
    //   games[gameId][viewers] = [];
    // }else{
    //   if(name){
    //     games[gameId][player2] = socket;
    //     socket.emit("assign player", "player2");
    //   } else {
    //     games[gameId][viewers].push(socket);
    //   }
    // }


  socket.on("keypress", function(message){
    console.log("detected a keypress");
    console.log("received a message:", message);
    var gameId = message.credentials.id;
    var player = message.credentials.player;
    var player1Socket = games[gameId].player1;
    var player2Socket = games[gameId].player2;
    var sockets = [];
    if(player1Socket){
      sockets.push(player1Socket);
    }
    if(player2Socket){
      sockets.push(player2Socket);
    }
    if(games[gameId].visitors){
      sockets = sockets.concat(games[gameId].visitors);
    }
    sockets.forEach(function(socket){
      socket.emit("returning the key", {player: player, data: message.data});
    });
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


// app.post('/games/create', function(req, res){

//   console.log("!!!***===REQUEST!!!===***!!!:", req);
//   // console.log("whole req", req);

//   var url  = 'https://hooks.slack.com/services/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';
//   var payload = { "channel": "#random", 
//                         "username": "webhookbot", 
//                         "text": "I got something" + JSON.stringify(req.body),
//                         "icon_emoji": ":ghost:"
//               };

//   request({
//     url: url,
//     method: "POST",
//     json: true,
//     body: payload 
// }, function (error, response, body){
// });

//   res.sendStatus(200);
// });


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




app.get('/', function(req, res){
  // var id = req.query.id
  // console.log ("ID OF THE FUTURE GAME IS ", req.query.id);
  res.render('index.ejs');
});


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

