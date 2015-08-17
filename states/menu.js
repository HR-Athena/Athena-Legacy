var menu = function(game){}

menu.prototype = {
  create: function(){
    this.game.add.tileSprite(0, 0, 800, 600, 'menubg');
    this.game.add.sprite(100,200,"gametitle");

    var playButton = this.game.add.button(400,400,"play",this.playTheGame,this);
    playButton.anchor.setTo(0.5,0.5);
  },
  playTheGame: function(){
  	console.log('Rendering menu...');
    this.game.state.start("TowerScum");
  }
}