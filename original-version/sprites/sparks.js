var sparks;

var makeSparks = function(that, x, y){
  sparks = that.game.add.group();
  var spark= sparks.create(x,y,'spark', '1/_01.png');
  var animate = ['1/_01.png','1/_02.png','1/_03.png','1/_04.png','1/_05.png','1/_06.png','1/_07.png','1/_08.png','1/_09.png'];

  spark.animation.add('spark', animate, 15, true);
  spark.animation.play('spark');
};