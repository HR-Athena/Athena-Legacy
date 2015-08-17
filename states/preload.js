var preload = function(game){}

preload.prototype = {
  preload: function(){ 
    var loadingBar = this.add.sprite(400,300,"loading");
    loadingBar.anchor.setTo(0.5,0.5);
    this.load.setPreloadSprite(loadingBar);
    this.game.load.spritesheet("numbers","assets/numbers.png",100,100);
    this.game.load.image("gametitle","assets/gametitle.png");
    this.game.load.image("play","assets/play.png");
    this.game.load.image("gameover","assets/gameover.png");
    this.game.load.atlas('maincomp','assets/maincomp/maincomp.png', 'assets/maincomp/maincomp.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    this.game.load.atlas('missiles','assets/missiles/missiles.png', 'assets/missiles/missiles.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    this.game.load.atlas('viruses','assets/viruses/viruses.png', 'assets/viruses/viruses.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    this.game.load.script('loadSprites.js', 'sprites/loadSprites.js');
    this.game.load.spritesheet('computerCollision', 'assets/collision_t.png', 3, 3); // game.load.image('computer','assets/computer.gif');
    this.game.load.script('computer.js', 'sprites/computer.js');
    this.game.load.script('bluevirus.js', 'sprites/bluevirus.js');
    this.game.load.script('redvirus.js', 'sprites/redvirus.js');
    this.game.load.script('yellowvirus.js', 'sprites/yellowvirus.js');
    this.game.load.script('swordy.js', 'sprites/swordy.js');
    this.game.load.script('goldswordy.js', 'sprites/goldswordy.js');
    this.game.load.script('computerCollision.js','sprites/computerCollision.js');
    this.game.load.script('createStage', 'sprites/createStage.js');
    this.game.load.image("background", "assets/bg.png");
  	this.game.load.image("ground", "assets/ground.png");
  	this.game.load.image("brokenComp", "assets/broken_computer.png");
  	this.game.load.image("popup", "assets/popup.png");
  	this.game.load.image("okay", "assets/okay.png");

  },
    create: function(){
    console.log('Preloading data...');
    this.game.state.start("Menu");
  }
}