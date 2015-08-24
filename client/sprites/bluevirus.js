var blueVirus = function(that, x, y, direction) { // direction is 1 for right, 2 for left
  x = x || 0;
  y = y || 0;

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

  var walkPNGs2 = ['red/walk/01.png', 
                  'red/walk/02.png',
                  'red/walk/03.png',
                  'red/walk/04.png',
                  'red/walk/05.png',
                  'red/walk/06.png',
                  'red/walk/07.png',
                  'red/walk/08.png'];
//death animation
  var diePNGs2 = ['red/die/01.png', 
                'red/die/02.png',
                'red/die/03.png'];
//attack animation
  var attackPNGs2 = ['red/attack/01.png', 
                    'red/attack/02.png',
                    'red/attack/03.png',
                    'red/attack/04.png',
                    'red/attack/05.png'];


  var addMovement = function(virus, direction){

    that.game.physics.arcade.enable(virus);
    virus.body.collideWorldBounds = true;
    if (direction === 1) {
      virus.animations.add('walk', walkPNGs, 15, true);
      virus.animations.add('attack', attackPNGs, 15, true);
      virus.animations.add('die', diePNGs, 15, true);
      virus.animations.play('walk');
    } else if (direction === 2) {
      virus.animations.add('walk', walkPNGs2, 15, true);
      virus.animations.add('attack', attackPNGs2, 15, true);
      virus.animations.add('die', diePNGs2, 15, true);
      virus.animations.play('walk');
    }

    // var tween = that.game.add.tween(virus).to({ x: that.game.width }, 10000, Phaser.Easing.Linear.None, true);
    virus.body.gravity.y = 300;
    virus.body.bounce.y = 1;
    virus.anchor.setTo(0.5,0);
    if (direction === 1) {
      virus.body.velocity.x = 60;
      virus.scale.x = 1;
    } else if (direction === 2) {
      virus.body.velocity.x = -60;
      virus.scale.x = -1;
    }
  };
  
  if (direction === 1) {
    var newVirus = blueViruses.create(x, y, 'viruses', "blue/walk/01.png");
    addMovement(newVirus, direction);
  } else if (direction === 2) {
    var newVirus = blueViruses.create(x, y, 'viruses', "red/walk/01.png");
    addMovement(newVirus, direction);
  }

};