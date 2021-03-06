/*
 *  Based on a 500x700 pixel canvas.
 *  Via link: https://www.khanacademy.org/computer-programming/runway/5355173884854272?width=500&height=700
 */
frameRate(60);

// State machien variable for game
var state = "Menu";

// Create verticies relative to top left corner of the truck
var truckVehicle = function(lane) {
    var yStartPos = Math.floor((Math.random() * 1000) + 90); // Generate random starting y position
    this.y = yStartPos+height;
    this.speed = 3; // vary from 3 to 9
    this.x = lane;
};

// Draws a single truck
truckVehicle.prototype.draw = function() {
    stroke(0, 0, 0);
    // First quadrilateral draws the top half of front of truck
    // Quadrilateral takes verticies from top left corner, to top right, to bottom right, to bottom left
    fill(28, 62, 230);
    quad(this.x, this.y, this.x+30, this.y, this.x+40, this.y+10, this.x-10, this.y+10);
    // Second quadrilateral draws the bottom half of front of truck
    quad(this.x-15, this.y+10, this.x+45, this.y+10, this.x+55, this.y+30, this.x-25, this.y+30);
    // Draws the window of truck
    fill(201, 228, 240);
    quad(this.x, this.y+15, this.x+30, this.y+15, this.x+45, this.y+29, this.x-15, this.y+29);
    // Draws the headlights of truck
    fill(245, 229, 128);
    rect(this.x+2, this.y-4, 7, 4);
    rect(this.x+20, this.y-4, 7, 4);
    // Draws the attachment to trailer of truck
    fill(73, 74, 107);
    rect(this.x-13, this.y+30, 55, 15);
    // Draws the trailer of truck
    fill(224, 224, 224);
    rect(this.x-30, this.y+45, 90, 210);
}; // Total truck length = 298 pixels ~= 300 pixels

truckVehicle.prototype.move = function() {
    this.y -= this.speed;
    if(this.y < -450) {
        this.y = height + Math.floor((Math.random() * 1000) + 0); // Generate random starting y position for next wave
        this.speed = Math.floor((Math.random() * 10) + 3); // Spawn at a random speed
    }
};

var keys = []; // Detect key multiple presses
var keyPressed = function() { 
    keys[keyCode] = true;
};
var keyReleased = function() { 
    keys[keyCode] = false; 
};

// Create the letter "i" based on the top left corner
var letterI = function(topLeftX, HP) {
    this.x = topLeftX;
    this.health = HP; // Number of lives for this character
};
letterI.prototype.draw = function() {
    noStroke();
    fill(108, 235, 227);
    rect(this.x, 100, 20, 20);
    rect(this.x, 100+30, 20, 60);
    // Draw the number of lives above the letter
    fill(0, 0, 255);
    textSize(18);
    text(this.health, this.x+5, 95);
}; // total length of the letter "i" = 90 pixels
letterI.prototype.move = function(lane) {
    this.x = lane;
};
var eye = new letterI(125-10, 9); // initialize "i" to the middle of the left lane

// Detect mouse click on Menu screen at the beginning
// Determine selection based on click location on screen
var timer = 60; // default
mouseClicked = function() {
    // Mouse click processing for choosing start time for game inside Menu
    if(mouseX >= (width/2)-180 && mouseX <= (width/2)-180+130 &&
       mouseY >= height-170 && mouseY <= height-170+60 && state === "Menu") {
           timer = 30;
           eye.health = 20;
           state = "Game";
    }
    if(mouseX >= (width/2)+50 && mouseX <= (width/2)+50+130 &&
       mouseY >= height-170 && mouseY <= height-170+60 && state === "Menu") {
           timer = 60;
           eye.health = 35;
           state = "Game";
    }
};

var truckArray = [];
var secondWave = [];
for(var i = 1; i < 4; i++) { // Generate trucks on each lane
    // Halfway into the canvas is 250 (subtract 15 b/c it is relative to the top leftmost edge of truck)
    // Halfway between the 250th pixel and the left edge (0th pixel) is 125; right lane is at pixel 375.
    // Multiply 125 by 1, 2, or 3, to determine which lane to generate the truck in.
    var truck = new truckVehicle(125*i-15);
    truckArray.push(truck);
    var nextTruck = new truckVehicle(125*i-15);
    secondWave.push(nextTruck);
}

