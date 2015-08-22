var player, roomId, name;

// ========== THIS IS THE SOCKET AREA ==========
var socket = null;
function connect() {
    console.log('Connecting to local server...');
    if (socket === null) {
        socket = io.connect(null, {
            'auto connect': false
        });
        socket.on('connect', function() {
          console.log('Connected');
          roomId = location.search.match(/id=(.*)&/)[1];
          name = location.search.match(/player=@?(.*)/)[1];
          socket.emit("credentials", {id: roomId, name: name});
        });

        socket.on('message', function(data) {
            console.log(data);
        });

        socket.on('returning the key', function(data) {
          console.log("from server:", data);
          printText(data);
        });

      socket.on('assign player', function(data) {
        player = data;
      });

    }
    // socket.socket.connect();
}
connect();

// ========== END OF THE SOCKET AREA ==========

// var credentials = {roomId: roomId, name: name};

$(document).keypress(function(e){
  socket.emit("keypress", {credentials: {id: roomId, name: name, player: player}, data: String.fromCharCode(e.keyCode)});
});

var printText = function(message){
  console.log("receiving message", message);
  if(message.player === "player1"){
    $('.player1 span').append(message.data);
  } else if(message.player === "player2"){
    $('.player2 span').append(message.data);
  }
};


// var printText = function(data){
//   if(data.roomId === roomId){
//     if(data.name === name){
//       $('.player1 span').append(data.data);
//     } else if (data.name !== "visitor"){
//       $('.player2 span').append(data.data);
//     } else {
      
//     }
//   }
// };



