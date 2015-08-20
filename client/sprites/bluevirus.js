var blueVirus = function(that, x, y, number, virusDead) {
  x = x || 0;
  y = y || 0;

  console.log('spawning bluevirusSprite');
  var walkPNGs = [
  "blue/walk/01.png", 
  "blue/walk/02.png", 
  "blue/walk/03.png",
  "blue/walk/04.png", 
  "blue/walk/05.png", 
  "blue/walk/06.png",
  "blue/walk/07.png", 
  "blue/walk/08.png"
  ];
  var attackPNGs = [
  "blue/attack/01.png", 
  "blue/attack/02.png", 
  "blue/attack/03.png",
  "blue/attack/04.png", 
  "blue/attack/05.png"
  ];

  var diePNGs = [
  "blue/die/01.png",
  "blue/die/02.png", 
  "blue/die/03.png"
  ];

  // game.physics.startSystem(Phaser.Physics.ARCADE);
  // game.physics.arcade.gravity.y = 100;



  var addMovement = function(virus){

  var startDrag = function(virus){
    virus.animations.play('airwalk');
    virus.body.moves = false;
    virus.input.boundsSprite = bg;
     //tween.pause();
  }

  var stopDrag = function(virus){
        virus.body.moves = true;
        virus.animations.play('walk');
        virus.body.velocity.x = 100
  
        if (virus.y < 200){ // top of map = -10 or something bottom is like 590?
          virus.animations.stop('walk');
          setTimeout(function(){
            virus.animations.play('die');
          }, 2000);
          setTimeout(function(){
            virus.kill();
            
            score += 20;
            scoreText.text = scoreString + score; //score displayed
            
            blueViruses.remove(virus);
          }, 2150);
          virus.body.velocity.x = 50;
          virus.body.velocity.y = 0;
        }
        //tween = that.game.add.tween(virus).to({ x: that.game.width }, 10000, Phaser.Easing.Linear.None, true);
    }


	that.game.physics.arcade.enable(virus);
    virus.body.collideWorldBounds = true;
    virus.inputEnabled = true;
    virus.input.enableDrag(true);
    virus.input.boundsSprite = gameCanvas;

    virus.events.onDragStart.add(startDrag, this);
    virus.events.onDragStop.add(stopDrag, this);

    virus.animations.add('walk', walkPNGs, 15, true);
    virus.animations.add('attack', attackPNGs, 15, true);
    virus.animations.add('airwalk', walkPNGs, 45, true);
    virus.animations.add('die', diePNGs, 15, true);
    virus.animations.play('walk');

    //var tween = that.game.add.tween(virus).to({ x: that.game.width }, 10000, Phaser.Easing.Linear.None, true);
    virus.body.gravity.y = 300
    virus.body.velocity.x = 100

  }

  blueViruses = that.game.add.group();
  blueViruses.enableBody = true;
  blueViruses.physicsBodyType = Phaser.Physics.ARCADE;
  for(var i = 0; i < number; i++){
  	setTimeout(function(){
  		var blueVirus = blueViruses.create(0+x, 480+y, 'viruses', "blue/walk/01.png");
  		addMovement(blueVirus);
  	}, i*1000)
  }
  
  //var blueVirus = game.add.sprite(0+x, 480+y, 'viruses', "blue/walk/01.png");


  


  // blueVirus.animations.add('attack', attackPNGs, 15, true);
  // blueVirus.animations.play('attack');

  


};