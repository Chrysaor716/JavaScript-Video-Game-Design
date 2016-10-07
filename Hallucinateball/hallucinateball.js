angleMode = "radians";

// Global variables to determine if the mouse is interacting with the ball or not
var noMouse = 1; // Initialize to no mouse touching the ball
var score = 5;

/************************* Game objects ****************************/
var gravity = new PVector(0, 0.1); // apply graviational force on ball
var ballObj = function(x, y) {
    this.position = new PVector(x, y);
    this.velocity = new PVector(0, 0);
    this.acceleration = new PVector(0, 0);
    this.size = 40;
    this.mass = this.size / 5;

    // Mouse interaction variables
    this.dir = new PVector(0, 0);
    this.thrown = 0;
};
ballObj.prototype.applyForce = function(force) {
    var f = PVector.div(force, this.mass);
    this.acceleration.add(f);
};
ballObj.prototype.updatePosition = function() {
    // if(noMouse === 1) { // Use air/wind/gravity drag if no mouse touching ball
        var gravityForce = PVector.mult(gravity, this.mass);
        this.applyForce(gravityForce);

        var airFriction = PVector.mult(this.velocity, -1);
        airFriction.normalize();
        airFriction.mult(0.08);

        this.applyForce(airFriction);
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        // Bottom of canvas is the ground; bounce off the ground
        if(this.position.y > (height - (this.size/2))) {
            this.position.y = height - this.size/2;
            this.velocity.y *= -1;
        }
        if(this.position.x < 20) { // bounce off left edge
            this.position.x = 20;
            this.velocity.x *= -1;
        }
        this.acceleration.set(0, 0); // reset acceleration each frame
    // }
};
/* STRETCH GOAL: MAKE THE BALL PRETTIER */
ballObj.prototype.draw = function() {
    noStroke();
    fill(74, 74, 74);
    ellipse(this.position.x, this.position.y, this.size, this.size);
    fill(0, 61, 184);
    arc(this.position.x-5, this.position.y, this.size+10, this.size, -Math.PI/3, Math.PI/3);
    fill(105, 17, 130);
    arc(this.position.x+5, this.position.y, this.size+10, this.size, 2*Math.PI/3, 4*Math.PI/3);
    fill(74, 74, 74);
    arc(this.position.x-5, this.position.y, this.size-10, this.size-10, -Math.PI/3, Math.PI/3);
    arc(this.position.x+5, this.position.y, this.size-10, this.size-10, 2*Math.PI/3, 4*Math.PI/3);
    stroke(0, 0, 0);
    strokeWeight(2);
    fill(252, 252, 252, 1);
    arc(this.position.x, this.position.y, this.size, this.size/2, Math.PI/6, 5*Math.PI/6);
    arc(this.position.x, this.position.y, this.size, this.size/2, 7*Math.PI/6, 11*Math.PI/6);

    // if(noMouse === 1) {
        if(this.thrown === 2) {
            // this.position.add(this.dir);
            this.position.add(this.acceleration);
        }
    // }
};
var basketball = new ballObj(40, 350);

