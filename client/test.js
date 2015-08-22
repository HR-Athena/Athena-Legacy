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
        });

        socket.on('message', function(data) {
            console.log(data);
        });

        socket.on('returning the key', function(data) {
          // console.log("from server:", data);
          printText(data);
        });

    }
    // socket.socket.connect();
}
connect();

// ========== END OF THE SOCKET AREA ==========

$(document).keypress(function(e){
  socket.emit("keypress", String.fromCharCode(e.keyCode));
});

var printText = function(data){
  if(data.id === 1){
    $('.player1 span').append(data.data);
  } else {
    $('.player2 span').append(data.data);
  }
};
