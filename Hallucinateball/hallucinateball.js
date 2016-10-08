angleMode = "radians";

// Global variables to determine if the mouse is interacting with the ball or not
var noMouse = 1; // Initialize to no mouse touching the ball
var score = 5;

/************************* Game objects ****************************/
var boardObj = function(x, y, RGB) {
    this.position = new PVector(x, y);
    this.colour = RGB;
    this.size = 50;
};
boardObj.prototype.draw = function() {
    noStroke();
    fill(this.colour);
    rect(this.position.x, this.position.y, this.size, this.size);
    fill(0, 0, 0, 1);
    stroke(255, 255, 255);
    strokeWeight(3);
    rect(this.position.x+(this.size/4)-1, this.position.y+(this.size/2),
         this.size/2, this.size/2);
};
var redBoard = new boardObj(130, 50, color(255, 0, 0));
var blueBoard = new boardObj(220, 50, color(0, 0, 255));

var gravity = new PVector(0, 0.1); // apply graviational force on ball
var wind = new PVector(1, 0);
var windSpeed = 0;
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
    // Use air/wind/gravity drag if no mouse touching ball
    var gravityForce = PVector.mult(gravity, this.mass);
    this.applyForce(gravityForce);

    var airFriction = PVector.mult(this.velocity, -1);
    airFriction.normalize();
    airFriction.mult(0.08);
    this.applyForce(airFriction);

    var windForce = PVector.mult(wind, this.mass);
    windForce.mult(windSpeed);
    this.applyForce(windForce);

    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    // Bottom of canvas is the ground; bounce off the ground
    if(this.position.y > (height - (this.size/2))) {
        this.position.y = height - (this.size/2);
        this.velocity.y *= -1;
    }
    if(this.position.x < 20) { // bounce off left edge
        this.position.x = 20;
        this.velocity.x *= -1;
    }

    // If ball exceeds right edge of canvas, reset it's position
    if(this.position.x-20 > width) {
        this.position.set(40, 350);
        this.velocity.set(0, 0);
        this.acceleration.set(0, 0);

        redBoard.colour = color(255, 0, 0);
        blueBoard.colour = color(0, 0, 255);
    }

    this.acceleration.set(0, 0); // reset acceleration each frame
};
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

    if(this.thrown === 2) {
        this.position.add(this.acceleration);
    }
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

var counterObj = function(x, y) {
    this.position = new PVector(x, y);
};
counterObj.prototype.draw = function() {
    noStroke();
    fill(61, 103, 158);
    rect(this.position.x, this.position.y, 120, 60); //---note this line for hitbox---
    fill(41, 78, 133);
    rect(this.position.x+105, this.position.y, 10, 60);

    fill(255, 255, 255);
    arc(this.position.x+60, this.position.y, 120, 20, 0, Math.PI);
    stroke(15, 38, 87);
    strokeWeight(15);
    arc(this.position.x+60, this.position.y, 105, 20, 0, Math.PI);
    fill(255, 255, 255, 1);
    stroke(255, 255, 255);
    strokeWeight(4);
    arc(this.position.x+60, this.position.y+20, 110, 20, 0, Math.PI);
    arc(this.position.x+60, this.position.y+30, 110, 20, radians(35), radians(55));
    arc(this.position.x+60, this.position.y+35, 110, 20, radians(35), radians(60));
    arc(this.position.x+60, this.position.y+45, 110, 20, radians(35), radians(60));
    fill(255, 255, 255);
    rect(this.position.x+94, this.position.y+28, 8, 30);
    noStroke();
};
var hotTub = new counterObj(width-230, 190);
/*******************************************************************/

//---------------------------- MISC. ---------------------------------
// Clouds objects for background--purely for aesthetics--not a functional
//      game object.
var cloudObj = function(x, y) {
    this.position = new PVector(x, y);
};
cloudObj.prototype.draw = function() {
    noStroke();
    fill(255, 255, 255, 200);
    ellipse(this.position.x, this.position.y, 50, 30);
    ellipse(this.position.x-30, this.position.y+10, 40, 7);
    ellipse(this.position.x+20, this.position.y+3, 40, 12);
    ellipse(this.position.x-22, this.position.y, 30, 20);

    // this.position.add(wind);
};
// var clouds = [new cloudObj(100, 50), new cloudObj(170, 30), new cloudObj(250, 70),
//               new cloudObj(50, 20), new cloudObj(350, 17), new cloudObj(400, 160),
//               new cloudObj(20, 200), new cloudObj(60, 150), new cloudObj(200, 130)];
var clouds = [];
var cloudBundleObj = function(x, y) {
    this.position = new PVector(x, y);

    clouds.push(new cloudObj(this.position.x+50, this.position.y+30));
    clouds.push(new cloudObj(this.position.x+120, this.position.y+10));
    clouds.push(new cloudObj(this.position.x+200, this.position.y+50));

    clouds.push(new cloudObj(this.position.x, this.position.y));
    clouds.push(new cloudObj(this.position.x+300, this.position.y+3));
    clouds.push(new cloudObj(this.position.x+350, this.position.y+140));

    clouds.push(new cloudObj(this.position.x-30, this.position.y+180));
    clouds.push(new cloudObj(this.position.x+10, this.position.y+130));
    clouds.push(new cloudObj(this.position.x+150, this.position.y+110));
};
cloudBundleObj.prototype.draw = function() {
    for(var i = 0; i < clouds.length; i++) {
        clouds[i].draw();
        clouds[i].position.add(wind);
    }
};
var cloudBundle = new cloudBundleObj(50, 20);
//--------------------------------------------------------------------

