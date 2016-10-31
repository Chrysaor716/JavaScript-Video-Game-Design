var sketchProc=function(processingInstance){ with (processingInstance){

size(600, 400); // canvas size
frameRate(60);
angleMode = "radians";

/*
 *  Characters
 */
/////////////////////////  TODO  /////////////////////////
var child = function(x, y, color) {
    this.position = new PVector(x, y);
};
child.prototype.draw = function() {
    //
};
//////////////////////////////////////////////////////////

/*
 *	Tilemaps
 */
// Rocks
var rockObj = function(xPos, yPos) {
    this.x = xPos;
    this.y = yPos;
};
rockObj.prototype.draw = function() {
    noStroke();
    fill(168, 168, 168);
    // Draws the base color of entire rock
    rect(this.x, this.y, 20, 20);
    // Draws the shading and shines of the rock
    fill(99, 99, 99);
    rect(this.x, this.y+3, 5, 17);
    rect(this.x, this.y+15, 20, 5);
    fill(201, 201, 201);
    rect(this.x+5, this.y+3, 13, 2);
    rect(this.x+17, this.y+3, 3, 12);
};
var rockArr = [];
// 600x400 pixel canvas size, each tile 20x20 pixels
// 40x20 tile array --> 800x400 pixel
var rockTilemap = ["r------------rr----rr------------rr----r",
                   "r------------rr----rr------------rr----r",
            	   "r------------------rr------------------r",
 	               "-------------------rrrrrrrr------------r",
    	           "rrrrrrr-----rrrr---rrrrrrrr-----rrrr---r",
                   "rrr---------rrrr---rrrr---------rrrr---r",
                   "rrr-------------------------------------",
                   "r-----rrrr--rr-----rrrr---------rrrr---r",
                   "r-----rrrr---------rrrr---------rrrr---r",
                   "rr------------------------------rrrr---r",
                   "rrrrr---------rrr---------------rrrr---r",
                   "rrrrrr-------------rrrr---------rrrr---r",
                   "rrrr----------------------------rrrr---r",
                   "r-------rrrrrrrrrrrrrrr---------rrrr---r",
                   "r-------rr------rrrrrrr---------rrrr---r",
                   "rrr-----rr------rrrrrrr---------rrrr---r",
                   "rrr-----rrrr-------rrrr---------rrrr---r",
                   "r-------rrrr-------rrrr---------rrrr---r",
                   "r---------rrrrrr---rrrr---------rrrr---r",
                   "rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr"]; // @ ~400 pixels down from top
var initRockTilemap = function() {
    for(var i = 0; i < rockTilemap.length; i++) {
        for(var j = 0; j < rockTilemap[i].length; j++) {
            switch(rockTilemap[i][j]) {
                case 'r': // rock in place
                    rockArr.push(new rockObj(j*20, i*20)); // 20x20 pixel cells
                break;

                default:
                    //
                break;
            }
        }
    }
};
initRockTilemap();

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

	for(var i = 0; i < rockArr.length; i++) {
		rockArr[i].draw();
	}
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
