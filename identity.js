var sketchProc=function(processingInstance){ with (processingInstance){

size(600, 400); // canvas size
frameRate(60);

/*
 *  Characters
 */
var childObj = function(x, y, charType) {
    this.position = new PVector(x, y);
    // Indicates whether the character is the original, its shadow, or its reflection
    this.charType = charType;
    this.size = 40; // default
    this.facing = 1; // default: character is facing right

    // animation variables
    this.snapshot = 0;
    this.currFrame = frameCount;
    this.dir = 1; // direction of frame iterations for animation
};
childObj.prototype.draw = function() {
    pushMatrix();
    translate(this.position.x, this.position.y);

    ///////////////////////////////////////////
    // // Collision box for child
    // stroke(0, 0, 0);
    // strokeWeight(1);
    // line(-this.size/2, -this.size/2, this.size/2, -this.size/2);
    // line(-this.size/2, this.size/2, this.size/2, this.size/2);
    // line(-this.size/2, -this.size/2, -this.size/2, this.size/2);
    // line(this.size/2, -this.size/2, this.size/2, this.size/2);
    // fill(0, 136, 255, 100);
    // noStroke();
    // ellipse(0, 0, this.size, this.size);
    ///////////////////////////////////////////

    noStroke();
    fill(222, 187, 104);
    ellipse(0, -this.size/4, this.size/2, this.size/2); //head
    ellipse(this.size/4 * this.facing, -this.size/4, this.size/6, this.size/8); //nose
    fill(0, 0, 0);
    arc(0, -this.size/3, this.size/1.5, this.size/1.5, -Math.PI, 0); //hair (top)
    if(this.facing === 1) { // facing right
        arc(0, -this.size/3, this.size/1.5, this.size/1.5, Math.PI/2, 3*Math.PI/2); //hair(back)
    } else {
        arc(0, -this.size/3, this.size/1.5, this.size/1.5, -Math.PI/2, Math.PI/2); //hair(back)
    }
    ellipse(this.size/6 * this.facing, -this.size/4, this.size/12, this.size/6); //eye
    fill(222, 187, 104);
    ellipse(0, -this.size/4, this.size/6, this.size/5); //ear

    ////////////////////////  TODO jump animations ////////////////////////////////
    switch(this.snapshot) {
        case 0:
            stroke(222, 187, 104);
            strokeWeight(this.size/8);
            line(0, 0, -this.size/4 * this.facing, this.size/4); //arms (back)
            line(0, this.size/3, this.size/4 * this.facing, this.size/2); //leg (back)

            noStroke();
            fill(54, 64, 255);
            ellipse(0, this.size/5, this.size/2, this.size/2); //torso

            stroke(222, 187, 104);
            strokeWeight(this.size/8);
            line(0, 0, this.size/4 * this.facing, this.size/4); //arms (front)
            line(0, this.size/3, -this.size/4 * this.facing, this.size/2); //leg (front)
        break;

        case 1:
            stroke(222, 187, 104);
            strokeWeight(this.size/8);
            line(0, 0, -this.size/6 * this.facing, this.size/4); //arms (back)
            line(0, this.size/3, this.size/6 * this.facing, this.size/2); //leg (back)

            noStroke();
            fill(54, 64, 255);
            ellipse(0, this.size/5, this.size/2, this.size/2); //torso

            stroke(222, 187, 104);
            strokeWeight(this.size/8);
            line(0, 0, this.size/6 * this.facing, this.size/4); //arms (front)
            line(0, this.size/3, -this.size/6 * this.facing, this.size/2); //leg (front)
        break;

        case 2:
            stroke(222, 187, 104);
            strokeWeight(this.size/8);
            line(0, 0, -this.size/8 * this.facing, this.size/4); //arms (back)
            line(0, this.size/3, this.size/8 * this.facing, this.size/2); //leg (back)

            noStroke();
            fill(54, 64, 255);
            ellipse(0, this.size/5, this.size/2, this.size/2); //torso

            stroke(222, 187, 104);
            strokeWeight(this.size/8);
            line(0, 0, this.size/8 * this.facing, this.size/4); //arms (front)
            line(0, this.size/3, -this.size/8 * this.facing, this.size/2); //leg (front)
        break;

        case 3:
            stroke(222, 187, 104);
            strokeWeight(this.size/8);
            line(0, 0, 0, this.size/4); //arms (back)
            line(0, this.size/3, 0, this.size/2); //leg (back)

            noStroke();
            fill(54, 64, 255);
            ellipse(0, this.size/5, this.size/2, this.size/2); //torso

            stroke(222, 187, 104);
            strokeWeight(this.size/8);
            line(0, 0, 0, this.size/4); //arms (front)
            line(0, this.size/3, 0, this.size/2); //leg (front)
        break;

        case 4:
            stroke(222, 187, 104);
            strokeWeight(this.size/8);
            line(0, 0, -this.size/-8 * this.facing, this.size/4); //arms (back)
            line(0, this.size/3, this.size/-8 * this.facing, this.size/2); //leg (back)

            noStroke();
            fill(54, 64, 255);
            ellipse(0, this.size/5, this.size/2, this.size/2); //torso

            stroke(222, 187, 104);
            strokeWeight(this.size/8);
            line(0, 0, this.size/-8 * this.facing, this.size/4); //arms (front)
            line(0, this.size/3, -this.size/-8 * this.facing, this.size/2); //leg (front)
        break;

        case 5:
            stroke(222, 187, 104);
            strokeWeight(this.size/8);
            line(0, 0, -this.size/-6 * this.facing, this.size/4); //arms (back)
            line(0, this.size/3, this.size/-6 * this.facing, this.size/2); //leg (back)

            noStroke();
            fill(54, 64, 255);
            ellipse(0, this.size/5, this.size/2, this.size/2); //torso

            stroke(222, 187, 104);
            strokeWeight(this.size/8);
            line(0, 0, this.size/-6 * this.facing, this.size/4); //arms (front)
            line(0, this.size/3, -this.size/-6 * this.facing, this.size/2); //leg (front)
        break;

        case 6:
            stroke(222, 187, 104);
            strokeWeight(this.size/8);
            line(0, 0, -this.size/-4 * this.facing, this.size/4); //arms (back)
            line(0, this.size/3, this.size/-4 * this.facing, this.size/2); //leg (back)

            noStroke();
            fill(54, 64, 255);
            ellipse(0, this.size/5, this.size/2, this.size/2); //torso

            stroke(222, 187, 104);
            strokeWeight(this.size/8);
            line(0, 0, this.size/-4 * this.facing, this.size/4); //arms (front)
            line(0, this.size/3, -this.size/-4 * this.facing, this.size/2); //leg (front)
        break;

        default:
            //
        break;
    }
    /////////////////////////////////////////////////////////////////////////////
    if(this.currFrame < (frameCount - 20)) {
        this.currFrame = frameCount;
        this.snapshot += this.dir;
    }
    if(this.snapshot > 6) {
        this.snapshot = 5;
        this.dir = -this.dir;
    }
    if(this.snapshot < 0) {
        this.snapshot = 1;
        this.dir = -this.dir;
    }
    // println(this.snapshot);

    popMatrix();
};
var boy = new childObj(width/2, height/2 ,1);
// TODO: make shadow
// TODO: make reflection
////////////////////////////////////

/*
 *  Draws mountains in the background using Perlin noise
 */
var mountainObj = function() {};
mountainObj.prototype.draw = function() {
    stroke(222, 222, 222);
    var step = 0.01;
    for(var t = 0; t < step*width; t += step) {
        var y = map(noise(t), 2, 1, 0, height/3);
        rect(t*100, height-y, 1, y);
    }
};
var mountains = new mountainObj();

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
                   "rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr"]; // @ ~400 pixels down
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
    mountains.draw();

	fill(30, 0, 222);
	textSize(40);
    textFont(createFont("monospace"));
	text("Identity", width/2-100, 60);

	fill(0, 0, 0);
	textSize(15);
	text("Child, where is your imagination going today? Who will\n" +
	"  you be? What will you do? Where will you venture?", 60, 100);

    boy.position.set(width/2, height/2+50);
	boy.draw();

	fill(0, 0, 0);
	text("Click to advance...", 230, 350);
};
var menuPage2 = function() {};
menuPage2.prototype.execute = function(obj) {
	background(255, 255, 255);
    mountains.draw();

	fill(0, 0, 0);
	textSize(15);
	textFont(createFont("monospace"));
	text("You are what you make yourself out to be, child. Use the\n" +
	"arrow keys to advance. Your alternate ego is with you...", 60, 60);

	fill(0, 30, 255);
	textSize(20);
	text("Identity", width/2-50, 300);
	fill(0, 0, 0);
	textSize(12);
	text("Christina Nguyen", width/2-60, 320);
};

/////////////////////////  TODO  /////////////////////////
var gameState = function() {}; // constructor
gameState.prototype.execute = function(obj) {
	background(255, 255, 255);
	fill(0, 0, 0);
	textSize(20);
	text("Game state (in progress)", width/2-100, height/2);

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
