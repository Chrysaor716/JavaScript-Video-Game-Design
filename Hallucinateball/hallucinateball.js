angleMode = "radians";

// Global variables to determine if the mouse is interacting with the ball or not
var noMouse = 1; // Initialize to no mouse touching the ball

/************************* Game objects ****************************/
var gravity = new PVector(0, 0.1); // apply graviational force on ball
var ballObj = function(x, y) {
    this.position = new PVector(x,y);
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
    if(noMouse === 1) { // Use air/wind/gravity drag if no mouse touching ball
        var gravityForce = PVector.mult(gravity, this.mass);
        this.applyForce(gravityForce);
        var airFriction = PVector.mult(this.velocity, -1);
        airFriction.normalize();
        airFriction.mult(0.02);
        this.applyForce(airFriction);
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        // Bottom of canvas is the ground; bounce off the ground
        if(this.position.y > (height - (this.size/2))) {
            this.position.y = height - this.size/2;
            this.velocity.y *= -1;
        }
        this.acceleration.set(0, 0);
    }
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
            this.position.add(this.dir);
        }
        if((this.position.x < 20) ||
           (this.position.y < 20) || (this.position.y > (height-(this.size/2)))) {
                this.thrown = 0;
        }
    // }
};
var basketball = new ballObj(40, 370);
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
    basketball.draw();
    basketball.updatePosition();
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
            basketball.dir.set(mouseX-pmouseX, mouseY - pmouseY);
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
