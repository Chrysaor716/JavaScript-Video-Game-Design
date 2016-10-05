angleMode = "radians";

//////////////////////* Game states *//////////////////////
var menuState = function() {}; // constructor
menuState.prototype.execute = function() {
    background(0, 0, 0);
    fill(255, 255, 255);
    textSize(30);
    text("menu state", width/2-70, height/2);
};

var playState = function() {}; // constructor
playState.prototype.execute = function() {
    background(255, 255, 255);
    fill(0, 0, 0);
    textSize(30);
    text("game state", width/2-70, height/2);
};
//--------------------------------------------------------
var gameObj = function() { 
    this.state = [new menuState(), new playState()];
    this.currState = 0; // index 0 (menuState)
};
gameObj.prototype.changeStateTo = function(state) {
    this.currState = state;
};
var game = new gameObj();
//////////////////////////////////////////////////////////


draw = function() {
    game.state[game.currState].execute();
};