//////////////////////* Game states *//////////////////////
var menuState = function() {}; // constructor
menuState.prototype.execute = function(me) {
    // Reset variables
    noMouse = 1; // initialize to no mouse touching the ball
    score = 5;
    basketball.position.set(40, 350);
    basketball.velocity.set(0, 0);
    basketball.acceleration.set(0, 0);

    background(0, 0, 0);
    colorMode(HSB);
    textSize(40);
    var title = "Hallucinateball";
    for(var i = 0; i < title.length; i ++){
        fill(map(i, 0, title.length, 0, 255), 255, 255);
        text(title, 70, 40);
    }
    colorMode(RGB);
    fill(255, 255, 255);
    textSize(17);
    text("Hi there. You're playing basketball. Everything is\n" +
         "colorful. The baskets aren't actual baskets, but a\n" +
         "part of your hallucination. Go get some rest, mate.\n" +
         "But...not after a few shots at the hoop...or...hoops?", 10, 60);
    textSize(15);
    text("At the bottom left is a transparent box. That's the arena\n" +
         "where you can throw your ball from. In the background are\n" +
         "two backboards. Intersecting them gets you 4 points.\n" +
         "Then lies a hot tub. Getting the ball through that\n" +
         "tub gets you 3 points.\n" +
         "Last, there is a little girl with her instrument. Making the ball\n" +
         "into her tuba gets you 7 points.", 10, 150);
    text("Each shot you take costs you a point. If you reach zero,\n" +
         "you lose. Earn 20 points to win!", 10, 280);
    textSize(20);
    text("Click anywhere on the screen to begin.", 25, 380);
};

