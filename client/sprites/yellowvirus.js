console.log('loading yellowvirus sprite');
var yellowVirus = function(that, x, y, number){ //x and y coordinates for positioning
  x = x || 0;
  y = x || 0;

  var drop = 0;

  console.log('spawning yellowvirusSprite');

  var walkPNGs = ['yellow/walk/01.png',
                  'yellow/walk/02.png',
                  'yellow/walk/03.png',
                  'yellow/walk/04.png',
                  'yellow/walk/05.png',
                  'yellow/walk/06.png',
                  'yellow/walk/07.png',
                  'yellow/walk/08.png'];

  var diePNGs = ['yellow/die/01.png',
                'yellow/die/02.png',
                'yellow/die/03.png'];

  var attackPNGs = ['yellow/attack/01.png',
                    'yellow/attack/02.png',
                    'yellow/attack/03.png',
                    'yellow/attack/04.png',
                    'yellow/attack/05.png'];

  var addMovement = function(virus){

  	var startDrag = function(virus){
	    virus.animations.play('airwalk');
	    virus.body.moves = false;
	    tween.pause();
	    console.log('startDrag on redVirus');
    };

  var stopDrag = function(virus){
        virus.body.moves = true;
        virus.animations.play('walk');
        virus.body.velocity.x = 100;
        virus.body.velocity.x += 25;
        drop += 1;
        console.log(virus.y)
  
        if (virus.y < 200 && drop === 2){ // top of map = -10 or something bottom is like 590?
        	drop = 0; //reset the drop once it goes through
          virus.animations.stop('walk');
          setTimeout(function(){
            virus.animations.play('die');
          }, 2000);
          setTimeout(function(){
            virus.kill();
            dieSound.play();
            score += 20;
            scoreText.text = scoreString + score; //score displayed
            
            yellowViruses.remove(virus);
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


  yellowViruses = that.game.add.group();
  yellowViruses.enableBody = true;
  yellowViruses.physicsBodyType = Phaser.Physics.ARCADE;
  for(var i = 0; i < number; i++){
  	setTimeout(function(){
  		var yellowVirus = yellowViruses.create(0+x, 480+y, 'viruses', "yellow/walk/01.png");
  		addMovement(yellowVirus);
  	}, (i*1000)+250)
  	
  }

};