var sketchProc=function(processingInstance){ with (processingInstance){

size(600, 400); // canvas size
frameRate(60);

/*
 *  Characters
 */
var rockArr = []; // Rock object created later in code; needed here to check collision with it
var childObj = function(x, y, charType) {
    this.position = new PVector(x, y);
    // Indicates whether the character is the original (1), its shadow (0), or its reflection (2)
    this.charType = charType;
    this.size = 40; // default
    this.facing = 1; // default: character is facing right

    // animation variables
    this.snapshot = 0;
    this.currFrame = frameCount;
    this.dir = 1; // direction of frame iterations for animation

    // Keep track of feet position to connect characters
    //      (e.g. shadow attached to original char)
    this.backFoot = new PVector(0, 0);
    this.frontFoot = new PVector(0, 0);

    // PHYSICS
    this.position = new PVector(x, y);
    this.velocity = new PVector(0, 0);
    this.acceleration = new PVector(0, 0);
    this.jump = 0;
};
childObj.prototype.draw = function() {
    pushMatrix();
    translate(this.position.x, this.position.y);

    noStroke();
    fill(222, 187, 104);
    if(this.charType === 0) { // shadow
        fill(0, 0, 0);
    }
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
    if(this.charType === 0) {
        fill(0, 0, 0);
    }
    ellipse(0, -this.size/4, this.size/6, this.size/5); //ear

    ////////////////////////  TODO jump animations ////////////////////////////////
    switch(this.snapshot) {
        case 0:
            stroke(222, 187, 104);
            if(this.charType === 0) {
                stroke(0, 0, 0);
            }
            strokeWeight(this.size/8);
            line(0, 0, -this.size/4 * this.facing, this.size/4); //arms (back)
            line(0, this.size/3, this.size/4 * this.facing, this.size/2); //leg (back)
            this.backFoot.set(this.size/4 * this.facing, this.size/2);

            noStroke();
            fill(54, 64, 255);
            if(this.charType === 0) {
                fill(0, 0, 0);
            }
            ellipse(0, this.size/5, this.size/2, this.size/2); //torso

            stroke(222, 187, 104);
            if(this.charType === 0) {
                stroke(0, 0, 0);
            }
            strokeWeight(this.size/8);
            line(0, 0, this.size/4 * this.facing, this.size/4); //arms (front)
            line(0, this.size/3, -this.size/4 * this.facing, this.size/2); //leg (front)
            this.frontFoot.set(-this.size/4 * this.facing, this.size/2);
        break;

        case 1:
            stroke(222, 187, 104);
            if(this.charType === 0) {
                stroke(0, 0, 0);
            }
            strokeWeight(this.size/8);
            line(0, 0, -this.size/6 * this.facing, this.size/4); //arms (back)
            line(0, this.size/3, this.size/6 * this.facing, this.size/2); //leg (back)
            this.backFoot.set(this.size/6 * this.facing, this.size/2);

            noStroke();
            fill(54, 64, 255);
            if(this.charType === 0) {
                fill(0, 0, 0);
            }
            ellipse(0, this.size/5, this.size/2, this.size/2); //torso

            stroke(222, 187, 104);
            if(this.charType === 0) {
                stroke(0, 0, 0);
            }
            strokeWeight(this.size/8);
            line(0, 0, this.size/6 * this.facing, this.size/4); //arms (front)
            line(0, this.size/3, -this.size/6 * this.facing, this.size/2); //leg (front)
            this.frontFoot.set(-this.size/6 * this.facing, this.size/2);
        break;

        case 2:
            stroke(222, 187, 104);
            if(this.charType === 0) {
                stroke(0, 0, 0);
            }
            strokeWeight(this.size/8);
            line(0, 0, -this.size/8 * this.facing, this.size/4); //arms (back)
            line(0, this.size/3, this.size/8 * this.facing, this.size/2); //leg (back)
            this.backFoot.set(this.size/8 * this.facing, this.size/2);

            noStroke();
            fill(54, 64, 255);
            if(this.charType === 0) {
                fill(0, 0, 0);
            }
            ellipse(0, this.size/5, this.size/2, this.size/2); //torso

            stroke(222, 187, 104);
            if(this.charType === 0) {
                stroke(0, 0, 0);
            }
            strokeWeight(this.size/8);
            line(0, 0, this.size/8 * this.facing, this.size/4); //arms (front)
            line(0, this.size/3, -this.size/8 * this.facing, this.size/2); //leg (front)
            this.frontFoot.set(-this.size/8 * this.facing, this.size/2);
        break;

        case 3:
            stroke(222, 187, 104);
            if(this.charType === 0) {
                stroke(0, 0, 0);
            }
            strokeWeight(this.size/8);
            line(0, 0, 0, this.size/4); //arms (back)
            line(0, this.size/3, 0, this.size/2); //leg (back)
            this.backFoot.set(0, this.size/2);

            noStroke();
            fill(54, 64, 255);
            if(this.charType === 0) {
                fill(0, 0, 0);
            }
            ellipse(0, this.size/5, this.size/2, this.size/2); //torso

            stroke(222, 187, 104);
            if(this.charType === 0) {
                stroke(0, 0, 0);
            }
            strokeWeight(this.size/8);
            line(0, 0, 0, this.size/4); //arms (front)
            line(0, this.size/3, 0, this.size/2); //leg (front)
            this.frontFoot.set(0, this.size/2);
        break;

        case 4:
            stroke(222, 187, 104);
            if(this.charType === 0) {
                stroke(0, 0, 0);
            }
            strokeWeight(this.size/8);
            line(0, 0, -this.size/-8 * this.facing, this.size/4); //arms (back)
            line(0, this.size/3, this.size/-8 * this.facing, this.size/2); //leg (back)
            this.backFoot.set(this.size/-8 * this.facing, this.size/2);

            noStroke();
            fill(54, 64, 255);
            if(this.charType === 0) {
                fill(0, 0, 0);
            }
            ellipse(0, this.size/5, this.size/2, this.size/2); //torso

            stroke(222, 187, 104);
            if(this.charType === 0) {
                stroke(0, 0, 0);
            }
            strokeWeight(this.size/8);
            line(0, 0, this.size/-8 * this.facing, this.size/4); //arms (front)
            line(0, this.size/3, -this.size/-8 * this.facing, this.size/2); //leg (front)
            this.frontFoot.set(-this.size/-8 * this.facing, this.size/2);
        break;

        case 5:
            stroke(222, 187, 104);
            if(this.charType === 0) {
                stroke(0, 0, 0);
            }
            strokeWeight(this.size/8);
            line(0, 0, -this.size/-6 * this.facing, this.size/4); //arms (back)
            line(0, this.size/3, this.size/-6 * this.facing, this.size/2); //leg (back)
            this.backFoot.set(this.size/-6 * this.facing, this.size/2);

            noStroke();
            fill(54, 64, 255);
            if(this.charType === 0) {
                fill(0, 0, 0);
            }
            ellipse(0, this.size/5, this.size/2, this.size/2); //torso

            stroke(222, 187, 104);
            if(this.charType === 0) {
                stroke(0, 0, 0);
            }
            strokeWeight(this.size/8);
            line(0, 0, this.size/-6 * this.facing, this.size/4); //arms (front)
            line(0, this.size/3, -this.size/-6 * this.facing, this.size/2); //leg (front)
            this.frontFoot.set(-this.size/-6 * this.facing, this.size/2);
        break;

        case 6:
            stroke(222, 187, 104);
            if(this.charType === 0) {
                stroke(0, 0, 0);
            }
            strokeWeight(this.size/8);
            line(0, 0, -this.size/-4 * this.facing, this.size/4); //arms (back)
            line(0, this.size/3, this.size/-4 * this.facing, this.size/2); //leg (back)
            this.backFoot.set(this.size/-4 * this.facing, this.size/2);

            noStroke();
            fill(54, 64, 255);
            if(this.charType === 0) {
                fill(0, 0, 0);
            }
            ellipse(0, this.size/5, this.size/2, this.size/2); //torso

            stroke(222, 187, 104);
            if(this.charType === 0) {
                stroke(0, 0, 0);
            }
            strokeWeight(this.size/8);
            line(0, 0, this.size/-4 * this.facing, this.size/4); //arms (front)
            line(0, this.size/3, -this.size/-4 * this.facing, this.size/2); //leg (front)
            this.frontFoot.set(-this.size/-4 * this.facing, this.size/2);
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

    popMatrix();
};
var boy = new childObj(width/2, height/2, 1);
var shadow = new childObj((width/2)-100, height/2, 0);
shadow.size = 60;
// TODO: make reflection
// PHYSICS
var gravity = new PVector(0, 0.1);
var rightForceApplied = 0;
var leftForceApplied = 0;
// var f = new PVector(0, 0);
var jumpForce = new PVector(0, -4);
childObj.prototype.applyForce = function(force) {
    this.acceleration.add(force);
};
childObj.prototype.update = function() {
    if(rightForceApplied === 1) {
        // f.set(0.1, 0);
        this.position.x++;
    }
    if(leftForceApplied === 1) {
        // f.set(-0.1, 0);
        this.position.x--;
    }
    // this.applyForce(f);
    if(this.jump === 2) {
        this.applyForce(jumpForce);
        this.jump = 1;
    }
    if(this.jump > 0) {
        this.applyForce(gravity);
    }
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.set(0, 0); // reset acceleration
};
childObj.prototype.checkCollision = function() {
    for(var i = 0; i < rockArr.length; i++) {
        var distance = dist(this.position.x, this.position.y,
          rockArr[i].x+10, rockArr[i].y+10);
        if(distance < (this.size/2)+10) {
        //     this.velocity.set(0, 0);
        //     this.jump = 0;
            
            // If bottom of character exceeds top of rocks
            if(this.position.y+(this.size/2) > rockArr[i].y) {
                this.position.y = rockArr[i].y-(this.size/2);
                this.velocity.y = 0;
                this.jump = 0;
            }
            // TODO check for collision at top of head
            if(this.position.x-(this.size/2) < rockArr[i].x+20) {
                // this.position.x++;
                leftForceApplied = 0;
            }
            if(this.position.x+(this.size/2) > rockArr[i].x) {
                // this.position.x--;
                rightForceApplied = 0;
            }
            
        }
    }
};
////////////////////////////////////////
var keys = [];
var keyPressed = function() {
    if(keyCode === RIGHT) {
        boy.facing = 1;
        shadow.facing = 1;
        rightForceApplied = 1;
    } else if(keyCode === LEFT) {
        boy.facing = -1;
        shadow.facing = -1;
        leftForceApplied = 1;
    }
    if((keyCode === UP) && (boy.jump === 0)) {
        boy.jump = 2;
    }
    if((keyCode === UP) && (shadow.jump === 0)) {
        shadow.jump = 2;
    }
};
var keyReleased = function() {
    if(keyCode === RIGHT) {
        rightForceApplied = 0;
    } else if (keyCode === LEFT) {
        leftForceApplied = 0;
    }
};
////////////////////////////////////////
/*
 *  Draws a starry sky
 */
var nightSkyObj = function() {
    this.starArr = [];
    this.t = 0; // "time" variable for sin function
};
nightSkyObj.prototype.initialize = function() {
    for(var i = 0; i < random(80, 120); i++) {
        this.starArr.push(new PVector(random(0, width), random(0, 250)));
    }
};
nightSkyObj.prototype.draw = function() {
    // Draws stars in sky
	for(var i = 0; i < this.starArr.length; i++) {
	    // Use sin to slow the "twinkling" increment
	    // Scales the rate of transparency change over time
	    stroke(255, 255, 255, 255*abs(sin(Math.PI*i*this.t/7200)));
        point(this.starArr[i].x, this.starArr[i].y);
        // Make "plus" sign ("star" shape)
        point(this.starArr[i].x-1, this.starArr[i].y);
        point(this.starArr[i].x+1, this.starArr[i].y);
        point(this.starArr[i].x, this.starArr[i].y-1);
        point(this.starArr[i].x, this.starArr[i].y+1);
	}
	this.t++;
};
var nightSky = new nightSkyObj();
nightSky.initialize();

/*
 *  Draws mountains in the background using Perlin noise
 */
var mountainObj = function(colour) {
    this.colour = colour;
};
mountainObj.prototype.draw = function() {
    var step = 0.01;
    fill(this.colour, this.colour, this.colour, 100);
    
    stroke(this.colour, this.colour, this.colour, 170);
    for(var t = step; t < step * width/2.5; t += step) {
        var n = noise(t + this.colour * 20);
        var m = map(n, 0, 1, 0, width/2);
        rect(t*100, 250, 1, m/(t+0.5));
    }
};
var mountainsBack = new mountainObj(150);
var mountainsFront = new mountainObj(25);

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
// 600x400 pixel canvas size, each tile 20x20 pixels
// 40x20 tile array --> 800x400 pixel
var rockTilemap = ["r------------------rr------rrrrrrrrrrrrrr------------rr----rr------------------r",
                   "r------------------rr------------------rr------------rr----rr------------------r",
                   "r------------------rr------------------rr------------rr----rr------------------r",
                   "r------------------rrrrrr----------------------------rr----rr------------------r",
                   "r------------------rrrrrr----------------------------rr----rr------------------r",
                   "r------------------rrrrrrrr--------------------------rr----rr------------------r",
                   "r------------------rrrrrrrrrr------------------------rr----rr------------------r",
                   "r-------------------------------rrrr-----------------rr----rr------------------r",
                   "r-------------------------------rr-------------------rr----rr------------------r",
                   "r-------------------------------rr-------------------rr----rr------------------r",
                   "rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr-------rr----rr------------rr----r",
                   "r----------------------------------------------------rr----rr------------rr----r", // start of original's relm
                   "r----------------------------------------------------rr----rr------------rr----r",
                   "r----------------------------------------------------rr----rr------------rr----r",
                   "r----------------------rrrrrrrrrrrrr---rr------------rr----rr------------rr-----",
                   "r----------------------rr--------------rr------------rr----rr------------rr-----",
                   "r----------rrrrrrrr----rr--------------rr------------rr----rr------------rr-----",
                   "r---------rrrrrrrrr----------------rrrrrr------------rr----rr------------rr-----",
                   "r--------rrrrrrrrrr---------------rrrrrrr------------rr----rr------------rr----r",
                   "rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr------------rr----rr------------rrrrrrr"]; // @ ~400 pixels down
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
var mainMenu = function() {
    this.rockArr = [];
    for(var i = 0; i < 30; i++) {
        this.rockArr.push(new rockObj(i*20, height-20));
    }
}; // constructor
mainMenu.prototype.execute = function(obj) {
	background(72, 72, 122);
	nightSky.draw();
	// Draws "floor" below the sky
	fill(130, 98, 74);
	rect(0, 250, width, 250);
    mountainsBack.draw();
    mountainsFront.draw();

	fill(30, 0, 222);
	textSize(40);
    textFont(createFont("monospace"));
	text("Identity", width/2-100, 60);

	fill(0, 0, 0);
	textSize(15);
	text("Child, where is your imagination going today? Who will\n" +
	"  you be? What will you do? Where will you venture?", 60, 100);

    // Draw the boy's shadow first
    shadow.size = 60;
    shadow.position.set(200, 220);
    shadow.snapshot = boy.snapshot;
    shadow.draw();
    // Connects the shadow to the boy
	stroke(0, 0, 0);
	strokeWeight(7);
	line(boy.backFoot.x + boy.position.x, boy.backFoot.y + boy.position.y,
	     shadow.backFoot.x + shadow.position.x, shadow.backFoot.y + shadow.position.y);
	line(boy.frontFoot.x + boy.position.x, boy.frontFoot.y + boy.position.y,
	     shadow.frontFoot.x + shadow.position.x, shadow.frontFoot.y + shadow.position.y);
	strokeWeight(1); // reset stroke weight back to normal
	// Draws the boy on top of shadow
    boy.position.set(350, 356);
	boy.draw();
	
	// Draws edge between floor and wall
	stroke(0, 0, 0);
	strokeWeight(3);
	line(0, 250, width, 250);
	
	// Draws "outside" of house (bricks)
	noStroke();
	fill(173, 29, 29, 190);
	rect(width-40, 0, 40, height);
	rect(0, 0, 40, height);
	stroke(255, 255, 255);
	strokeWeight(2);
	for(var i = 0; i < height/20; i++) {
	    // Draws horizontal lines of the brick wall on either side
	    line(width-40, i*20, width, i*20);
	    line(0, i*20, 38, i*20);
	    // Draws the vertical line patterns of brick wall on either side
	    if(i%2 === 0) {
	        line(width-20, i*20, width-20, i*20+19);
	        line(20, i*20, 20, i*20+19);
	    }
	}
	// Draws rock ground
	for(var i = 0; i < this.rockArr.length; i++) {
	    this.rockArr[i].draw();
	}

	fill(89, 150, 247);
	text("About", width-120, 170);
	text("Controls", width-120, 200);
	text("Play", width-120, 230);
	strokeWeight(1);
	stroke(110, 110, 110);
	// Underline selection when mouse hovers above it
	//      for visual feedback
	if(mouseX >= width-130 && mouseX <= width-40) {
	    if(mouseY > 150 && mouseY < 180) {
	        line(width-120, 175, width-90, 175);
	    }
	    if(mouseY > 180 && mouseY < 210) {
	        line(width-120, 205, width-90, 205);
	    }
	    if(mouseY > 210 && mouseY < 240) {
	        line(width-120, 235, width-90, 235);
	    }
	}
};
var about = function() {};
about.prototype.execute = function(obj) {
    background(0, 0, 0);
    fill(255, 255, 255);
	textSize(30);
	textFont(createFont("monospace"));
	text("About", width/2-50, 60);

    textSize(15);
    text("You are what you make yourself out to be, child. Your\n              alternate ego is with you...", 60, 90);

    text("\"Identity\" is a game where you play as an imaginative\n" +
    "child. Your shadows and your reflections act as your\n" +
    "imagined self, having abilities beyond what your physical,\n" +
    "moral self can do. Since they branch off of you, they are\n" +
    "restricted to your physical bodies. Venture off and let\n" +
    "that imagination go wild!", 60, 150);

	fill(0, 30, 255);
	textSize(20);
	text("Identity", width/2-50, 290);
	fill(255, 255, 255);
	textSize(12);
	text("Christina Nguyen", width/2-60, 310);

	textSize(10);
	text("Click anywhere on the screen to return to main menu", 150, 340);
};
var controls = function() {}; // constructor
controls.prototype.execute = function(obj) {
	background(255, 255, 255);

	fill(0, 0, 0);
	textSize(30);
	textFont(createFont("monospace"));
	text("Controls", width/2-60, 60);

	textSize(20);
	text("Left/Right arrow keys: move", 150, 100);
	text("Up key: jump", 230, 130);

	textSize(12);
	text("(Give it a try!)", 250, 150);

	shadow.size = 40;
    shadow.draw();
    shadow.update();
    // Adds a ground in the controls menu
    if(shadow.position.y >= height/2+30) {
        shadow.position.y = height/2+30;
        shadow.velocity.y = 0;
        shadow.jump = 0;
    }
    // X bounds
    if(shadow.position.x > width-50) {
        shadow.position.x = width-50;
        shadow.velocity.x = 0;
    }
    if(shadow.position.x < 50) {
        shadow.position.x = 50;
        shadow.velocity.x = 0;
    }

	textSize(10);
	text("Click anywhere on the screen to return to main menu", 150, 260);
};
/////////////////////TODO REMOVE THIS LATER////////////////////
// this position is set when user clicks "Play" with their mouse
// from the main menu
// for now, with debugging and keeping it in play state, the boy's
// position is initialized here
boy.position.set(50, 350);
boy.size = 40;
// shadow.position.set(40, 150);
///////////////////////////////////////////////////////////
var play = function() {}; // constructor
play.prototype.execute = function(obj) {
	background(255, 255, 255);
	// Draws "divider" between original char and the shadow
	fill(0, 0, 0);
	stroke(0, 0, 0);
	line(0, 220, width*4, 220);
	
	boy.checkCollision();
	boy.update();
	boy.draw();
	
// 	shadow.size = 40;
//     shadow.draw();
//     shadow.update();

/////////////TEMP; USE COLLISION DETECTION//////////////////////
// Adds a ground in the controls menu
    // if(boy.position.y >= height-20) {
    //     boy.position.y = height-20;
    //     boy.velocity.y = 0;
    //     boy.jump = 0;
    // }
/////////////////////////////////////////////////////////
// 	boy.checkCollision();
	
	/*
	// Draw the boy's shadow first
    shadow.size = 60;
    shadow.position.set(200, 220);
    shadow.snapshot = boy.snapshot;
    shadow.draw();
    // Connects the shadow to the boy
	stroke(0, 0, 0);
	strokeWeight(7);
	line(boy.backFoot.x + boy.position.x, boy.backFoot.y + boy.position.y,
	     shadow.backFoot.x + shadow.position.x, shadow.backFoot.y + shadow.position.y);
	line(boy.frontFoot.x + boy.position.x, boy.frontFoot.y + boy.position.y,
	     shadow.frontFoot.x + shadow.position.x, shadow.frontFoot.y + shadow.position.y);
	strokeWeight(1); // reset stroke weight back to normal
	// Draws the boy on top of shadow
    boy.position.set(350, 356);
	boy.draw();
	*/

	for(var i = 0; i < rockArr.length; i++) {
		rockArr[i].draw();
	}
};
//--------------------------------------------------------
var gameObj = function() {
	this.state = [new mainMenu(), new about(), new controls(),
	              new play()];
	this.currState = 0; // Initialize to state in first index (main menu)
};
gameObj.prototype.changeStateTo = function(state) {
	this.currState = state;
};
var game = new gameObj();

/*
 *	Mouse interactions.
 */
mouseClicked = function() {
	if(game.currState === 0) { // Main menu screen
	    if(mouseX >= width-130 && mouseX <= width-40) {
	        // Mouse hovered over the "About" option
	        if(mouseY > 150 && mouseY < 180) {
	            game.changeStateTo(1); // "About" screen
	        }
	        if(mouseY > 180 && mouseY < 210) {
	            shadow.position.set(width/2, height/2+30);
	            shadow.velocity.set(0, 0);
	            shadow.acceleration.set(0, 0);
	            game.changeStateTo(2); // "Controls" screen
	        }
	        if(mouseY > 210 && mouseY < 240) {
	            boy.position.set(40, 350);
	            game.changeStateTo(3); // "Play" state
	        }
	    }
	} else if(game.currState === 1) { // "About" screen
	    game.changeStateTo(0); // main menu
	} else if(game.currState === 2) { // "Controls" screen
	    game.changeStateTo(0); // main menu
	} else if(game.currState === 3) { // "Play" state; gameplay
	    //
	}
};

draw = function() {
	game.state[game.currState].execute(game);
////////////////////// DEBUGGING //////////////////////
// game.state[3].execute(game);
///////////////////////////////////////////////////////
};

}};