var counter = 0; // score count
draw = function() {
    background(0, 0, 0);
    switch(state) {
        case "Menu": // Explains the rules and a means of entry to the game
            counter = 0; // reset score
            fill(213, 217, 7);
            textSize(40);
            text("Runway", 180, 50);
            fill(255, 255, 255);
            textSize(20);
            text("There will be 3 lanes in which trucks will drive\n" +
                 "up the screen. At the top are 3 garage doors\n" +
                 "to open, using the LEFT, UP, and RIGHT arrow\n" +
                 "keys.\n\nYour goal is to open these doors at the right time.\n" +
                 "Any time a truck passes through the garage and\n" +
                 "the door isn't open, points will be deducted. If\n" +
                 "the door is open while there aren't any trucks\n" +
                 "passing through, points are also deducted. So\n" +
                 "don't just hold those doors open the whole game!\n\n" +
                 "Points are earned only when the garage door is\n" +
                 "open while a truck is passing through it!\n\n" +
                 "Score as high as possible before the time runs\n" +
                 "out!", 40, 80);
            fill(17, 0, 255);
            textSize(30);
            text("Choose time", width/2-85, height-210);
            textSize(17);
            text("Click!", (width/2)-20, height-190);
            // Add 30 second mode button
            stroke(17, 142, 153);
            strokeWeight(5);
            fill(0, 13, 252);
            rect((width/2)-180, height-170, 130, 60);
            noStroke();
            fill(255, 255, 255);
            ellipse((width/2-82), (height-156), 40, 10);
            ellipse((width/2-66), (height-151), 10, 15);
            fill(0, 0, 0);
            textSize(20);
            text("30 seconds", (width/2)-165, height-130);
            // Add 1 minute mode button
            stroke(17, 142, 153);
            strokeWeight(5);
            fill(0, 13, 252);
            rect((width/2)+50, height-170, 130, 60);
            noStroke();
            fill(255, 255, 255);
            ellipse((width/2+148), (height-156), 40, 10);
            ellipse((width/2+164), (height-151), 10, 15);
            fill(0, 0, 0);
            textSize(20);
            text("60 seconds", (width/2)+66, height-130);
            // Information about the "i" character
            fill(255, 255, 255);
            textSize(15);
            text("There's a catch! The character \"i\" hovers over the lanes. Use\n" +
                 "your mouse to control its position. As the character, you need to\n" +
                 "dodge the incoming trucks! Game is over before the timer if its\n" +
                 "life runs out first!", 40, height-80);
        break;
        
        case "Game":
            eye.draw();
            // Draws the garage background
            noStroke();
            fill(180, 180, 180);
            rect(0, 0, width, 50);
            stroke(0, 0, 0);
            strokeWeight(1);
    
            if(keyIsPressed && keys[LEFT]) {
                fill(0, 0, 0); // Variable transparency to mimic garage door open
                quad(125-61, 0, 125+61, 0, 125+47, 50, 125-47, 50);
            } if(keyIsPressed && keys[UP]) {
                fill(0, 0, 0);
                quad(250-61, 0, 250+61, 0, 250+47, 50, 250-47, 50);
            } if(keyIsPressed && keys[RIGHT]) {
                fill(0, 0, 0);
                quad(375-61, 0, 375+61, 0, 375+47, 50, 375-47, 50);
            }
            
            // Draw the lines separating the lanes on the road
            for(var i = 0; i < 4; i++) {
                noStroke();
                fill(242, 255, 0);
                rect(125*i+55, 50, 13, 60);
                rect(125*i+55, 50 + 130, 13, 60);
                rect(125*i+55, 50 + (130*2), 13, 60);
                rect(125*i+55, 50 + (130*3), 13, 60);
                rect(125*i+55, 50 + (130*4), 13, 60);
            }
            for(var i = 0; i < truckArray.length; i++) {
                // Draws and detects overlapping of trucks on the character "i"
                if(mouseX >= 0 && mouseX <= 185) { // If the mouse is in the left lane, move "i" to left lane
                                                   // 185 is ~halfway between the mid-left lane and the mid-middle lane
                    if(truckArray[i].x === 125-15) { // if trucks are in left lane
                        if(truckArray[i].y >= 100 && truckArray[i].y <= 190) { // if truck collides with "i"
                            // Collision! Deduct the number of lives
                            eye.health--;
                        }
                    }
                    eye.move(125-10);
                    eye.draw();
                } if(mouseX >= 186 && mouseX <= 312) {
                    if(truckArray[i].x === 250-15) { // if trucks are in left lane
                        if(truckArray[i].y >= 100 && truckArray[i].y <= 190) { // if truck collides with "i"
                            // Collision! Deduct the number of lives
                            eye.health--;
                        }
                    }
                    eye.move(250-10); // moves "i" to middle lane if the mouse is hovering over the middle lane
                    eye.draw();
                } if(mouseX >= 313 && mouseX <= width) {
                    if(truckArray[i].x === 375-15) { // if trucks are in left lane
                        if(truckArray[i].y >= 100 && truckArray[i].y <= 190) { // if truck collides with "i"
                            // Collision! Deduct the number of lives
                            eye.health--;
                        }
                    }
                    eye.move(375-10);
                    eye.draw();
                }
                
                truckArray[i].draw();
                truckArray[i].move();
                if(abs(truckArray[i].y-secondWave[i].y) < 500) { // if truck tailgates or is within overlapping distance
                    secondWave[i].y = truckArray[i].y + 600; // increase the distance between the two trucks (in the same lane)
                    secondWave[i].draw();
                    secondWave[i].move();
                }
                // Conditions for points/counter
                // If a truck passes through while garage door is opened, player earns points.
                if((truckArray[i].y <= 50 && truckArray[i].y+300 >= 50) || 
                    (secondWave[i].y <= 50 && secondWave[i].y+300 >= 50)) { // If truck in either wave passes through garage
                    // Add to counter if garage door is opened during pass
                    if(keyIsPressed && ((keys[LEFT] && truckArray[i].x === 125-15) ||   // left key is pressed & truck is in left lane
                                        (keys[UP] && truckArray[i].x === 250-15) ||     // up key is pressed & truck is in middle lane
                                        (keys[RIGHT] && truckArray[i].x === 375-15))) { // right key is pressed & truck is in right lane
                        counter += 5;
                        // Provide visual feedback
                        noStroke();
                        fill(0, 255, 0, 150);
                        if(keys[LEFT]  && truckArray[i].x === 125-15) {
                            quad(125-47, 50, 125+47, 50, 125+70, height, 125-70, height);
                        } if(keys[UP] && truckArray[i].x === 250-15) {
                            quad(250-47, 50, 250+47, 50, 250+70, height, 250-70, height);
                        } if(keys[RIGHT] && truckArray[i].x === 375-15) {
                            quad(375-47, 50, 375+47, 50, 375+70, height, 375-70, height);
                        }
                    }
                    // Consequently, if a truck is passing through garage and door isn't opened, deduct points.
                    if((!keys[LEFT] && truckArray[i].x === 125-15) ||
                        (!keys[UP] && truckArray[i].x === 250-15) ||
                        (!keys[RIGHT] && truckArray[i].x === 375-15)) {
                        counter -= 5;
                    }
                }
                // If a key is pressed down while no trucks are passing through, deduct points.
                if(!(truckArray[i].y <= 50 && truckArray[i].y+300 >= 50) || 
                   !(secondWave[i].y <= 50 && secondWave[i].y+300 >= 50)) {
                       if(keyIsPressed && ((keys[LEFT] && truckArray[i].x === 125-15) ||
                                          (keys[UP] && truckArray[i].x === 250-15) ||
                                          (keys[RIGHT] && truckArray[i].x === 375-15))) {
                            counter--;
                            // Provide visual feedback
                            noStroke();
                            fill(255, 0, 0, 80);
                            if(keys[LEFT] && truckArray[i].x === 125-15) {
                                quad(125-47, 50, 125+47, 50, 125+70, height, 125-70, height);
                            } if(keys[UP] && truckArray[i].x === 250-15) {
                                quad(250-47, 50, 250+47, 50, 250+70, height, 250-70, height);
                            } if(keys[RIGHT] && truckArray[i].x === 375-15) {
                                quad(375-47, 50, 375+47, 50, 375+70, height, 375-70, height);
                            }
                        }
                }
            }
            // If no keys are pressed, redraw garage background to overlap the passing trucks
            if(!keyIsPressed) {
                // Draws the garage background
                noStroke();
                fill(180, 180, 180);
                rect(0, 0, width, 50);
                // Overlap garage color with which keys to press
                fill(107, 107, 107);
                rect(115, 25-7, 40, 14);
                triangle(80, 25, 120, 10, 120, 40);
                rect(250-7, 10, 14, 40);
                triangle(250, 0, 250-20, 25, 250+20, 25);
                rect(340, 25-7, 40, 14);
                triangle(380, 10, 420, 25, 380, 40);
            }
            
            fill(0, 0, 0);
            textSize(20);
            text(counter, 5, 40);
            if(frameCount%60 === 0) { // Decrement timer (in seconds) based on frame rate
                timer--;
            } if(timer < 10) { // If timer is in the single digits, append the second count with a leading zero
                text("0:0" + timer, width-50, 40);
            } if(timer >= 10) {
                text("0:" + timer, width-50, 40);
            }
            if(timer <= 0 || eye.health <= 0) {
                state = "End";
            }
        break;
        
        case "End":
            fill(255, 0, 0);
            textSize(50);
            text("Game over!", width/2-130, height/2-100);
            fill(255, 255, 255);
            textSize(25);
            text("Score: " + counter, width/2-70, height/2-50);
            textSize(35);
            text("Start over?", width/2-85, height/2+15);
            textSize(20);
            text("Press", width/2-30, height/2+40);
            // Draw button
            noStroke();
            fill(43, 119, 201);
            rect(width/2-100, height/2+50, 200, 100);
            // Draws button shadow
            stroke(0, 48, 120);
            strokeWeight(8);
            line(width/2-100+200, height/2+54, width/2-100+200, height/2+50+95);
            line(width/2-96, height/2+50+97, width/2-100+197, height/2+50+97);
            stroke(255, 255, 255);
            // Draws button shine
            strokeWeight(4);
            line(width/2-90, height/2+60, width/2+80, height/2+60);
            line(width/2-90, height/2+60, width/2-90, height/2+130);
            // Draws text inside button
            fill(0, 0, 0);
            textSize(50);
            text("Enter", width/2-60, height/2+115);
            if(keyIsPressed && keys[ENTER]) {
                state = "Menu";
            }
        break;
        
        default:
            state = "Menu";
        break;
    }
};