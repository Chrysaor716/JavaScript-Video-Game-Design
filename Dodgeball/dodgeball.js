angleMode = "radians";

var strength = 0; // strength of the ball throw (depending on how long player holds mouse)
var strengthLvl = 0; // user feedback for strength level (fraction of "strength")
var placements = []; // Place NPCs in order of when they finish

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
    
    this.inTransit = 0;
};
ballObj.prototype.updatePosition = function() {
    this.velocity.add(this.drag);
    this.position.add(this.velocity);
    this.drag.set(this.velocity.x, this.velocity.y);
    this.drag.mult(-0.03);
    this.aVelocity = this.velocity.mag() / 4;
    if(this.velocity.x < 0) {
        this.aVelocity = -this.aVelocity; // allow spin in either direction
    }
    this.angle += this.aVelocity;
    
    if(this.velocity.mag() < 0.3) {
        this.inTransit = 0;
    }
    else {
        this.inTransit = 1;
    }
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

var npcObj = function(x, y, color, dir) {
    this.RGB = color;
    this.direction = dir;
    this.finished = 0; // Boolean for when NPC reaches the other side
    this.speed = 0.5;
    this.currFrame = frameCount;
    this.angle = 180;
    
    this.position = new PVector(x, y);
    this.velocity = new PVector(0, 0);
};
npcObj.prototype.draw = function() {
    pushMatrix();
    translate(this.position.x, this.position.y);
    rotate(this.angle);
    
    noStroke();
    //////// for hitbox ///////////
    // fill(255, 0, 0, 100);
    // ellipse(0, 0, 50, 50);
    ///////////////////////////////
    // Diameter of NPC = 50
    // Draws the NPC's head
    fill(217, 178, 63);
    ellipse(0, -(50/2)+(15/2), 15, 15);
    // Draws the NPC's torso
    fill(this.RGB);
    rect(-7, -(50/2)+(15/2)+(15/2), 15, 20);
    // Draws the arms + legs (an "X")
    stroke(this.RGB);
    strokeWeight(5);
    line((50/2)*cos(radians(45)), (50/2)*sin(radians(45)),
         (50/2)*cos(radians(225)), (50/2)*sin(radians(225)));
    line((50/2)*cos(radians(135)), (50/2)*sin(radians(135)),
         (50/2)*cos(radians(315)), (50/2)*sin(radians(315)));
    
    if(this.currFrame < (frameCount - 20)) {
        this.currFrame = frameCount;
        if(this.finished === 0) {
            if(this.direction === "left") {
                this.angle--;
            } else {
                this.angle++;
            }
        }
    }
    
    popMatrix();
};
npcObj.prototype.move = function() {
    if(this.direction === "left") {
        this.position.x -= this.speed;
        // Keep the NPC at the edges
        if(this.position.x >= 410) {
            this.position.x = 410;
        }
        if(this.position.x <= -10) {
            this.position.x = -9;
            this.speed = 0;
            this.finished = 1;
            placements.push(this.RGB);
        }
    } else {
        this.position.x += this.speed;
        if(this.position.x <= -10) {
            this.position.x = -10;
        }
        if(this.position.x >= width+10) {
            this.position.x = width+9;
            this.speed = 0;
            this.finished = 1;
            placements.push(this.RGB);
        }
    }
};
npcObj.prototype.avoidBall = function() {
    if(this.finished === 0) {
        for(var i = 0; i < ballArr.length; i++) {
            if(ballArr[i].inTransit === 1) {
                // predict future position
                var x = ballArr[i].position.x + ballArr[i].velocity.x * 4;
                var y = ballArr[i].position.y + ballArr[i].velocity.y * 4;
                this.velocity.set(x - this.position.x, y - this.position.y);
                this.velocity.normalize();
                this.velocity.mult(3);
                // this.position.sub(this.velocity);
                this.position.x -= this.velocity.x;
            }
        }
    }
};
var npcArr = [];
npcArr.push(new npcObj(400, 30, color(94, 0, 255), "left"),
            new npcObj(0, 90, color(232, 28, 38), "right"),
            new npcObj(0, 150, color(171, 14, 179), "right"),
            new npcObj(400, 210, color(7, 138, 18), "left"));
var dodgingPlayer = 0;
var closestPlayer;

var graveObj = function(x, y, s) {
    this.position = new PVector(x, y);
    this.size = s;
};
graveObj.prototype.draw = function() {
    noStroke();
    fill(87, 87, 87);
    ellipse(this.position.x, this.position.y, this.size, this.size);
    rect(this.position.x-(this.size/2), this.position.y, this.size, this.size/2);
    
    textSize(this.size/3);
    fill(0, 0, 0);
    text("RIP", this.position.x-(this.size/3.5), this.position.y+(this.size/8));
    
    // Draws cracks on grave stone
    stroke(59, 58, 59);
    strokeWeight(2);
    line(this.position.x-(this.size/2), this.position.y,
         this.position.x+(this.size/10), this.position.y-(this.size/3));
    line(this.position.x+(this.size/3), this.position.y-(this.size/10),
         this.position.x, this.position.y-(this.size/4));
    line(this.position.x+(this.size/2), this.position.y+(this.size/5),
         this.position.x+(this.size/6), this.position.y+(this.size/4));
};
var graveArr = [new graveObj(100, 50, 30), new graveObj(170, 160, 50),
                new graveObj(330, 160, 50), new graveObj(200, 100, 40),
                new graveObj(60, 210, 60, 60)];
/*************************************************************************************/
mouseReleased = function() {
    if(strength > 0 && strength <= 20) {
        strengthLvl = 1;
    } else if(strength > 20 && strength < 50) {
        strengthLvl = 2;
    } else if(strength >= 50 && strength < 80) {
        strengthLvl = 3;
    } else if(strength >= 80) {
        strengthLvl = 4;
    }
    
    // target.set(mouseX, mouseY);
    if(strengthLvl === 0) {
        target.set(mouseX, 210);
    } else if(strengthLvl === 1) {
        target.set(mouseX, 150);
    } else if(strengthLvl === 2) {
        target.set(mouseX, 90);
    } else if(strengthLvl === 3) {
        target.set(mouseX, 30);
    } else {
        target.set(mouseX, mouseY);
    }
    if(target.y-currBall.position.y <= 0) { // only allows for ball to shoot up the canvas
        currBall.velocity.set((target.x-currBall.position.x)*strengthLvl-1,
                              (target.y-currBall.position.y)*strengthLvl-1);
    }
    currBall.velocity.div(30);
    currBall.drag.set(currBall.velocity.x, currBall.velocity.y);
    currBall.drag.mult(-0.3);
    
    // Current ball becomes the last pushed element into ball array
    // currBall = ballArr[ballArr.length-1];
    
    strength = -1; // reset strength variable when mouse is released & ball is thrown
};
/*************************************************************************************/
var chooseClosestPlayer = function() {
    var bestPlayer = 0;
    var thresholdDist = 200;
    var d = 0;
    for(var i = 0; i < npcArr.length; i++) {
        if(i !== dodgingPlayer) {
            d = dist(target.x, target.y, npcArr[i].position.x, npcArr[i].position.y);
            if(d < thresholdDist) {
                thresholdDist = d;
                bestPlayer = i;
            }
        }
    }
    return(bestPlayer);
};
/*********************************** GAME STATES ************************************/
var menuState = function() {}; // constructor
menuState.prototype.execute = function(me) { // 0
    background(0, 0, 0);
    fill(255, 255, 255);
    textSize(35);
    text("Dodgeball", 120, 40);
    fill(255, 147, 23);
    textSize(17);
    text("Halloween edition", 130, 65);
    fill(255, 255, 255);
    textSize(15);
    text("Hello, spooky peeps! The game is simple.\n"+
         "Click and hold the mouse to shoot the\n" +
         "Jack-o'-lantern at the bottom of the screen.\n\n\n\n\n\n\n\n" +
         "The power of your shot is determined by\n" +
         "these \"powerful\" numbers down at the\n" +
         "bottom right hand corner here!\n\n" +
         "               Click anywhere to play!", 50, 100);
};
var playState = function() {}; // constructor
playState.prototype.execute = function(me) { // 1
    background(255, 255, 255);
    // Draws base color for ground
    fill(89, 28, 110);
    rect(0, 0, width, height);
    
    for(var i = 0; i < npcArr.length; i++) {
        npcArr[i].draw();
        npcArr[i].move();
        // Collision condition
        for(var j = 0; j < ballArr.length; j++) {
            if(ballArr[j].inTransit === 1 && npcArr[i].finished === 0) {
                if(dist(ballArr[j].position.x, ballArr[j].position.y, npcArr[i].position.x, npcArr[i].position.y) <= 20) {
                    // Restart their position if they are hit by ball
                    if(npcArr[i].direction === "left") {
                        npcArr[i].position.x = 400;
                    } else {
                        npcArr[i].position.x = 0;
                    }
                }
            }
        }
    }
    for(var i = 0; i < graveArr.length; i++) {
        graveArr[i].draw();
    }
    for(var i = 0; i < ballArr.length; i++) {
        ballArr[i].updatePosition();
        ballArr[i].draw();
        
        // Remove ball (make it disappear) when it stops moving
        //      (and is not in the initital position);
        // if((Math.floor(ballArr[i].velocity.y) === -1) && (ballArr[i].position.y !== 360)) {
        if(ballArr[i].velocity.mag() < 0.3 && (ballArr[i].position.y !== 360)) {
            ballArr.splice(i, 1);
        }
        
        if(ballArr[i].inTransit === 1) {
            closestPlayer = chooseClosestPlayer();
            npcArr[closestPlayer].avoidBall();
        } else {
            dodgingPlayer = closestPlayer;
        }
    }

    if(placements.length >= 4) {
        me.changeStateTo(2);
    }
};
var doneState = function() {}; // constructor
doneState.prototype.execute = function() { // 2
    background(255, 255, 255);
    fill(0, 0, 0);
    textSize(30);
    text("NPC Placements:", 90, 90);
    textSize(20);
    text("1. \n\n" + "2. \n\n" + "3. \n\n" + "4. \n\n", 110, 150);
    fill(placements[0]);
    rect(150, 125, 100, 30);
    fill(placements[1]);
    rect(150, 170, 100, 30);
    fill(placements[2]);
    rect(150, 215, 100, 30);
    fill(placements[3]);
    rect(150, 260, 100, 30);
};
//-----------------------------------------------------------------------------------
var gameObj = function() {
    this.state = [new menuState(), new playState(), new doneState()];
    this.currState = 0; // index 0 (menuState)
};
gameObj.prototype.changeStateTo = function(state) {
    this.currState = state;
};
var game = new gameObj();
//---------------------------------------------------
mouseClicked = function() {
    if(game.currState === 0) { // If user clicks on screen during menu state
        game.changeStateTo(1); //   change to play state
    }
};
/*************************************************************************************/

draw = function() {
    game.state[game.currState].execute(game);
//////////////////////////////////////////////////////////////////
// game.state[2].execute(game);
//////////////////////////////////////////////////////////////////

    // Spawn a new ball at the bottom (after a certain period of time)
    //      once the previous ball has left its init position
    if(currBall.position.y !== 360) {
        if(frameCount % 10 === 0) {
            currBall = new ballObj(width/2, 360);
            ballArr.push(currBall);
        }
    }

    if(mouseIsPressed) {
        strength++;
    }
    // strength = 0; // reset strength variable
    textSize(15);
    fill(53, 51, 196);
    
    text("Strength: " + strength, 300, 370);
    text("Strength lvl: " + strengthLvl, 282, 390);
};