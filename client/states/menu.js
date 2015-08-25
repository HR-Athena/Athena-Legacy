var menu = function(game){};

var loadText;

menu.prototype = {
  create: function(){
    background = this.game.add.group();
    var bg = background.create(0, 0, 'menubg');
    bg.scale.setTo(1.5, 1);
    //load game title and background
    this.game.add.tileSprite(0, 0, 800, 600, 'menubg');
    // this.game.add.sprite(0, 0, 'menubg');
    this.game.add.sprite(300,200,"gametitle");
    // loadText = this.game.add.text(600, 300, 'Waiting for opponent...', { font: '32px Impact', fill: '#fff' });
    // loadText.anchor.setTo(0.5,0);
    var playButton = this.game.add.button(600,450,"play",this.playTheGame,this);
    playButton.anchor.setTo(0.5,0.5);
    this.listenToMessages();


    //load play button
    // var playButton = this.game.add.button(600,400,"play",this.playTheGame,this);
    // playButton.anchor.setTo(0.5,0.5);
  },

  //Function to change state to TowerScum
  playTheGame: function(){
    console.log('Rendering menu...');
    socket.emit("Start the game", {id: roomId, player: player});
    // this.game.state.start("TowerScum");
  },
  listenToMessages: function(){
    var self = this;
    socket.on('Start the game on the client', function() {
      console.log("I received a start message from the server");
      self.game.state.start("TowerScum");
    });
    // this listens for when both players are connected
    // socket.on('Two players connected', function() {
    //   console.log('Two player sockets connected');
    //   //load play button
    //   var playButton = self.game.add.button(600,450,"play",self.playTheGame,self);
    //   playButton.anchor.setTo(0.5,0.5);
    //   loadText.text = 'Opponent connected - hit play!';
    // });
  }
};



