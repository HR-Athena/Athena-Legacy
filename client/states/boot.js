var boot = function(game){

};
  
boot.prototype = {
  preload: function(){
    //loading page
    this.game.load.image("loading","assets/loading.png"); 
    this.game.time.advancedTiming = true; //needed for fps to show on top left
  },
  create: function(){
    //Sets attributes of game screen
  	console.log('Booting...');
    this.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
    this.scale.pageAlignHorizontally = true;
    this.scale.updateLayout();

    //Change to Preload gamestate
    this.game.state.start("Preload");
  }
};