var childObj = function(x, y) {
    this.position = new PVector(x, y);
};
childObj.prototype.draw = function() {
    noStroke();
    // Draws the (totally accurate) tuba the child hugs
    fill(207, 185, 20);
    arc(this.position.x+2, this.position.y-30, 70, 16, Math.PI, 2*Math.PI);
    triangle(this.position.x-33, this.position.y-30,
             this.position.x+29, this.position.y-30, this.position.x+5, this.position.y+10);
    rect(this.position.x-22, this.position.y-19, 45, 60);
    fill(194, 159, 31);
    rect(this.position.x-8, this.position.y-22, 10, 60);
    triangle(this.position.x-26, this.position.y-30,
             this.position.x+15, this.position.y-30, this.position.x-3, this.position.y-18);
    arc(this.position.x, this.position.y-28, 50, 12, Math.PI, 2*Math.PI);
    rect(this.position.x+15, this.position.y-20, 7, 55);
    fill(232, 227, 135); // draws the shine
    ellipse(this.position.x-10, this.position.y+8, 6, 63);
    fill(115, 87, 32);
    rect(this.position.x, this.position.y-20, 5, 55);

    fill(227, 169, 54);
    // Draws head
    ellipse(this.position.x+40, this.position.y-20, 30, 30);
    // Draws "hugging" arm
    ellipse(this.position.x+15, this.position.y, 100, 14);
    // Draws the eye
    fill(0, 0, 0);
    ellipse(this.position.x+30, this.position.y-20, 4, 7);
    // Draws (short) sleeve
    fill(57, 45, 214);
    ellipse(this.position.x+40, this.position.y+2, 20, 20);
    rect(this.position.x+20, this.position.y-8, 20, 20);
    rect(this.position.x+25, this.position.y, 25, 35);
    // Draws the hair
    fill(128, 99, 41);
    rect(this.position.x+24, this.position.y-32, 30, 10);
    rect(this.position.x+45, this.position.y-32, 15, 30);
    arc(this.position.x+56, this.position.y-5, 22, 25, 0, Math.PI);
    arc(this.position.x+42, this.position.y-30, 35, 20, Math.PI, 2*Math.PI);
    // Draws the leg/foot
    fill(92, 156, 196);
    rect(this.position.x-20, this.position.y+35, 70, 20);
    fill(92, 92, 92);
    rect(this.position.x-40, this.position.y+35, 25, 20);
    ellipse(this.position.x-31, this.position.y+35, 18, 30);

    ////////////////TEMP; FOR HIT BOX/////////////////////
    // fill(255, 0, 0);
    // rect(this.position.x-22, this.position.y-30, 45, 85);
    //////////////////////////////////////////////////////
};
var girl = new childObj(width-70, 320);
/*******************************************************************/

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
    fill(255, 0, 0);
    textSize(15);
    text("Score: " + score, width-70, height-5);

    basketball.draw();
    if(noMouse === 1) {
        basketball.updatePosition();
    }
    girl.draw();
    // Checks if basketball is within the girl's trumpet
    if(basketball.position.y >= girl.position.y-30 &&
       basketball.position.y <= girl.position.y+55) {
           // STRETCH GOAL: Adding bouncing inside basket
           if(basketball.position.x-20 >= girl.position.x-22 &&
              basketball.position.x+20 <= girl.position.x+23) {
               score += 8;
            //   basketball = new ballObj(40, 350);
                basketball.position.set(40, 350);
                basketball.velocity.set(0, 0);
                basketball.acceleration.set(0, 0);
           }
           // bounce off left edge of girl's basket
           if(basketball.position.x+20 > girl.position.x-22) {
                basketball.position.x = girl.position.x-42;
                basketball.velocity.x *= -1;
           }
    }
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

/***************** Game interaction (mouse clicks) ********************/
// Used to detect if user clicked inside ball to pick it up
var circleDetected = function(xPos, yPos) {
    var dx = mouseX - xPos;
    var dy = mouseY - yPos;
    var sqDist = dx*dx + dy*dy;
    var radius = basketball.size / 2;
    var sqRadius = radius * radius;
    if(sqDist <= sqRadius) {
        return true;
    } else {
        return false;
    }
};
mouseClicked = function() {
    if(game.currState === 0) { // If user clicks on screen
        game.changeStateTo(1); //   change to play state
        noMouse = 1; // initialize to no mouse touching the ball
    }
};
var mouseDragged = function() {
    if(game.currState === 1) { // In play state
        // Checks is user clicks on the ball
        if(circleDetected(basketball.position.x, basketball.position.y)) {
            noMouse = 0; // mouse is touching the ball, so this boolean is false
            // pmouseX, pmouseY = previous mouse position
            // basketball.dir.set(mouseX-pmouseX, mouseY - pmouseY);
            basketball.acceleration.set(mouseX-pmouseX, mouseY - pmouseY);
            basketball.position.set(mouseX, mouseY);
            basketball.thrown = 1; // state before ball is throw (picked up by mouse)
        }
    }
};
mouseReleased = function() {
    if(basketball.thrown === 1) { // mouse is released AND ball was previously picked up
        basketball.thrown = 2; // ball is airborne
        noMouse = 1; // ball is released (so mouse no longer touches it)
    }
};
/**********************************************************************/

draw = function() {
    // game.state[game.currState].execute();
    game.state[1].execute();
};
