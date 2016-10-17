angleMode = "radians";

var strength = 0; // strength of the ball throw (depending on how long player holds mouse)
var strengthLvl = 0; // user feedback for strength level (fraction of "strength")

/*********************************** GAME OBJECTS ************************************/
// var gravity = new PVector(0, 0.1);
var target = new PVector(0, 0);
var ballObj = function(x, y) {
    this.position = new PVector(x, y);
    this.velocity = new PVector(0, 0);
    this.acceleration = new PVector(0, 0);
    this.size = 80;
    this.mass = this.size / 5;

    this.drag = new PVector(0, 0);
    this.aVelocity = 0; // angular velocity
    this.angle = 0;
};
// ballObj.prototype.applyForce = function(force) {
//     var f = PVector.div(force, this.mass);
//     this.acceleration.add(f);
// };
ballObj.prototype.updatePosition = function() {
    // var gravityForce = PVector.mult(gravity, this.mass);
    // this.applyForce(gravityForce);

    // var airFriction = PVector.mult(this.velocity, -1);
    // airFriction.normalize();
    // airFriction.mult(0.08);

    // this.velocity.add(this.acceleration);
    // this.position.add(this.velocity);

    // this.acceleration.set(0, 0); // reset acceleration each frame

    this.velocity.add(this.drag);
    this.position.add(this.velocity);
    this.drag.set(this.velocity.x, this.velocity.y);
    this.drag.mult(-0.03);
    this.aVelocity = this.velocity.mag() * 4; // modify constant 4
    if (this.velocity.x < 0) {
        this.aVelocity = -this.aVelocity;
    }
    this.angle += this.aVelocity;
};
ballObj.prototype.draw = function() {
    pushMatrix();
    translate(this.position.x, this.position.y);
    rotate(this.angle);

    noStroke();
    fill(16, 47, 168);
    ellipse(0, 0, this.size, this.size);
    fill(255, 255, 255);
    ellipse(-(this.size/2/2), 0, this.size/2/2, this.size/2/2);

    popMatrix();
};
var ball = new ballObj(width/2, 350);
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
    ball.updatePosition();
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

mouseReleased = function() {
    if(strength > 0 && strength <= 30) {
        strengthLvl = 1;
    } else if(strength > 30 && strength < 60) {
        strengthLvl = 2;
    } else if(strength >= 60) {
        strengthLvl = 3;
    }

    target.set(mouseX, mouseY);
    // ball.velocity.set(target.x - ball.position.x, target.y - ball.position.y);
    ball.velocity.set((target.x-ball.position.x)*strengthLvl,
                      (target.y-ball.position.y)*strengthLvl);
    ball.velocity.div(30);
    ball.drag.set(ball.velocity.x, ball.velocity.y);
    ball.drag.mult(-0.3);

    strength = -1; // reset strength variable when mouse is released & ball is thrown
};

/*************************************************************************************/

draw = function() {
    // game.state[game.currState].execute(game);
game.state[1].execute(game);

    if(mouseIsPressed) {
        strength++;
    }
    // strength = 0; // reset strength variable
    textSize(15);
    fill(53, 51, 196);

    text("Strength: " + strength, 300, 370);
    text("Strength lvl: " + strengthLvl, 282, 390);
};