var playState = function() {}; // constructor
playState.prototype.execute = function(me) {
    background(255, 255, 255);
    // Sky
    fill(128, 219, 242);
    rect(0, 0, width, 250);
    // Clouds
    // for(var i = 0; i < clouds.length; i++) {
    //     clouds[i].draw();
    // }
    cloudBundle.draw();
    // Grass
    fill(41, 179, 41, 255);
    rect(0, 250, width, 150);
    // Basketball hoop poles
    fill(107, 74, 31);
    rect(redBoard.position.x+15, redBoard.position.y+40, 20, 160);
    rect(blueBoard.position.x+15, blueBoard.position.y+40, 20, 160);

    fill(255, 0, 0);
    textSize(15);
    text("Score: " + score, width-70, height-5);

    // Change wind every second (60 frames)
    if(frameCount%60 === 0) {
        wind.set(random(-2, 1), random(-1, 1));
        windSpeed = random(0, 0.03);
    }
    stroke(43, 240, 240);
    line(width-100, height-10, (width-100)+wind.x, (height-20)+wind.y);
    noStroke();
    fill(0, 81, 255);
    ellipse((width-100), (height-10), 5, 5); // center
    textSize(12);
    fill(9, 90, 94);
    text("wind", width-145, height-8);

    redBoard.draw();
    blueBoard.draw();
    // Check if ball hits boards
    if(basketball.position.x <= redBoard.position.x + 50 &&
       basketball.position.x >= redBoard.position.x &&
       basketball.position.y <= redBoard.position.y + 50 &&
       basketball.position.y >= redBoard.position.y) {
           if(frameCount%10 === 0) {
                redBoard.colour = color(224, 69, 69);
                score += 2;
           }
    }
    if(basketball.position.x <= blueBoard.position.x + 50 &&
       basketball.position.x >= blueBoard.position.x &&
       basketball.position.y <= blueBoard.position.y + 50 &&
       basketball.position.y >= blueBoard.position.y) {
           if(frameCount%10 === 0) {
                blueBoard.colour = color(84, 84, 204);
                score += 2;
           }
    }

    basketball.draw();
    if(noMouse === 1) {
        basketball.updatePosition();
    }
    // // Adds "3D"/distance effect to ball as it travels across canvas
    // if(basketball.position.x >= 0 && basketball.position.x <= 130) {
    //     basketball.size = basketball.position.x*0.9;
    // }
    // Draws a boundary for the ball
    noStroke();
    fill(0, 0, 0, 80);
    rect(0, 150, 155, 250);
    // Add bounces off the init box
    if(basketball.thrown !== 2) {
        if(basketball.position.x+20 >= 155) {
            basketball.position.x = 135;
            basketball.velocity.x *= -1;
            if(basketball.position.x >= 156) {
                basketball.thrown = 2;
            }
        }
    }
    // Reset ball's position if it exceeds the canvas position at the right
    if(basketball.position.x-20 > width) {
       basketball.position.set(40, 350);
       basketball.velocity.set(0, 0);
       basketball.acceleration.set(0, 0);
    }

    girl.draw();
    // Checks if basketball is within the girl's trumpet
    if(basketball.position.y >= girl.position.y-30 &&
       basketball.position.y <= girl.position.y+55) {
           // STRETCH GOAL: Adding bouncing inside basket
           if(basketball.position.x-20 >= girl.position.x-22 &&
              basketball.position.x+20 <= girl.position.x+30) {
               score += 8;
            //   basketball = new ballObj(40, 350);
                basketball.position.set(40, 350);
                basketball.velocity.set(0, 0);
                basketball.acceleration.set(0, 0);
                redBoard.colour = color(255, 0, 0);
                blueBoard.colour = color(0, 0, 255);
           }
           // bounce off left edge of girl's basket
           if(basketball.position.x+20 > girl.position.x-25 &&
              basketball.position.x+20 <= girl.position.x-20) {
                basketball.position.x = girl.position.x-42;
                basketball.velocity.x *= -1;
           }
    }

    hotTub.draw();
    // Checks if basketball falls behind the bar counter
    if(basketball.position.y >= hotTub.position.y &&
       basketball.position.y <= hotTub.position.y+60) {
            if(basketball.position.x+20 <= hotTub.position.x+120 && // w/in right edge
              basketball.position.x-20 >= hotTub.position.x) { // w/in left edge
                    if(frameCount%30 === 0) {
                        score += 3;
                    }
            }
            // Bounce ball off left edge
            if(basketball.position.x+20 >= hotTub.position.x &&
               basketball.position.x+20 <= hotTub.position.x+10) {
                    basketball.position.x = hotTub.position.x-20;
                    basketball.velocity.x *= -1;
            }
            // // Bounce w/in counter
            // if(basketball.position.x+20 >= hotTub.position.x+110 &&
            //   basketball.position.x+20 <= hotTub.position.x+120) {
            //       basketball.position.x = hotTub.position.x+100;
            //       basketball.velocity.x *= -1;
            // }
            // if(basketball.position.x-20 >= hotTub.position.x &&
            //   basketball.position.x-20 <= hotTub.position.x+10) {
            //       basketball.position.x = hotTub.position.x+20;
            //       basketball.velocity.x *= -1;
            // }
    }

    if(score <= 0) {
        me.changeStateTo(3);
    }
    if(score >= 20) {
        me.changeStateTo(2);
    }
};
var winState = function(me) {}; // constructor
winState.prototype.execute = function() {
    background(255, 255, 255);
    textSize(40);
    fill(0, 0, 0);
    text("You win!", 120, 160);
    textSize(20);
    text("Your head feeling better?", 90, 200);
    textSize(15);
    text("Click anywhere on the screen to try again.", 60, 220);

    var starkySapling = getImage("avatars/starky-sapling");
    image(starkySapling, 150, 220, 80, 80);
};
var loseState = function(me) {}; // constructor
loseState.prototype.execute = function() {
    background(0, 0, 0);
    textSize(40);
    fill(255, 255, 255);
    text("Oh noes!", 120, 160);
    textSize(20);
    text("Click screen to try again.", 90, 200);

    var redMarcimus = getImage("avatars/marcimus-red");
    image(redMarcimus, 150, 220, 80, 80);
};
//--------------------------------------------------------
var gameObj = function() {
    this.state = [new menuState(), new playState(), new winState(), new loseState()];
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
    if(game.currState === 2) { // Win state
        game.changeStateTo(0); // Go back to menu
        noMouse = 1;
    }
    if(game.currState === 3) { // Game over/lose state
        game.changeStateTo(0); // Go back to menu
        noMouse = 1;
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
        score--; // costs 1 point to shoot a ball
        noMouse = 1; // ball is released (so mouse no longer touches it)
    }
};
/**********************************************************************/

draw = function() {
    game.state[game.currState].execute(game);
};
