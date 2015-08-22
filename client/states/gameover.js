var gameOver = function(game){}

gameOver.prototype = {
	init: function(){
		//Show player their score
		//alert("You scored: "+score);
	},
  	create: function(){
  		//Game over screen

  	// roundText = this.game.add.text(350, 250, 'You scored: ' + score,  { font: '16px Calibri', fill: '#fff' })
  	var gameOverTitle = this.game.add.sprite(400,200,"gameover");
		gameOverTitle.anchor.setTo(0.5,0.5);
		var playButton = this.game.add.button(400,300,"play",this.playTheGame,this);
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