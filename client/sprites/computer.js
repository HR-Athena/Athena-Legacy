console.log('loading computer sprite');

var doorsPNGs = [
'doors/_01.png',
'doors/_02.png',
'doors/_03.png',
'doors/_04.png',
'doors/_05.png',
'doors/_06.png',
'doors/_07.png',
'doors/_08.png',
'doors/_09.png',
'doors/_10.png',
'doors/_11.png',
'doors/_12.png',
'doors/_13.png',
'doors/_14.png',
'doors/_15.png'
];

var platePNGs = [
'plate/_01.png',
'plate/_02.png',
'plate/_03.png',
'plate/_04.png',
'plate/_05.png',
'plate/_06.png',
'plate/_07.png'
];

var explosionPNGs = [
'missile/_34.png',
'missile/_35.png'
];

var explode = [
'explosions/_01.png',
'explosions/_02.png',
'explosions/_03.png',
'explosions/_04.png',
'explosions/_05.png',
'explosions/_06.png',
'explosions/_07.png',
'explosions/_08.png',
'explosions/_09.png',
'explosions/_10.png',
'explosions/_11.png',
'explosions/_12.png',
'explosions/_13.png',
'explosions/_14.png',
'explosions/_15.png',
'explosions/_16.png',
'explosions/_17.png',
'explosions/_18.png'
];

var wheels;
var mainComp;
var controlPanel;
var weaponPanel;
var explosions = [];

var compSprite = function(that, x, y){ //x and y coordinates for positioning

  x = x || 0;
  y = y || 0;

  wheels = that.game.add.sprite(1128+x, 468+y, 'maincomp', 'wheels_01.png');
  wheels.animations.add('spin', ['wheels_01.png','wheels_02.png','wheels_03.png','wheels_04.png','wheels_05.png'], 15, true);
  wheels.animations.play('spin');
  wheels.anchor.setTo(0);

  rightComp = that.game.add.sprite( 1068+x, 350+y, 'maincomp', 'computer_01.png');
  rightComp.animations.add('computer', ['computer_01.png','computer_02.png','computer_03.png','computer_04.png','computer_05.png'], 15, true);
  rightComp.animations.play('computer');
  rightComp.anchor.setTo(0);

  controlPanel = that.game.add.sprite(1068+x, 437+y, 'maincomp', 'control_center_04.png');
  controlPanel.animations.add('blink', ['control_center_01.png', 'control_center_02.png', 'control_center_03.png', 'control_center_04.png', 'control_center_05.png'], 15, true);
  controlPanel.animations.play('blink');
  controlPanel.anchor.setTo(0);
  that.game.physics.enable(rightComp, Phaser.Physics.ARCADE);
  rightComp.body.immovable = true;
};

var comp2Sprite = function(that, x, y){ //x and y coordinates for positioning

  x = x || 0;
  y = y || 0;

  wheels2 = that.game.add.sprite(1008+x, 470+y, 'maincomp', 'wheels_01.png');
  wheels2.animations.add('spin', ['wheels_01.png','wheels_02.png','wheels_03.png','wheels_04.png','wheels_05.png'], 15, true);
  wheels2.animations.play('spin');
  wheels2.anchor.setTo(0);
  wheels2.scale.x = -1; // specify direction

  leftComp = that.game.add.sprite(1000+x, 350+y, 'maincomp', 'computer_01.png');
  leftComp.animations.add('computer', ['computer_01.png','computer_02.png','computer_03.png','computer_04.png','computer_05.png'], 15, true);
  leftComp.animations.play('computer');
  leftComp.anchor.setTo(0.5, 0);
  leftComp.scale.x = -1; // specify direction

  controlPanel2 = that.game.add.sprite(1068+x, 437+y, 'maincomp', 'control_center_04.png');
  controlPanel2.animations.add('blink', ['control_center_01.png', 'control_center_02.png', 'control_center_03.png', 'control_center_04.png', 'control_center_05.png'], 15, true);
  controlPanel2.animations.play('blink');
  controlPanel2.anchor.setTo(0);
  controlPanel2.scale.x = -1; // specify direction

  that.game.physics.enable(leftComp, Phaser.Physics.ARCADE);
  leftComp.body.immovable = true;

};


var weapon = function(that, x, y){
  x = x || 0;
  y = y || 0;

  var fireWeapon = that.game.add.button(1100,100,"fire", fireMissiles, that);
  fireWeapon.anchor.setTo(0.5,0.5);
  fireWeapon.width = 100;
  fireWeapon.height = 50;



  weaponPanel = that.game.add.sprite(1050+x, 370+y, 'missiles', 'doors/_02.png');
  weaponPanel.animations.add('weaponFire', doorsPNGs, 15, true);
  // weaponPanel.width = ratio(90); //stretches image by width
  // weaponPanel.height = ratio(55); //stretches image by height
  weaponPanel.visible = false; //make panel invisible

  plate = that.game.add.sprite(1075+x, 382+y, 'missiles', 'plate/_01.png');
  plate.animations.add('plate', platePNGs, 15, true);
  // plate.width = ratio(40); //stretches image by width
  // plate.height = ratio(45); //stretches image by height
  plate.visible = false;

  missiles = that.game.add.group();
  missiles.enableBody = true;
  missiles.physicsBodyType = Phaser.Physics.ARCADE;

  explosions = that.game.add.group();
  explosions.enableBody = true;
  explosions.physicsBodyType = Phaser.Physics.ARCADE;

  for(var i = 0; i < 8; i++){
    missile = missiles.create(1040+ Math.random() * 50, 360+ Math.random() * 50, 'missiles', 'missile/_07.png');
    missile.animations.add('explode', explode, 18, false);
    that.game.physics.arcade.enable(missile);
    missile.enableBody = true;
    missile.physicsBodyType = Phaser.Physics.ARCADE;
    missile.visible = false;

    explosion = explosions.create(1040+ Math.random() * 50, 360+ Math.random() * 50, 'missiles', 'missile/_34.png');
    explosion.animations.add('launch', explosionPNGs, 15, true);
    explosion.visible = false;
  }

};

var missileHit = function(virus, missile){
  missile.body.gravity.y=-200;
  explodeSound.play();
  virus.kill();
  virus.parent.removeChild(virus);
  missile.play('explode');
  missile.body.velocity.x=0;
  setTimeout(function(){
    missile.kill();
  }, 1000);
  
};

var missileMiss = function(ground, missile){
  missile.body.gravity.y=-200;
  explodeSound.play();
  // virus.kill();
  // virus.parent.removeChild(virus);
  missile.play('explode');
  missile.body.velocity.x=0;
  setTimeout(function(){
    missile.kill();
  }, 1000);
  
};

var fireMissiles = function(){
  weaponPanel.visible = true; //make panel visible
  weaponPanel.animations.play('weaponFire', 10, false, true);

  weaponPanel.events.onAnimationComplete.add(function(){ //trigger another animation
    plate.visible = true;
    plate.animations.play('plate', 10, false, true);
    for(var i = 0; i < 8; i++){
        explosions.children[i].animations.play('launch', 10, false, true);
        console.log(missiles[i]);
        missiles.children[i].visible = true;
        missiles.children[i].body.gravity.y = 200;
        missiles.children[i].body.velocity.x = -200 + (-25 * i);
        missiles.children[i].body.velocity.y = -20 + (-25 * i);
        
      }
  });


  rightComp.animations.stop();
  controlPanel.animations.stop();
  setTimeout(function(){
    rightComp.animations.play('computer');
    controlPanel.animations.play('blink');
  }, 1);

};