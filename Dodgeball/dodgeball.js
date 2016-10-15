angleMode = "radians";

/*********************************** GAME OBJECTS ************************************/
var ballObj = function(x, y) {
    this.position = new PVector(x, y);
    this.velocity = new PVector(0, 0);
    this.acceleration = new PVector(0, 0);
    this.size = 80;
    this.mass = this.size / 5;
};
ballObj.prototype.draw = function() {
    noStroke();
    fill(255, 0, 0);
    ellipse(this.position.x, this.position.y, this.size, this.size);
};
var ball = new ballObj(width/2, height/2);
/*************************************************************************************/

/*********************************** GAME STATES ************************************/
var menuState = function() {}; // constructor
menuState.prototype.execute = function(me) { // 0
    fill(0, 0, 0); textSize(30);
    text("menu state", 130, height/2);
};
var playState = function() {}; // constructor
playState.prototype.execute = function(me) { // 1
    background(255, 255, 255);
    ball.draw();
};
var winState = function() {}; // constructor
winState.prototype.execute = function() { // 2
    fill(0, 0, 0); textSize(30);
    text("win state", 130, height/2);
};
var loseState = function() {}; // constructor
loseState.prototype.execute = function() { // 3
    fill(0, 0, 0); textSize(30);
    text("lose state", 130, height/2);
};
//-----------------------------------------------------------------------------------
var gameObj = function() {
    this.state = [new menuState(), new playState(), new winState(), new loseState()];
    this.currState = 0; // index 0 (menuState)
};
gameObj.prototype.changeStateTo = function(state) {
    this.currState = state;
};
var game = new gameObj();
/*************************************************************************************/

draw = function() {
    // game.state[game.currState].execute(game);
game.state[1].execute(game);
};
