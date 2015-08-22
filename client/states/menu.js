var menu = function(game){}

menu.prototype = {
  create: function(){
    //load game title and background
    this.game.add.tileSprite(0, 0, 800, 600, 'menubg');
    this.game.add.sprite(100,200,"gametitle");
    this.listenToMessages();

    //load play button
    var playButton = this.game.add.button(400,400,"play",this.playTheGame,this);
    playButton.anchor.setTo(0.5,0.5);
  },
  //Function to change state to TowerScum
  playTheGame: function(){
    console.log('Rendering menu...');
    socket.emit("Start the game");
    // this.game.state.start("TowerScum");
  },
  listenToMessages: function(){
    var self = this;
    socket.on('Start the game on the client', function() {
      console.log("I received a start message from the server");
      self.game.state.start("TowerScum");
    });
  }
};



