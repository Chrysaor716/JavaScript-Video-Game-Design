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
    triangle(this.xCenter, this.yCenter-15, this.xCenter+30, this.yCenter-7, this.xCenter, this.yCenter);
    triangle(this.xCenter, this.yCenter-7, this.xCenter+40, this.yCenter, this.xCenter, this.yCenter+7);
    triangle(this.xCenter, this.yCenter+15, this.xCenter+30, this.yCenter+7, this.xCenter, this.yCenter);
    ellipse(this.xCenter, this.yCenter, 30, 30);
    // Draws a smaller, orange version to overlay the red flame (for more "flame" effect)
    fill(255, 140, 0);
    triangle(this.xCenter, this.yCenter-10, this.xCenter+20, this.yCenter-5, this.xCenter, this.yCenter);
    triangle(this.xCenter, this.yCenter-5, this.xCenter+30, this.yCenter, this.xCenter, this.yCenter+5);
    triangle(this.xCenter, this.yCenter+10, this.xCenter+20, this.yCenter+5, this.xCenter, this.yCenter);
    ellipse(this.xCenter, this.yCenter, 20, 20);
};
flame.prototype.move = function() {
    this.xCenter -= this.speed;
    if(this.xCenter < -50) {
        this.xCenter = width + 100;
    }
};

var platform = function(xPos, yPos, s, dir) {
    this.x = xPos;
    this.y = yPos;
    this.speed = s;
    this.direction = dir;
};
platform.prototype.draw = function() {
    // Draws a wooden platform to jump on
    stroke(0, 0, 0);
    fill(140, 67, 3);
    rect(this.x, this.y, 40, 8);
    rect(this.x, this.y+11, 40, 8);
    rect(this.x, this.y+22, 40, 8);
};
platform.prototype.move = function() {
    if(this.direction === "left") {
        this.x += this.speed;
        if(this.x > width+50) {
            this.x = -50;
        }
    } else {
        this.x -= this.speed;
        if(this.x < -50) {
            this.x = width+50;
        }
    }
};

var child = function(xStart, yStart) {
    this.x = xStart;
    this.y = yStart;
};
child.prototype.draw = function() {
    stroke(0, 0, 0);
    fill(219, 208, 0);
    // Add lower threshold for downwards movement
    if(this.y > height-30+5) {
        this.y = height-30+5;
    }
    ellipse(this.x, this.y, 30, 30);
};

var keys = [];
var keyPressed = function() {
    keys[keyCode] = 1;
};
var keyReleased = function() {
    keys[keyCode] = 0;
};

var danger = [];
for(var i = 0; i < 60; i++) {
    danger.push(new lava());
}

var fireArr5 = [new flame(width-55, 30*7+15, 1), new flame(width-165, 30*7+15, 1), new flame(width-275, 30*7+15, 1)];
var fireArr3 = [new flame(width, 30*9+15, 3), new flame(width-200, 30*9+15, 3), new flame(width-400, 30*9+15, 3)];
var fireArr2 = [new flame(width, 30*10+15, 1), new flame(width-200, 30*10+15, 1), new flame(width-400, 30*10+15, 1)];

var wood7 = [new platform(0, 30*5, 1, "left"), new platform(-90, 30*5, 1, "left"), new platform(-180, 30*5, 1, "left"), new platform(-270, 30*5, 1, "left")];
var wood9 = [new platform(100, 30*3, 3, "left"), new platform(200, 30*3, 3, "left"), new platform(300, 30*3, 3, "left"), new platform(400, 30*3, 3, "left")];
var wood11 = [new platform(150, 30*1, 2, "left"), new platform(300, 30*1, 2, "left"), new platform(450, 30*1, 2, "left")];
var wood10 = [new platform(90, 30*2, 1, "right"), new platform(180, 30*2, 1, "right"), new platform(270, 30*2, 1, "right"), new platform(360, 30*2, 1, "right")];
var wood8 = [new platform(150, 30*4, 2, "right"), new platform(300, 30*4, 2, "right"), new platform(450, 30*4, 2, "right")];

var boy = new child(width/2, height-30+5);
var lives = 3;
var currFrameCount = 0;
draw = function() {
    background(255, 255, 255);
    switch(state) {
        case "Menu":
            // code
            lives = 3;
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
            // Draws the Finish zone
            fill(0, 16, 94);
            rect(0, 0, 400, 30);
            
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
            
            // Spawns the meteorites/flames and platforms
            for(var i = 0 ; i < 3; i++) {
                fireArr5[i].draw();
                fireArr5[i].move();
                fireArr3[i].draw();
                fireArr3[i].move();
                fireArr2[i].draw();
                fireArr2[i].move();
                wood11[i].draw();
                wood11[i].move();
                wood8[i].draw();
                wood8[i].move();
            }
            for(var i = 0 ; i < 4; i++) {
                wood7[i].draw();
                wood7[i].move();
                wood9[i].draw();
                wood9[i].move();
                wood10[i].draw();
                wood10[i].move();
            }
///////////////////////////////////////////////////////////////////////////////////////
            // PLACEHOLDER
            noStroke();
            fill(43, 41, 39);
            rect(0, 30*6, width, 30);
            
            stroke(0, 0, 0); // round down to 30
            for(var i = 0; i < 13; i++) {
                line(0, 30*i, width, 30*i);
            } // height-(30*12) = 40
///////////////////////////////////////////////////////////////////////////////////////
            // Display life counter at top left corner
            fill(255, 255, 255);
            textSize(25);
            text(lives, 5, 25);
            boy.draw();
            // Detect key presses and add sampling rate
            if(keyPressed && keys[UP] && (currFrameCount < (frameCount-10))) {
                currFrameCount = frameCount;
                boy.y -= 30;
            } if(keyPressed && keys[LEFT] && (currFrameCount < (frameCount-10))) {
                currFrameCount = frameCount;
                boy.x -= 30;
            } if(keyPressed && keys[RIGHT] && (currFrameCount < (frameCount-10))) {
                currFrameCount = frameCount;
                boy.x += 30;
            } if(keyPressed && keys[DOWN] && (currFrameCount < (frameCount-10))) {
                currFrameCount = frameCount;
                boy.y += 30;
            }
            // Conditions for getting hit by flames at bottom half of screen
            for(var i = 0; i < 3; i++) {
                if(boy.y >= 30*10 && boy.y <= 30*11) {
                    if(boy.x+15 >= fireArr2[i].xCenter-15 && boy.x-15 <= fireArr2[i].xCenter+40) {
                        // Reset boy's position
                        boy.x = width/2;
                        boy.y = height-30+5;
                        lives--;
                    }
                } if(boy.y >= 30*9 && boy.y <= 30*10) {
                    if(boy.x+15 >= fireArr3[i].xCenter-15 && boy.x-15 <= fireArr3[i].xCenter+40) {
                        // Reset boy's position
                        boy.x = width/2;
                        boy.y = height-30+5;
                        lives--;
                    }
                } if(boy.y >= 30*7 && boy.y <= 30*8) {
                    if(boy.x+15 >= fireArr5[i].xCenter-15 && boy.x-15 <= fireArr5[i].xCenter+40) {
                        // Reset boy's position
                        boy.x = width/2;
                        boy.y = height-30+5;
                        lives--;
                    }
                }
                
                if(lives <= 0) {
                    state = "End";
                }
            }
        break;
        
        case "End":
            fill(0, 0, 0);
            rect(0, 0, width, height);
            textSize(40);
            fill(255, 0, 0);
            text("Game Over!", width/2-100, height/2);
        break;
        
        default:
            state = "Menu";
        break;
    }
};