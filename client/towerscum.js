
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



//Player objects
// var player1 = {
//   level: 1,
//   counter: 0,
//   updateText: '',
//   text: {}
// };
// var player2 = {
//   level: 1,
//   counter: 0,
//   updateText: '',
//   text: {}
// };
var player1Text, player2Text;

var textStyle = {
  font: '24pt sans-serif',
  // fill: '#FF8E61',
  fill: '#FFF',
  wordWrap: true
};

//Socket
var socket;

//Game object
towerScum.prototype = {
  // var to check if player
  isPlayer: false,
  // var to check if spawning is happening
  spawning: false,

  createStartText: function(text){
    this.createPlayer1Text(text);
    this.createPlayer2Text(text);
  },

  createPlayer1Text: function(text) {
    if (player1Text) {
      // delete player1Text;
      player1Text.kill();
    }
    //Create player 1 Text
    player1Text = this.game.add.text(100, 10, text, textStyle);
 
    //Enable Physics on Text - Defaults to ARCADE physics
    this.game.physics.arcade.enable(player1Text);
    
    //Set velocity to fall at constant rate
    player1Text.body.velocity.setTo(0, 50);
    
  },

  createPlayer2Text: function(text) {
    
    if (player2Text) {
      // delete player2Text;
      player2Text.kill();
    }
    //Create player 2 text
    player2Text = this.game.add.text(800, 10, text, textStyle);

    //Enabe physics
    this.game.physics.arcade.enable(player2Text);

    //Set velocity
    player2Text.body.velocity.setTo(0, 50);
  },

  destroyText: function(text) {
    // Remove the text form view
    text.exists = false; 
  },

  emitKeypress: function(char) {
    // console.log('id:',roomId,'player:',player);
    data = {
      input: char,
      id: roomId,
      player: player
    };
    // data = {
    //   'player1': {
    //     level: player1.level,
    //     counter: player1.counter,
    //     updateText: player1.updateText
    //     // text: player1.text.text // I need to not send this
    //   },
    //   'player2': {
    //     level: player2.level,
    //     counter: player2.counter,
    //     updateText: player2.updateText
    //     // text: player2.text.text // I need to not send this
    //   },
    //   'input': char,
    //   'credentials': {id: roomId, player: player}
    // };
    // socket.emit("keypress", JSON.stringify(data));
    socket.emit("keypress", data);
    // socket.emit("keypress", data);
  },

  //Attack function
  attack_player1: function(computer, virus){
    virus.animations.play('attack', 15, false, true);
    virus.y = virus.y - 25;
    health_player1 -= 10;
    virus.events.onAnimationComplete.add(function(){ //trigger another animation
      virus.animations.play('die');
      setTimeout(function(){virus.kill();}, 400);
      // var context = this;
    // sparkSound.play();
    });
  },

  attack_player2: function(computer, virus){
    virus.animations.play('attack', 15, false, true);
    virus.y = virus.y - 25;
    health_player2 -= 10;
    virus.events.onAnimationComplete.add(function(){ //trigger another animation
      virus.animations.play('die');
      setTimeout(function(){virus.kill();}, 400);
      // var context = this;
    // sparkSound.play();
    });
  },

  spawnVirus: function(context) {
    // console.log('spawnVirus called');
    context.spawning = true;
    setTimeout(function() { 
      context.spawning = false;
      blueVirus(context, 0, 0);
    }, 1000);
  },

  makeVirus: function(context) {
    blueVirus(context, 0, 0);
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
    // this.spawnVirus(this);
    // blueVirus(this, 0, 0, 1)
    //redVirus(this, 0, 0, 3)

    // this.rounds[roundNumber](this); //Executes first round of monster (Round defaults as 1)


    //health bar for right player2
    this.outerbar = this.add.bitmapData(134, 13);
    this.outerbar.context.fillStyle = '#00685e';
    this.outerbar.fill();
    this.barProgress = 128;      
    this.bar = this.add.bitmapData(128, 10); //sets width and height for bar
    this.game.add.sprite(1063, 328, this.outerbar); //outerbar
    this.game.add.sprite(1130 - (this.bar.width * 0.5), 330, this.bar);//x and y coordinates of bar 700,300

    //health bar for left player1
    this.outerbar2 = this.add.bitmapData(134, 13);
    this.outerbar2.context.fillStyle = '#00685e';
    this.outerbar2.fill();
    this.barProgress2 = 128;      
    this.bar2 = this.add.bitmapData(128, 10); //sets width and height for bar
    this.game.add.sprite(2, 328, this.outerbar2); //outerbar
    this.game.add.sprite(69 - (this.bar2.width * 0.5), 330, this.bar2);//x and y coordinates of bar 700,300

   //Create Start Text
   this.createStartText('Starting');
   //Create Listen for key events
   this.game.input.keyboard.addCallbacks(this, null, null, this.emitKeypress);
   
   socket.on('returning the player data', (function(data){
     //Call function to verify input
     // this.verifyInput(data);

     // data = JSON.parse(data.data);
     // console.log('client:',data);
     // FIX WHEN NO TEXT IS PRESENT -- OR IS DESTROYED
     // console.log('data.player1',data.data.player1);
     // console.log('player1.text',player1.text);
     // player1.text.text = data.data.player1.text;
     // player2.text.text = data.data.player2.text;

     // need data to have player 1&2 updateText boolean & text
     // console.log('received from server:', data);
     var self = this;
     var turnViruses = function() {
      blueViruses.forEach(function(virus) { // this could be abstracted out to its own function
          virus.scale.x *= -1;
          virus.body.velocity.x *= -1.2;
        }, this);
      self.makeVirus(self);
     };

     if (data.player1.updateText) {
      this.createPlayer1Text(data.player1.text);
      turnViruses();
     } else {
      player1Text.text = data.player1.text;
     }

     if (data.player2.updateText) {
      this.createPlayer2Text(data.player2.text);
      turnViruses();
     } else {
      player2Text.text = data.player2.text;
     }

     // if (data.data.player1.updateText !== '') {
     //  player1.counter++;
     //  if (player1.counter % 5 === 0) {
     //    player1.level++;
     //  }
     //  this.createPlayer1Text(data.data.player1.updateText);
     //  player1.updateText = '';
     //  blueViruses.forEach(function(virus) {
     //      virus.scale.x *= -1;
     //      virus.body.velocity.x *= -1.2;
     //    }, this);
     //    this.makeVirus(this);
     // } 

     // if (data.data.player2.updateText !== '') {
     //  player2.counter++;
     //  if (player2.counter % 5 === 0) {
     //    player2.level++;
     //  }
     //  this.createPlayer2Text(data.data.player2.updateText);
     //  player2.updateText = '';
     //  blueViruses.forEach(function(virus) {
     //      virus.scale.x *= -1;
     //      virus.body.velocity.x *= -1.2;
     //    }, this);
     //    this.makeVirus(this);
     // }

     // console.log("P1 Count: ", player1.counter);
     // console.log("P2 Count: ", player2.counter);

   //Early-Stage binding to properly refer to 'this'
   }).bind(this));
  },

  //Things to perform on every frame change
  update: function() {

    //Checks for collision with ground and computer. Computer collision executes attack function
    this.game.physics.arcade.collide(blueViruses, ground, null, null, null);
    // this.game.physics.arcade.collide(blueViruses, collisionLine, this.attack, null, null);
    this.game.physics.arcade.collide(blueViruses, leftComp, this.attack_player1, null, null);
    this.game.physics.arcade.collide(blueViruses, rightComp, this.attack_player2, null, null);
    // this.game.physics.arcade.collide(blueViruses, missiles, missileHit, null, null);
    // this.game.physics.arcade.collide(blueViruses, platform);

    // this.game.physics.arcade.collide(redViruses, ground, null, null, null);
    // // this.game.physics.arcade.collide(redViruses, collisionLine, this.attack, null, null);
    // this.game.physics.arcade.collide(redViruses, missiles, missileHit, null, null);
    // // this.game.physics.arcade.collide(redViruses, platform);

    // this.game.physics.arcade.collide(yellowViruses, ground, null, null, null);
    // // this.game.physics.arcade.collide(yellowViruses, collisionLine, this.attack, null, null);
    // this.game.physics.arcade.collide(yellowViruses, missiles, missileHit, null, null);
    // // this.game.physics.arcade.collide(yellowViruses, platform);

    // this.game.physics.arcade.collide(swordyViruses, ground, null, null, null);
    // // this.game.physics.arcade.collide(swordyViruses, collisionLine, this.attack, null, null);
    // this.game.physics.arcade.collide(swordyViruses, missiles, missileHit, null, null);
    // // this.game.physics.arcade.collide(swordyViruses, platform);

    // this.game.physics.arcade.collide(goldswordyViruses, ground, null, null, null);
    // // this.game.physics.arcade.collide(goldswordyViruses, collisionLine, this.attack, null, null);
    // this.game.physics.arcade.collide(goldswordyViruses, missiles, missileHit, null, null);
    // // this.game.physics.arcade.collide(goldswordyViruses, platform);

    // this.game.physics.arcade.collide(ground, missiles, missileMiss, null, null);

    // this.game.physics.arcade.collide(player1.text, ground, this.destroyText, null, null);
    // this.game.physics.arcade.collide(player2.text, ground, this.destroyText, null, null);
    this.game.physics.arcade.collide(player1Text, ground, null, null, null);
    this.game.physics.arcade.collide(player2Text, ground, null, null, null);

    // if (player1Text.y > 600) {
    //   this.destroyText(player1Text);
    // }

    // if (player2Text.y > 600) {
    //   this.destroyText2(player2Text);
    // }

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
    this.game.add.tween(this).to({barProgress: health_player2}, 10, null, true, 0); //each hit health updates and bar shrinks

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
    this.game.add.tween(this).to({barProgress2: health_player1}, 10, null, true, 0); //each hit health updates and bar2 shrinks

    this.bar2.dirty = true; //apparently this line is important but I dont know why
 
    //If HP is 0, change comp image to be broken and change to GameOver game state
    if(this.barProgress <= 0){
      // console.log("You have won!");
      var brokenComp = this.game.add.sprite(1068, 350, 'brokenComp');
      // brokenComp.width = ratio(165);
      // brokenComp.height = ratio(142);
      rightComp.kill();
      controlPanel.kill();
      // this.roundStarted = false;
      powerDownSound.play();
      var that = this;
      setTimeout(function(){
        that.game.state.start("Win");
        }, 1000); 
    }

    if(this.barProgress2 <= 0){
      // console.log("You have won!");
      var brokenComp2 = this.game.add.sprite(75, 350, 'brokenComp');
      brokenComp2.anchor.setTo(0.5,0);
      brokenComp2.scale.x = -1;
      // brokenComp.width = ratio(165);
      // brokenComp.height = ratio(142);
      leftComp.kill();
      controlPanel2.kill();
      // this.roundStarted = false;
      powerDownSound.play();
      var that = this;
      setTimeout(function(){
        that.game.state.start("Lose");
        }, 1000); 
    }

    // check if we need to create any more viruses
    // if (this.spawning === false) {
    //   this.spawnVirus(this);
    // }

  },

  render: function(){
    this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00");//shows fps on top left
  }
};

