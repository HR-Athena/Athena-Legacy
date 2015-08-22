
var towerScum = function(game){};

//Global variables

//HP for player 1
var health = 128;
// HP for player 2
var health_player2 = 128;

//Score
var score = 0;
var scoreString = '';
var scoreText;

//Monsters
var redViruses = {};
var blueViruses = {};
var yellowViruses = {};
var swordyViruses = {};
var goldswordyViruses = {};
var missiles = {};
var explosions = {};

//Round
var roundText;
var roundString;
var currentRound;
var currentRoundText;
var roundNumber = 1;

//PopUp Box
var popup;

//Text objects
var player1Text, player2Text;

//Game object
towerScum.prototype = {

  createText: function(text, game) {
    player1Text = this.game.add.text(100, 100, text, {fill: 'white'});

    // for (var i = 0; i < player1Text.text.length; i++) {
    //   correct[player1Text.text[i]] = false;
    // }

    // Defaults to ARCADE physics
    this.game.physics.arcade.enable(player1Text);
    player1Text.body.velocity.setTo(0, 0);
    console.log(player1Text);
  },
  destroyText: function(text) {
    // Remove the text form view
    text.exists = false;
  },
  verifyInput: function(char) {
    // console.log(char);
    if (char === player1Text.text[0]) {
      player1Text.text = player1Text.text.slice(1);
      // console.log('text length is:',player1Text.text.length);
    } 
    if (player1Text.text.length === 0) {
      // fire function that turns the viruses
      this.destroyText(player1Text); // destroy original text
      this.createText('turn'); // make new text appear

    }

    // else {
    //   // console.log(blueViruses);
    //   // console.log(blueVirus);
    //   var newBlue = blueViruses.children[0];
    //   blueViruses.children.push(newBlue);
    // } 
  },
  //Attack function
  attack: function(computer, virus){
    virus.animations.play('attack', 15, false, true);
    virus.y = virus.y - 25;
    virus.events.onAnimationComplete.add(function(){ //trigger another animation
      health -= 5;
      virus.animations.play('die');
      setTimeout(function(){virus.kill();}, 400);
      // var context = this;
    // sparkSound.play();
    });
  },

  attack_player2: function(computer, virus){
    virus.animations.play('attack', 15, false, true);
    virus.y = virus.y - 25;
    virus.events.onAnimationComplete.add(function(){ //trigger another animation
      health_player2 -= 5;
      virus.animations.play('die');
      setTimeout(function(){virus.kill();}, 400);
      // var context = this;
    // sparkSound.play();
    });
  },
  //Ratio to increase sprite size by 50%
  // ratio: function(number){
  //   var result = number + (number * 0.5 );
  //   return result;
  // },
  //Function to check if round has ended
  endRound: function(){
    //Checks how many monsters are left depending on what monsters are spawned
    var totalLeft;
    if(goldswordyViruses.hasOwnProperty('children')){
      totalLeft = goldswordyViruses.children.length + swordyViruses.children.length + blueViruses.children.length + redViruses.children.length;
    }else if(swordyViruses.hasOwnProperty('children')){
      totalLeft = swordyViruses.children.length + blueViruses.children.length + redViruses.children.length;
    }else if(redViruses.hasOwnProperty('children')){
      totalLeft = blueViruses.children.length + redViruses.children.length;
    }else{
      totalLeft = blueViruses.children.length;
      // console.log('total left: ', totalLeft)
    }
    //If there are no more monsters left, make the popup appear
    if(!totalLeft ){
      console.log('round ended');
      tween = this.game.add.tween(popup.scale).to( { x: 1, y: 1 }, 1000, Phaser.Easing.Elastic.Out, true);
      popup.alpha = 1;

    }
   },

   //Function to start next round
  nextRound: function(){
  this.roundStarted = false; //resets roundStarted to false so endRound won't be executed right away

  roundNumber++; //Round gets increased
  this.rounds[roundNumber](this); //spawns monsters for next round
  popup.alpha = 0; //hides the popup box
  tween = this.game.add.tween(popup.scale).to( { x: 0.1, y: 0.1 }, 1000, Phaser.Easing.Elastic.Out, true);
  },

  //Rounds object that contains functions to spawn monsters for each level respectively
   rounds : {
  1: function(context){
      blueVirus(context, 0, 0, 5);
    },
  2: function(context){
      blueVirus(context, 0, 0, 7);
      redVirus(context, 0, 0, 3);
  },
  3: function(context){
      blueVirus(context, 0, 0, 10);
      redVirus(context, 0, 0, 1);
      swordy(context, 0, 0, 5);
  },
  4: function(context){
      blueVirus(context, 0, 0, 15);
      redVirus(context, 0, 0, 3);
      yellowVirus(context, 0, 0, 1);
      goldSwordy(context, 0, 0, 2);
    },
  5: function(context){
      blueVirus(context, 0, 0, 15);
      redVirus(context, 0, 0, 5);
    },
  6: function(context){
      blueVirus(context, 0, 0, 20);
      redVirus(context, 0, 0, 5);
    },
  7: function(context){
      blueVirus(context, 0, 0, 25);
      redVirus(context, 0, 0, 5);
    },
  8: function(context){
      blueVirus(context, 0, 0, 25);
      redVirus(context, 0, 0, 10);
    },
  9: function(context){
      blueVirus(context, 0, 0, 30);
      redVirus(context, 0, 0, 10);
    },
  10: function(context){
      blueVirus(context, 0, 0, 35);
      redVirus(context, 0, 0, 15);
    },
  11: function(context){
      blueVirus(context, 0, 0, 40);
      redVirus(context, 0, 0, 20);
    },
  12: function(context){
      blueVirus(context, 0, 0, 45);
      redVirus(context, 0, 0, 20);
    },
  13: function(context){
      blueVirus(context, 0, 0, 50);
      redVirus(context, 0, 0, 25);
    },
  context: function(context){
    console.log(context);
  }


},
  //Creates the game layout
  create: function() {
    console.log('Creating game...');

    //create music
    music = this.game.add.audio('bg');
    music.loop = true;
    music.play();

    //create sparks sound effects
    powerDownSound = this.game.add.audio('powerDown');
    sparkSound = this.game.add.audio('sparks');
    dieSound = this.game.add.audio('die');
    explodeSound = this.game.add.audio('explode');
    
    createStage(this); //Loads stage

    compSprite(this); //Loads right mainframe
    comp2Sprite(this, -936, 0); //Loads left mainframe
    weapon(this); //Loads weapon
    var myContext = this;
    // setInterval(function(){ weapon(myContext); }, 3000);
    // computerCollision(this); //Loads collision line for right computer
    // leftComputerCollision(this); //Loads collision line for left computer
    // auto-spawn blue viruses
    setInterval(function(){ blueVirus(myContext, 0, 0, 1); }, 1000);
    // blueVirus(this, 0, 0, 1)
    //redVirus(this, 0, 0, 3)

    // this.rounds[roundNumber](this); //Executes first round of monster (Round defaults as 1)


    //health bar
    this.outerbar = this.add.bitmapData(134, 13);
    this.outerbar.context.fillStyle = '#00685e';
    this.outerbar.fill();
    this.barProgress = 128;      
    this.bar = this.add.bitmapData(128, 10); //sets width and height for bar
    this.game.add.sprite(1063, 328, this.outerbar); //outerbar
    this.game.add.sprite(1130 - (this.bar.width * 0.5), 330, this.bar);//x and y coordinates of bar 700,300

    //health bar for player 2
    this.outerbar2 = this.add.bitmapData(134, 13);
    this.outerbar2.context.fillStyle = '#00685e';
    this.outerbar2.fill();
    this.barProgress2 = 128;      
    this.bar2 = this.add.bitmapData(128, 10); //sets width and height for bar
    this.game.add.sprite(2, 328, this.outerbar2); //outerbar
    this.game.add.sprite(69 - (this.bar2.width * 0.5), 330, this.bar2);//x and y coordinates of bar 700,300


    //score related functions

    // scoreString = 'Score : ';
    // scoreText = this.game.add.text(10, 10, scoreString + score, { font: '28px Calibri', fill: '#fff' });


    //Current Round:
    // currentRound = 'Round : ';
    // currentRoundText = this.game.add.text(1060, 10, currentRound + roundNumber, { font: '28px Calibri', fill: '#fff' });

    //Round End Popup box
    popup = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'popup');
    popup.alpha = 0.0;
    popup.anchor.set(0.5);
    popup.inputEnabled = false;

    //Sets coordinates for okay button
    var pw = (popup.width/2) - 260;
    var ph = (popup.height / 2) - 8;

    //  And click the close button to close it down again
    var okayButton = this.game.make.sprite(pw, -ph, 'okay');
    okayButton.inputEnabled = true;
    okayButton.input.priorityID = 1;
    okayButton.input.useHandCursor = true;
    okayButton.events.onInputDown.add(this.nextRound, this);

    //Text for Round Cleared popup box
    roundString = 'ROUND CLEARED!';
    roundText = this.game.make.text(pw+60, -ph+50, roundString,  { font: '16px Calibri', fill: '#fff' });

    //Add Round Text and Okay Button to popup box
    popup.addChild(roundText);
    popup.addChild(okayButton);

    popup.scale.set(0.1);
    //invisible platform for illusion of depth
    // platform = this.game.add.group();

    // //  We will enable physics for any object that is created in this group
    // // Here we create the ground.
    // var invisible = platform.create(0, this.game.world.height-60, 'invisible');
    // this.game.physics.enable(invisible, Phaser.Physics.ARCADE);

    // //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    // invisible.scale.x = this.game.world.width;
    // invisible.body.immovable = true;
    // invisible.renderable = false;
   //  This stops it from falling away when you jump on it

   //Create Text
   this.createText("turn");
   //Create Listen for key events
   this.game.input.keyboard.addCallbacks(this, null, null, this.verifyInput);
  },




  //Things to perform on every frame change
  update: function() {



    //Checks for collision with ground and computer. Computer collision executes attack function
    this.game.physics.arcade.collide(blueViruses, ground, null, null, null);
    // this.game.physics.arcade.collide(blueViruses, collisionLine, this.attack, null, null);
    this.game.physics.arcade.collide(blueViruses, mainComp, this.attack, null, null);
    this.game.physics.arcade.collide(blueViruses, mainComp2, this.attack_player2, null, null);
    this.game.physics.arcade.collide(blueViruses, missiles, missileHit, null, null);
    // this.game.physics.arcade.collide(blueViruses, platform);

    this.game.physics.arcade.collide(redViruses, ground, null, null, null);
    // this.game.physics.arcade.collide(redViruses, collisionLine, this.attack, null, null);
    this.game.physics.arcade.collide(redViruses, missiles, missileHit, null, null);
    // this.game.physics.arcade.collide(redViruses, platform);

    this.game.physics.arcade.collide(yellowViruses, ground, null, null, null);
    // this.game.physics.arcade.collide(yellowViruses, collisionLine, this.attack, null, null);
    this.game.physics.arcade.collide(yellowViruses, missiles, missileHit, null, null);
    // this.game.physics.arcade.collide(yellowViruses, platform);

    this.game.physics.arcade.collide(swordyViruses, ground, null, null, null);
    // this.game.physics.arcade.collide(swordyViruses, collisionLine, this.attack, null, null);
    this.game.physics.arcade.collide(swordyViruses, missiles, missileHit, null, null);
    // this.game.physics.arcade.collide(swordyViruses, platform);

    this.game.physics.arcade.collide(goldswordyViruses, ground, null, null, null);
    // this.game.physics.arcade.collide(goldswordyViruses, collisionLine, this.attack, null, null);
    this.game.physics.arcade.collide(goldswordyViruses, missiles, missileHit, null, null);
    // this.game.physics.arcade.collide(goldswordyViruses, platform);

    this.game.physics.arcade.collide(ground, missiles, missileMiss, null, null);

    this.game.physics.arcade.collide(player1Text, ground, this.destroyText, null, null);

    this.bar.context.clearRect(0, 0, this.bar.width, this.bar.height);
     
     //color changes based on 50% health and 25% health
    if (this.barProgress < 32) {
      this.bar.context.fillStyle = '#f00';   
    }
    
    else if (this.barProgress < 64) {
      this.bar.context.fillStyle = '#ff0';
    }
    
    else {
      this.bar.context.fillStyle = '#0f0';
    }
        
    this.bar.context.fillRect(0, 0, this.barProgress, 8);
    this.game.add.tween(this).to({barProgress: health}, 100, null, true, 0); //each hit health updates and bar shrinks

    this.bar.dirty = true; //apparently this line is important but I dont know why

    // health bar 2
    this.bar2.context.clearRect(0, 0, this.bar2.width, this.bar2.height);
     
     //color changes based on 50% health and 25% health
    if (this.barProgress2 < 32) {
      this.bar2.context.fillStyle = '#f00';   
    }
    
    else if (this.barProgress2 < 64) {
      this.bar2.context.fillStyle = '#ff0';
    }
    
    else {
      this.bar2.context.fillStyle = '#0f0';
    }
        
    this.bar2.context.fillRect(0, 0, this.barProgress2, 8);
    this.game.add.tween(this).to({barProgress2: health_player2}, 100, null, true, 0); //each hit health updates and bar2 shrinks

    this.bar2.dirty = true; //apparently this line is important but I dont know why

    //If the basic monster has spawned, that means the round has started
    // if(blueViruses.children.length){
    //   this.roundStarted = true;
    // }

    // console.log(this.barProgress);

    //If the round has started, we can begin to check if all monsters are dead
    if(this.roundStarted){
      this.endRound();
    }
 
    //If HP is 0, change comp image to be broken and change to GameOver game state
    if(this.barProgress <= 0){
      console.log("You have lost!");
      var brokenComp = this.game.add.sprite(560, 310, 'brokenComp');
      // brokenComp.width = ratio(165);
      // brokenComp.height = ratio(142);
      mainComp.kill();
      controlPanel.kill();
      this.roundStarted = false;
      powerDownSound.play();
      var that = this;
      // setTimeout(function(){
      //   that.game.state.start("GameOver",true,false,score);
      //   }, 1000); 
    }

  },

  render: function(){
    this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00");//shows fps on top left
  }
};

