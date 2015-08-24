var towerScum = function(game){};

//HP for player 1
var health_player1 = 128;
// HP for player 2
var health_player2 = 128;

//Monsters
var viruses;

var player1Text, player2Text;

var textStyle = {
  font: '24pt sans-serif',
  fill: '#FFF',
  wordWrap: true,
  wordWrapWidth: 300
};

//Socket
var socket;

//Game object
towerScum.prototype = {

  createStartText: function(text){
    this.createPlayer1Text(text);
    this.createPlayer2Text(text);
  },

  createPlayer1Text: function(text) {
    if (player1Text) {
      player1Text.kill();
    }
    //Create player 1 Text
    player1Text = this.game.add.text(150, 10, text, textStyle);
    //Enable Physics on Text - Defaults to ARCADE physics
    this.game.physics.arcade.enable(player1Text);
    //Set velocity to fall at constant rate
    player1Text.body.velocity.setTo(0, 50);
    
  },

  createPlayer2Text: function(text) {
    if (player2Text) {
      player2Text.kill();
    }
    //Create player 2 text
    player2Text = this.game.add.text(750, 10, text, textStyle);
    //Enabe physics
    this.game.physics.arcade.enable(player2Text);
    //Set velocity
    player2Text.body.velocity.setTo(0, 50);
  },

  emitKeypress: function(char) {
    data = {
      input: char,
      id: roomId,
      player: player
    };
    socket.emit("keypress", data);
  },

  //Attack function
  attack_player1: function(computer, virus){
    virus.animations.play('attack', 15, false, true);
    virus.y = virus.y - 25;
    health_player1 -= 8;
    virus.events.onAnimationComplete.add(function(){ //trigger another animation
      virus.animations.play('die');
      setTimeout(function(){virus.kill();}, 400);
    sparkSound.play();
    });
  },

  attack_player2: function(computer, virus){
    virus.animations.play('attack', 15, false, true);
    virus.y = virus.y - 25;
    health_player2 -= 8;
    virus.events.onAnimationComplete.add(function(){ //trigger another animation
      virus.animations.play('die');
      setTimeout(function(){virus.kill();}, 400);
    sparkSound.play();
    });
  },

  spawnVirus: function(player) { // player parameter is 1 or 2, spawns virus for that player
    if (player === 1) {
      makeVirus(this, 150, 400, 1);
    } else if (player === 2) {
      makeVirus(this, 1050, 400, 2);
    }
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
    setTimeout(function() {music.stop();}, 10000);

    //create sparks sound effects
    powerDownSound = this.game.add.audio('powerDown');
    sparkSound = this.game.add.audio('sparks');
    dieSound = this.game.add.audio('die');
    explodeSound = this.game.add.audio('explode');
    
    createStage(this); //Loads stage
    viruses = this.game.add.group();
    viruses.enableBody = true;
    viruses.physicsBodyType = Phaser.Physics.ARCADE;

    compSprite(this); //Loads right mainframe
    comp2Sprite(this, -936, 0); //Loads left mainframe

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


   //Create Start Text
    this.createStartText('Starting');
   //Create Listen for key events
    this.game.input.keyboard.addCallbacks(this, null, null, this.emitKeypress);

    socket.on('Start the game on the client', (function(data){
      this.barProgress = 128; // reset all health on game start
      this.barProgress2 = 128;
      health_player1 = 128;
      health_player2 = 128;
    }).bind(this));
   
    socket.on('returning the player data', (function(data){

      if (data.player1.updateText) {
        this.createPlayer1Text(data.player1.text);
        this.spawnVirus(1);
      } else {
        player1Text.text = data.player1.text;
      }
      if (data.player2.updateText) {
        this.createPlayer2Text(data.player2.text);
        this.spawnVirus(2);
      } else {
        player2Text.text = data.player2.text;
      }

    }).bind(this));
  },

  //Things to perform on every frame change
  update: function() {

    //Checks for virus collisions with ground and computers. Computer collision executes attack function
    this.game.physics.arcade.collide(viruses, ground, null, null, null);
    this.game.physics.arcade.collide(viruses, leftComp, this.attack_player1, null, null);
    this.game.physics.arcade.collide(viruses, rightComp, this.attack_player2, null, null);
    // Check for collisions between text and ground to stop scrolling
    this.game.physics.arcade.collide(player1Text, ground, null, null, null);
    this.game.physics.arcade.collide(player2Text, ground, null, null, null);

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
    this.bar2.dirty = true; 
 
    //If HP is 0, change comp image to be broken and change to GameOver game state
    if(this.barProgress <= 0){
      var brokenComp = this.game.add.sprite(1068, 350, 'brokenComp');
      rightComp.kill();
      controlPanel.kill();
      powerDownSound.play();
      var that = this;
      setTimeout(function(){
        that.game.state.start("Win");
        }, 1000); 
    }

    if(this.barProgress2 <= 0){
      var brokenComp2 = this.game.add.sprite(75, 350, 'brokenComp');
      brokenComp2.anchor.setTo(0.5,0);
      brokenComp2.scale.x = -1;
      leftComp.kill();
      controlPanel2.kill();
      powerDownSound.play();
      var that = this;
      setTimeout(function(){
        that.game.state.start("Lose");
        }, 1000); 
    }
  },

  render: function(){
    // this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00");//shows fps on top left
  }
};

