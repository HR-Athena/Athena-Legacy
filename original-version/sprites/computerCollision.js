var computerCollision = function(that,x,y){ //x and y coordinates for positioning
  x = x || 610;
  y = y || 470;

  collisionLine = that.game.add.group(); //Create group for collision

  that.game.physics.startSystem(Phaser.Physics.ARCADE); //enable physics
  collisionLine.enableBody = true; //Set the collision line to allow physics
  for(var i = 0; i < 28; i++){ //Create the line for the collision
  	var line = collisionLine.create(x+(3*i), y+(i*1.5), 'computerCollision');
  	line.body.immovable = true; //Make the line immovable
  }
  
  


};