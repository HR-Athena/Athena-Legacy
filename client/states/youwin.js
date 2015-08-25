var youWin = function(game){};

youWin.prototype = {
  init: function(){
  },
    create: function(){
      //Player 1 wins screen
    roundText = this.game.add.text(600, 300, 'Player 1 Wins!', { font: '32px Impact', fill: '#fff' });
    roundText.anchor.setTo(0.5,0.5);
    var gameOverTitle = this.game.add.sprite(600,200,"gameover");
    gameOverTitle.anchor.setTo(0.5,0.5);
    var playButton = this.game.add.button(600,400,"play",this.playTheGame,this);
    playButton.anchor.setTo(0.5,0.5);
  },

  playTheGame: function(){
    socket.emit("Start the game", {id: roomId, player: player});
  },
  listenToMessages: function(){
    var self = this;
    socket.on('Start the game on the client', function() {
      console.log("I received a start message from the server");
      self.game.state.start("TowerScum");
    });
  }
};