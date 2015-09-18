console.log('loading redvirus sprite');
var redVirus = function(that, x, y, number){ //x and y coordinates for positioning
  x = x || 0;
  y = x || 0;

  console.log('spawning redvirusSprite');
//walk animation
  var walkPNGs = ['red/walk/01.png', 
                  'red/walk/02.png',
                  'red/walk/03.png',
                  'red/walk/04.png',
                  'red/walk/05.png',
                  'red/walk/06.png',
                  'red/walk/07.png',
                  'red/walk/08.png'];
//death animation
  var diePNGs = ['red/die/01.png', 
                'red/die/02.png',
                'red/die/03.png'];
//attack animation
  var attackPNGs = ['red/attack/01.png', 
                    'red/attack/02.png',
                    'red/attack/03.png',
                    'red/attack/04.png',
                    'red/attack/05.png'];

  var addMovement = function(virus){

// when dragging viruses speed up their walk but there is no actual movement
  	var startDrag = function(virus){
	    virus.animations.play('airwalk');
	    virus.body.moves = false;
	    console.log('startDrag on redVirus');
    }

//once the player does the stop drag
  var stopDrag = function(virus){
        virus.body.moves = true; //virus begins to move
        virus.animations.play('walk');
        virus.body.velocity.x = 100
  
        if (virus.y < 200){ // top of map = -10 or something bottom is like 590 but if the player holds the virus lower than 200 the virus will die
          virus.animations.stop('walk');
          setTimeout(function(){
            virus.animations.play('die');
          }, 2000);
          setTimeout(function(){
            virus.kill();
            dieSound.play();
            score += 20;
            scoreText.text = scoreString + score; //score displayed
            
            redViruses.remove(virus);
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

    virus.events.onDragStart.add(startDrag, this);
    virus.events.onDragStop.add(stopDrag, this);

    virus.animations.add('walk', walkPNGs, 15, true);
    virus.animations.add('attack', attackPNGs, 15, true);
    virus.animations.add('die', diePNGs, 15, true);
    virus.animations.add('airwalk', walkPNGs, 45, true);
    virus.animations.play('walk');

    //var tween = that.game.add.tween(virus).to({ x: that.game.width }, 10000, Phaser.Easing.Linear.None, true);
    virus.enableBody = true;
    virus.body.gravity.y = 300
    virus.body.velocity.x = 100
	
  }


  redViruses = that.game.add.group();
  redViruses.enableBody = true;
  redViruses.physicsBodyType = Phaser.Physics.ARCADE;
  for(var i = 0; i < number; i++){ //the amount of virus that will be spawned
  	setTimeout(function(){
  		var redVirus = redViruses.create(0+x, 480+y, 'viruses', "red/walk/01.png"); // the spawn coordinates for the virus
  		addMovement(redVirus);
  	}, (i*1000)+500)// the time between each spawn
  	
  }

};