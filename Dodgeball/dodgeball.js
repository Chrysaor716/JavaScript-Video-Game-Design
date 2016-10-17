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
    this.aVelocity = this.velocity.mag() / 4;
    if(this.velocity.x < 0) {
        this.aVelocity = -this.aVelocity; // allow spin in either direction
    }
    this.angle += this.aVelocity;
};
ballObj.prototype.draw = function() {
    this.size = this.position.y / 4.5;
    if(this.size <= 40) {
        this.size = 40; // do not allow the ball to be smaller than 40px in diameter
    }
    
    pushMatrix();
    translate(this.position.x, this.position.y);
    rotate(this.angle);
    
    noStroke();
    // Draws the base of the Jack-o-lantern
    fill(224, 138, 33);
    ellipse(0, 0, this.size, this.size);
    
    // Draws the curved line "dents" on the Jack-o-lantern
    //      ...which also looks like the lines of a basketball
    stroke(186, 109, 28);
    strokeWeight(this.size/70);
    fill(0, 0, 0, 0); // transparent (don't fill in the arc)
    arc(0, 0, this.size*0.70, this.size*0.97, -Math.PI/2, Math.PI/2);
    arc(0, 0, this.size*0.70, this.size*0.97,  Math.PI/2, 3*Math.PI/2);
    line(0, -this.size/2*0.97, 0, this.size/2*0.97);
    arc(0, 0, this.size*0.97, this.size*0.97, -Math.PI/2, Math.PI/2);
    arc(0, 0, this.size*0.97, this.size*0.97,  Math.PI/2, 3*Math.PI/2);
    
    // Draws the cut-out's of the Jack-o-lantern
    noStroke();
    fill(237, 176, 107);
    triangle(-(this.size/2/2), -this.size/2/2, -(this.size/3), 0, -this.size/10, 0);
    triangle((this.size/2/2), -this.size/2/2, (this.size/3), 0, this.size/10, 0);
    quad(-this.size/3, this.size/10, this.size/3, this.size/10,
         this.size/6, this.size/3, -this.size/6, this.size/3);
    // Draws the buck teeth of the Jack-o-lantern, "overlaying" the cut-out's
    fill(224, 138, 33);
    rect(-this.size/5, this.size/10, this.size/6, this.size/8);
    rect(this.size/60, this.size/4, this.size/6, this.size/8);
    
    // Draws the stem of the Jack-o-lantern
    fill(22, 199, 57);
    rect(-this.size/10-0.90, -this.size+(this.size/3), this.size/5, this.size/5);
    
    popMatrix();
};
var ballArr = [];
var currBall = new ballObj(width/2, 360);
ballArr.push(currBall);
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
    for(var i = 0; i < ballArr.length; i++) {
        ballArr[i].updatePosition();
        ballArr[i].draw();
    }
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
    currBall.velocity.set((target.x-currBall.position.x)*strengthLvl-1,
                      (target.y-currBall.position.y)*strengthLvl-1);
    currBall.velocity.div(30);
    currBall.drag.set(currBall.velocity.x, currBall.velocity.y);
    currBall.drag.mult(-0.3);
    
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