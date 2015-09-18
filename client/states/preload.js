var preload = function(game){};

preload.prototype = {
  preload: function(){
    this.game.stage.disableVisibilityChange = true;

    //loading bar
    var loadingBar = this.add.sprite(600,300,"loading");
    loadingBar.anchor.setTo(0.5,0.5);
    this.load.setPreloadSprite(loadingBar);
    //load menu images
    this.game.load.image("gametitle","assets/gametitle.png");
    this.game.load.image("play","assets/play.png");
    this.game.load.image("gameover","assets/gameover.png");
    //load texture atlas and images for game rendering
    this.game.load.atlas('maincomp','assets/maincomp/maincomp.png', 'assets/maincomp/maincomp.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    this.game.load.atlas('viruses','assets/viruses/viruses.png', 'assets/viruses/viruses.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    this.game.load.image('menubg', 'assets/menubg.jpg');
    this.game.load.image("background", "assets/bg.png");
    this.game.load.image("ground", "assets/ground.png");
    this.game.load.image("gametitle", "assets/gametitle.png");
    this.game.load.image("brokenComp", "assets/broken_computer.png");
    //load scripts
    this.game.load.script('computer.js', 'sprites/computer.js');
    this.game.load.script('virus.js', 'sprites/virus.js');
    this.game.load.script('createStage', 'sprites/createStage.js');
    //load sound
    // this.game.load.audio('bg', ['fx/bg.mp3']);
    this.game.load.audio('bg', ['fx/rick.mp3']); // Rickroll FTW
    this.game.load.audio('bg2', ['fx/guile.mp3']); // Guile FTW
    this.game.load.audio('powerDown', ['fx/power_down.mp3']);
    this.game.load.audio('sparks', ['fx/spark.mp3']);
    this.game.load.audio('die', ['fx/die.mp3']);
    this.game.load.audio('explode', ['fx/explode.mp3']);


  },
    create: function(){
    console.log('Preloading data...');
    this.game.state.start("Menu");
  }
};
