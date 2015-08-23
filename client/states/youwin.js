var youWin = function(game){}

youWin.prototype = {
  init: function(){
    //Show player their score
    // alert("You Won!");
  },
    create: function(){
      //Game over screen

    roundText = this.game.add.text(600, 300, 'Player 1 Wins!', { font: '32px Impact', fill: '#fff' });
    roundText.anchor.setTo(0.5,0.5);
    var gameOverTitle = this.game.add.sprite(600,200,"gameover");
    gameOverTitle.anchor.setTo(0.5,0.5);
    var playButton = this.game.add.button(600,400,"play",this.playTheGame,this);
    playButton.anchor.setTo(0.5,0.5);
  },
  //Play button that resets HP, barProgress, and Round
  //Also changes game state to TowerScum to start game again
  playTheGame: function(){
  this.barProgress = 128;
  this.barProgress2 = 128;
  health_player1 = 128;
  health_player2 = 128;
  this.game.state.start("TowerScum");
  // roundNumber = 1;
   }
};