var redVirus = function(that, x, y){ //x and y coordinates for positioning
  x = x || 0;
  y = x || 0;

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
    console.log('addMovement to redVirus');

    that.game.physics.arcade.enable(virus);
    virus.body.collideWorldBounds = true;

    virus.animations.add('walk', walkPNGs, 15, true);
    virus.animations.add('attack', attackPNGs, 15, true);
    virus.animations.add('die', diePNGs, 15, true);
    virus.animations.play('walk');

    //var tween = that.game.add.tween(virus).to({ x: that.game.width }, 10000, Phaser.Easing.Linear.None, true);
    // virus.enableBody = true;
    virus.body.gravity.y = 300;
    virus.body.velocity.x = -60;
    virus.body.bounce.y = 1;
    virus.anchor.setTo(0.5,0);
    virus.scale.x = -1;
  };

  var newVirus = redViruses.create(x, y, 'viruses', "red/walk/01.png");
  console.log('spawning redVirus:',newVirus);
  addMovement(newVirus);

};