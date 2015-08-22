
var towerScum = function(game){};

//Global variables

//HP for player 1
var health_player1 = 128;
// HP for player 2
var health_player2 = 128;

//Score
// var score = 0;
// var scoreString = '';
// var scoreText;

// var to check if spawning is happening
var spawning = false;

//Monsters
var blueViruses; 

var redViruses = {};
// var blueViruses = {};
var yellowViruses = {};
var swordyViruses = {};
var goldswordyViruses = {};
var missiles = {};
var explosions = {};

//Round
// var roundText;
// var roundString;
// var currentRound;
// var currentRoundText;
// var roundNumber = 1;

//PopUp Box
var popup;

//Player objects
var player1 = {
  level: 1,
  counter: 0,
  updateText: '',
  text: {}
};
var player2 = {
  level: 1,
  counter: 0,
  updateText: '',
  text: {}
};

var textStyle = {
  font: '24pt sans-serif',
  fill: '#FF8E61',
  wordWrap: true
}

//Socket
var socket;

//Game object
towerScum.prototype = {

  createStartText: function(text){
    this.createPlayer1Text(text);
    this.createPlayer2Text(text);
  },

  createPlayer1Text: function(text) {
    if (player1.text) {
      delete player1.text;
    }
    //Create player 1 Text
    player1.text = this.game.add.text(100, 75, text, textStyle);
 
    //Enable Physics on Text - Defaults to ARCADE physics
    this.game.physics.arcade.enable(player1.text);
    
    //Set velocity to fall at constant rate
    player1.text.body.velocity.setTo(0, 10);
    
  },

  createPlayer2Text: function(text) {
    
    if (player2.text) {
      delete player2.text;
    }
    //Create player 2 text
    player2.text = this.game.add.text(800, 75, text, textStyle);

    //Enabe physics
    this.game.physics.arcade.enable(player2.text);

    //Set velocity
    player2.text.body.velocity.setTo(0, 10);
  },

  destroyText: function(text) {
    // Remove the text form view
    text.exists = false; 
  },

  emitKeypress: function(char) {
    data = {
      'player1': {
        level: player1.level,
        counter: player1.counter,
        updateText: player1.updateText,
        text: player1.text.text
      },
      'player2': {
        level: player2.level,
        counter: player2.counter,
        updateText: player2.updateText,
        text: player2.text.text
      },
      'input': char
    }
    socket.emit("keypress", JSON.stringify(data));
  },

  verifyInput: function(data) {
    data = JSON.parse(data.data);
    // FIX WHEN NO TEXT IS PRESENT -- OR IS DESTROYED
    if (data.player1.updateText !== '') {
      console.log("player1: ", data.player1.updateText);
      this.createPlayer1Text(data.player1.updateText);
      player1.updateText = '';
    } 
    if (player1.text !== data.player1.text) {
      console.log('updating p1 text: ', data.player1.text);
      player1.text.text = data.player1.text;
    } 
    if (data.player2.updateText !== '') {
      console.log("player2: ", data.player2.updateText);
      this.createPlayer2Text(data.player2.updateText);
      player2.updateText = '';
    }
    if (player2.text !== data.player2.text) {
      console.log('updating p2 text: ', data.player2.text);
      player2.text.text = data.player2.text;
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
  attack_player1: function(computer, virus){
    virus.animations.play('attack', 15, false, true);
    virus.y = virus.y - 25;
    virus.events.onAnimationComplete.add(function(){ //trigger another animation
      health_player1 -= 50;
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

  spawnVirus: function(context) {
    spawning = true;
    setTimeout(function() { 
      blueVirus(context, 0, 0);
      spawning = false;
    }, 1000);
  },

  //Creates the game layout
  create: function() {
    console.log('Creating game...');
    //Save socket variable for access later
    socket = socket;
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
    blueViruses = this.game.add.group();
    blueViruses.enableBody = true;
    blueViruses.physicsBodyType = Phaser.Physics.ARCADE;

    compSprite(this); //Loads right mainframe
    comp2Sprite(this, -936, 0); //Loads left mainframe
    // weapon(this); //Loads weapon
    // var myContext = this;
    // setInterval(function(){ weapon(myContext); }, 3000);
    // computerCollision(this); //Loads collision line for right computer
    // leftComputerCollision(this); //Loads collision line for left computer
    // auto-spawn blue viruses
    this.spawnVirus(this);
    // blueVirus(this, 0, 0, 1)
    //redVirus(this, 0, 0, 3)

    // this.rounds[roundNumber](this); //Executes first round of monster (Round defaults as 1)


    //health bar for right player
    this.outerbar = this.add.bitmapData(134, 13);
    this.outerbar.context.fillStyle = '#00685e';
    this.outerbar.fill();
    this.barProgress = 128;      
    this.bar = this.add.bitmapData(128, 10); //sets width and height for bar
    this.game.add.sprite(1063, 328, this.outerbar); //outerbar
    this.game.add.sprite(1130 - (this.bar.width * 0.5), 330, this.bar);//x and y coordinates of bar 700,300

    //health bar for left player
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
    // popup = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'popup');
    // popup.alpha = 0.0;
    // popup.anchor.set(0.5);
    // popup.inputEnabled = false;

    // //Sets coordinates for okay button
    // var pw = (popup.width/2) - 260;
    // var ph = (popup.height / 2) - 8;

    // //  And click the close button to close it down again
    // var okayButton = this.game.make.sprite(pw, -ph, 'okay');
    // okayButton.inputEnabled = true;
    // okayButton.input.priorityID = 1;
    // okayButton.input.useHandCursor = true;
    // okayButton.events.onInputDown.add(this.nextRound, this);

    // //Text for Round Cleared popup box
    // roundString = 'ROUND CLEARED!';
    // roundText = this.game.make.text(pw+60, -ph+50, roundString,  { font: '16px Calibri', fill: '#fff' });

    // //Add Round Text and Okay Button to popup box
    // popup.addChild(roundText);
    // popup.addChild(okayButton);

    // popup.scale.set(0.1);
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

   //Create Start Text
   this.createStartText('Starting');
   //Create Listen for key events
   this.game.input.keyboard.addCallbacks(this, null, null, this.emitKeypress);
  },

  //Things to perform on every frame change
  update: function() {
    //Call only when socket object is available
    // if (socket) {
      //Listen event for key press being emitted
      socket.on('returning the player data', function(data){
        //Call function to verify input
        // this.verifyInput(data);

        data = JSON.parse(data.data);
        // FIX WHEN NO TEXT IS PRESENT -- OR IS DESTROYED
        player1.text.text = data.player1.text;
        player2.text.text = data.player2.text;

        if (data.player1.updateText !== '') {
          this.createPlayer1Text(data.player1.updateText);
          player1.updateText = '';
        } 

        if (data.player2.updateText !== '') {
          this.createPlayer2Text(data.player2.updateText);
          player2.updateText = '';
        }

      //Early-Stage binding to properly refer to 'this'
      }.bind(this));
    // }

    //Checks for collision with ground and computer. Computer collision executes attack function
    this.game.physics.arcade.collide(blueViruses, ground, null, null, null);
    // this.game.physics.arcade.collide(blueViruses, collisionLine, this.attack, null, null);
    this.game.physics.arcade.collide(blueViruses, leftComp, this.attack_player1, null, null);
    this.game.physics.arcade.collide(blueViruses, rightComp, this.attack_player2, null, null);
    // this.game.physics.arcade.collide(blueViruses, missiles, missileHit, null, null);
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

    this.game.physics.arcade.collide(player1.text, ground, this.destroyText, null, null);
    this.game.physics.arcade.collide(player2.text, ground, this.destroyText, null, null);

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
    this.game.add.tween(this).to({barProgress: health_player1}, 100, null, true, 0); //each hit health updates and bar shrinks

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
    // if(this.roundStarted){
    //   this.endRound();
    // }
 
    //If HP is 0, change comp image to be broken and change to GameOver game state
    if(this.barProgress <= 0){
      console.log("You have lost!");
      var brokenComp = this.game.add.sprite(1068, 350, 'brokenComp');
      // brokenComp.width = ratio(165);
      // brokenComp.height = ratio(142);
      rightComp.kill();
      controlPanel.kill();
      // this.roundStarted = false;
      powerDownSound.play();
      var that = this;
      setTimeout(function(){
        that.game.state.start("GameOver");
        }, 1000); 
    }

    // check if we need to create any more viruses
    if (blueViruses.total < 10 && spawning === false) {
      this.spawnVirus(this);
    }

  },

  render: function(){
    this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00");//shows fps on top left
  }
};

