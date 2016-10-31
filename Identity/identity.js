var sketchProc=function(processingInstance){ with (processingInstance){

size(600, 400); // canvas size
frameRate(60);
angleMode = "radians";

/*
 *	Game States
 */
var menuPage1 = function() {}; // constructor
menuPage1.prototype.execute = function(obj) {
	background(255, 255, 255);
	fill(0, 0, 0);
	textSize(20);
	text("Menu page 1.", width/2-70, height/2);
};
var menuPage2 = function() {};
menuPage2.prototype.execute = function(obj) {
	background(255, 255, 255);
	fill(0, 0, 0);
	textSize(20);
	text("Menu page 2.", width/2-70, height/2);
};

/////////////////////////  TODO  /////////////////////////
var gameState = function() {}; // constructor
gameState.prototype.execute = function(obj) {
	background(255, 255, 255);
	fill(0, 0, 0);
	textSize(20);
	text("Game state.", width/2-70, height/2);
};
//////////////////////////////////////////////////////////
//--------------------------------------------------------
var gameObj = function() {
	this.state = [new menuPage1(), new menuPage2(), new gameState()]; //TODO add states here as you create them
	this.currState = 0; // Initialize to state in first index (menuPage1)
};
gameObj.prototype.changeStateTo = function(state) {
	this.currState = state;
};
var game = new gameObj();

/*
 *	Mouse interactions.
 */
mouseClicked = function() {
	if(game.currState === 0 || game.currState === 1) {
//		game.changeStateTo(0);
		game.currState++;
	}
};

draw = function() {
	game.state[game.currState].execute(game);
};


}};
