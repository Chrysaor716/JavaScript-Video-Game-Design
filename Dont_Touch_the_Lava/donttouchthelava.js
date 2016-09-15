/*
 *  Frogger, but without the frog. This is the classic childhood imagination coming to life.
 *  Don't touch the lava!
 *
 *  Uses the default canvas size (400x400 pixels)
 */
frameRate(60);

// State machine variable for game
var state = "Menu";

var lava = function() {
    this.start = Math.floor((Math.random() * 430) + 1);
    // Draw lava (w/ bubbles on the top half of the screen)
    this.x = Math.floor((Math.random() * 400) + 1);
    this.y = Math.floor((Math.random() * 200) + 1);
    this.diameter = 0;
};
lava.prototype.draw = function() {
    // Draws a single bubble
    stroke(0, 0, 0);
    ellipse(this.x, this.y, this.diameter, this.diameter);
};
lava.prototype.move = function() {
    this.start++;
    // Grows the bubble until it pops
    if(this.start > 500) {
        this.diameter += 0.35;
    }
    if(this.diameter > 35) {
        // Regenerate with a different position and start time after bubble pops
        this.start = Math.floor((Math.random() * 430) + 1);
        this.x = Math.floor((Math.random() * 400) + 1);
        this.y = Math.floor((Math.random() * 150) + 1);
        this.diameter = -50;
    }
};

var flame = function(xC, yC, s) {
    this.xCenter = xC;
    this.yCenter = yC;
    this.speed = s;
};
flame.prototype.draw = function() {
    noStroke();
    fill(255, 0, 0);
    ellipse(this.xCenter, this.yCenter, 30, 30);
    triangle(this.xCenter, this.yCenter-15, this.xCenter+30, this.yCenter-7, this.xCenter, this.yCenter);
    triangle(this.xCenter, this.yCenter-7, this.xCenter+40, this.yCenter, this.xCenter, this.yCenter+7);
    triangle(this.xCenter, this.yCenter+15, this.xCenter+30, this.yCenter+7, this.xCenter, this.yCenter);
};
flame.prototype.move = function() {
    this.xCenter -= this.speed;
    if(this.xCenter < -50) {
        this.xCenter = width + 100;
    }
};

var danger = [];
for(var i = 0; i < 60; i++) {
    danger.push(new lava());
}
var fireArr = [new flame(width-55, 30*7+15, 3), new flame(width-165, 30*7+15, 3), new flame(width-275, 30*7+15, 3)];
draw = function() {
    background(255, 255, 255);
    switch(state) {
        case "Menu":
            // code
            
            state = "Game";
        break;
        
        case "Game":
            // Draws a background color to the top half of the screen
            noStroke();
            fill(240, 0, 0);
            rect(0, 0, width, height/2);
            // Draws the popping bubbles in lava
            for(var i = 0; i < danger.length; i++) {
                danger[i].draw();
                danger[i].move();
            }
            // Draws a background color to the bottom half of the screen
            noStroke();
            fill(72, 232, 224);
            rect(0, height/2, width, height/2);
            // Draws the starting point, a couch, at the very bottom of the canvas
            // (canvas height) / (13 rows, like in Frogger) ~= 30 (rounded down)
            // The remainder leaves the bottom to be 40 pixels in height
            //      height-(30*12) = 40
            stroke(0, 0, 0);
            fill(189, 151, 85);
            // width / 3 = 400 / 3 = 133 remainder 1
            // Draws couch seats
            rect(5, 360, 128, 25);
            rect(5+128, 360, 128, 25);
            rect(5+128+128, 360, 128, 25);
            // Draws couch back rest
            quad(5, 360+25, 133, 360+25, 133, 360+25+20, 0, 360+25+20);
            rect(133, 360+25, 128, 20);
            quad(133+128, 360+25, 133+128+128, 360+25, width, height, 133+128, 360+25+20);
            // Draws couch arm rests
            rect(5, 360, 10, 25);
            rect(width-20, 360, 10, 25);
            
            // Draws the bridge at the bottom half of the screen
            fill(115, 80, 45);
            // Draws two vertical rectangles for bridge base
            rect(40, height/2, 20, 200-40);
            rect(width-70, height/2, 20, 200-40);
            // Draws (mostly random) bridge steps
            quad(10, height/2+20, width-7, height/2+15,
                    width-15, height/2+34, 5, height/2+40);
            quad(0, height/2+45, width-10, height/2+40,
                    width-2, height/2+65, 7, height/2+60);
            quad(10, height/2+65, width-5, height/2+70,
                    width-13, height/2+95, 3, height/2+90);
            quad(9, height/2+98, width-11, height/2+102,
                    width-4, height/2+124, 10, height/2+127);
            quad(0, height/2+135, width, height/2+132,
                    width-13, height/2+157, 7, height/2+156);
            // Draws the nails on the bridge
            fill(191, 191, 191);
            ellipse(50, height/2+30, 10, 10);
            ellipse(width-60, height/2+25, 10, 10);
            ellipse(50, height/2+52, 10, 10);
            ellipse(width-60, height/2+53, 10, 10);
            ellipse(50, height/2+78, 10, 10);
            ellipse(width-60, height/2+83, 10, 10);
            ellipse(50, height/2+113, 10, 10);
            ellipse(width-60, height/2+113, 10, 10);
            ellipse(50, height/2+146, 10, 10);
            ellipse(width-60, height/2+145, 10, 10);
            
            // Spawns the meteorites/flames
            for(var i = 0 ; i < 3; i++) {
                fireArr[i].draw();
                fireArr[i].move();
            }
///////////////////////////////////////////////////////////////////////////////////////
// PLACEHOLDER; TEMPORARY; TODO REMOVE THIS LATER!!!!
            noStroke();
            fill(43, 41, 39);
            rect(0, 30*6, width, 30);
            
            stroke(0, 0, 0); // round down to 30
            for(var i = 0; i < 13; i++) {
                line(0, 30*i, width, 30*i);
            } // height-(30*12) = 40
///////////////////////////////////////////////////////////////////////////////////////
        break;
        
        default:
            state = "Menu";
        break;
    }
};