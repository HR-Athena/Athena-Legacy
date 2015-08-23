var createStage = function(that){

  // bg = that.game.add.sprite(0,0,'background');
  // bg.width = 800;
  // bg.height = 502;
  that.game.world.setBounds(0, 0, 1200, 600);

  gameCanvas = that.game.add.sprite(0, 0, 'background');
  gameCanvas.width = 1200;
  gameCanvas.height = 600; //made this 502 to prevent the white lines from showing

  ground = that.game.add.sprite(0,500, 'ground');
  ground.width = 1200;
  ground.height = 178; //as bg.height increases lower this number by whatever you increase bg by

  that.game.physics.enable(ground, Phaser.Physics.ARCADE);

  that.game.physics.enable(gameCanvas, Phaser.Physics.ARCADE);

  ground.body.immovable = true;
  
  gameCanvas.body.immovable = true;

};