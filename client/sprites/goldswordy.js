console.log('loading swordy sprite');
var goldSwordy = function(that, x, y, number){ //x and y coordinates for positioning
  x = x || 0;
  y = x || 0;

  var drop = 0;

  console.log('spawning goldswordy');

  var walkPNGs = ['goldswordy/walk/01.png',
                  'goldswordy/walk/02.png',
                  'goldswordy/walk/03.png',
                  'goldswordy/walk/04.png',
                  'goldswordy/walk/05.png',
                  'goldswordy/walk/06.png'];

  var diePNGs = ['goldswordy/die/01.png',
                 'goldswordy/die/02.png',
                 'goldswordy/die/03.png',
                 'goldswordy/die/04.png',
                 'goldswordy/die/05.png',
                 'goldswordy/die/06.png'];

  var attackPNGs = [
                    'goldswordy/attack/01.png',
                    'goldswordy/attack/02.png',
                    'goldswordy/attack/03.png',
                    'goldswordy/attack/04.png',
                    'goldswordy/attack/05.png',
                    'goldswordy/attack/06.png',
                    'goldswordy/attack/07.png',
                    'goldswordy/attack/08.png',
                    'goldswordy/attack/09.png',
                    'goldswordy/attack/10.png'];

  var addMovement = function(virus){

    var startDrag = function(virus){
      virus.animations.play('airwalk');
      virus.body.moves = false;
      console.log('startDrag on goldswordy');
    }

  var stopDrag = function(virus){
        virus.body.moves = true;
        virus.animations.play('walk');
        virus.body.velocity.x = 100;
        virus.body.velocity.x += 25;
        drop += 1;
  
        if (virus.y < 200 && drop === 2){ // top of map = -10 or something bottom is like 590?
        	drop = 0;
          virus.animations.stop('walk');
          setTimeout(function(){
            virus.animations.play('die');
          }, 2000);
          setTimeout(function(){
            virus.kill();
            dieSound.play();
            score += 20;
            scoreText.text = scoreString + score; //score displayed
            
            goldswordyViruses.remove(virus);
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
    virus.animations.add('attack', attackPNGs, 10, true);
    virus.animations.add('die', diePNGs, 13, true);
    virus.animations.add('airwalk', walkPNGs, 45, true);
    virus.animations.play('walk');

    //var tween = that.game.add.tween(virus).to({ x: that.game.width }, 10000, Phaser.Easing.Linear.None, true);
    virus.enableBody = true;
    virus.body.gravity.y = 300
    virus.body.velocity.x = 100
  }


  goldswordyViruses = that.game.add.group();
  goldswordyViruses.enableBody = true;
  goldswordyViruses.physicsBodyType = Phaser.Physics.ARCADE;
  for(var i = 0; i < number; i++){
    setTimeout(function(){
      var goldSwordy = goldswordyViruses.create(0+x, 480+y, 'viruses', "goldswordy/walk/01.png");
      addMovement(goldSwordy);
    }, (i*1000)+800)

   }

};