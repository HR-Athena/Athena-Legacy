console.log('loading computer sprite');

var ratio = function(number){
  var result = number + (number * 0.5 );
  return result;
};

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

  wheels = that.game.add.sprite(700+x, 485+y, 'maincomp', 'wheels_01.png');
  wheels.animations.add('spin', ['wheels_01.png','wheels_02.png','wheels_03.png','wheels_04.png','wheels_05.png'], 15, true);
  wheels.animations.play('spin');
  console.log(wheels.width);
  console.log(wheels.height);
  wheels.width = ratio(74);
  wheels.height = ratio(32);


  mainComp = that.game.add.sprite( 610+x, 300+y, 'maincomp', 'computer_01.png');
  mainComp.animations.add('computer', ['computer_01.png','computer_02.png','computer_03.png','computer_04.png','computer_05.png'], 15, true);
  mainComp.animations.play('computer');
  //original size: 142 x 150 - +50% size: 
  mainComp.width = ratio(142);
  mainComp.height = ratio(150);

  controlPanel = that.game.add.sprite(610+x, 429+y, 'maincomp', 'control_center_04.png');
  controlPanel.animations.add('blink', ['control_center_01.png', 'control_center_02.png', 'control_center_03.png', 'control_center_04.png', 'control_center_05.png'], 15, true);
  controlPanel.animations.play('blink');
  controlPanel.width = ratio(72);
  controlPanel.height = ratio(48);

};


var weapon = function(that, x, y){
  x = x || 0;
  y = y || 0;

  var fireWeapon = that.game.add.button(700,100,"fire", fireMissiles, that);
  fireWeapon.anchor.setTo(0.5,0.5);
  fireWeapon.width = 100;
  fireWeapon.height = 50;

  weaponPanel = that.game.add.sprite(580+x, 335+y, 'missiles', 'doors/_02.png');
  weaponPanel.animations.add('weaponFire', doorsPNGs, 15, true);
  weaponPanel.width = ratio(90); //stretches image by width
  weaponPanel.height = ratio(55); //stretches image by height
  weaponPanel.visible = false; //make panel invisible

  plate = that.game.add.sprite(630+x, 350+y, 'missiles', 'plate/_01.png');
  plate.animations.add('plate', platePNGs, 15, true);
  plate.width = ratio(40); //stretches image by width
  plate.height = ratio(45); //stretches image by height
  plate.visible = false;

  missiles = that.game.add.group();
  missiles.enableBody = true;
  missiles.physicsBodyType = Phaser.Physics.ARCADE;

    explosions = that.game.add.group();
  explosions.enableBody = true;
  explosions.physicsBodyType = Phaser.Physics.ARCADE;
  for(var i = 0; i < 6; i++){
    missile = missiles.create(620+ Math.random() * 50, 330+ Math.random() * 50, 'missiles', 'missile/_07.png');
    missile.animations.add('explode', explode, 18, false);
    that.game.physics.arcade.enable(missile);
    missile.enableBody = true;
    missile.physicsBodyType = Phaser.Physics.ARCADE;
    missile.visible = false;

    explosion = explosions.create(620+ Math.random() * 50, 330+ Math.random() * 50, 'missiles', 'missile/_34.png');
    explosion.animations.add('launch', explosionPNGs, 15, true);
    explosion.visible = false;
  }

};

var missileHit = function(virus, missile){
  missile.body.gravity.y=-200;
  explodeSound.play();
  virus.kill();
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
    for(var i = 0; i < 6; i++){
        explosions.children[i].animations.play('launch', 10, false, true);
        console.log(missiles[i]);
        missiles.children[i].visible = true;
        missiles.children[i].body.gravity.y = 100;
        missiles.children[i].body.velocity.x = -200;
    
      }
  });

  mainComp.animations.stop();
  controlPanel.animations.stop();
  setTimeout(function(){
    mainComp.animations.play('computer');
    controlPanel.animations.play('blink');
  }, 1000);
  
};