/*
 *  Based on a 500x700 pixel canvas.
 *  Via link: https://www.khanacademy.org/computer-programming/runway/5355173884854272?width=500&height=700
 */

frameRate(60);
// Create verticies relative to top left corner of the truck
var truckVehicle = function(lane) {
    var yStartPos = Math.floor((Math.random() * 1000) + 90); // Generate random starting y position
    this.y = yStartPos+height;
    this.speed = 5;
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

draw = function() {
    background(0, 0, 0);
    // Draws the garage background
    noStroke();
    fill(180, 180, 180);
    rect(0, 0, width, 50);
    stroke(0, 0, 0);
    
    // Draws the garage doors for trucks to pass through based on key presses
    if(keyIsPressed && keyCode === LEFT) {
        fill(0, 0, 0); // Variable transparency to mimic garage door open
        quad(125-61, 0, 125+61, 0, 125+47, 50, 125-47, 50);
    } if(keyIsPressed && keyCode === UP) {
        fill(0, 0, 0);
        quad(250-61, 0, 250+61, 0, 250+47, 50, 250-47, 50);
    } if(keyIsPressed && keyCode === RIGHT) {
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
            truckArray[i].draw();
            truckArray[i].move();
            if(abs(truckArray[i].y-secondWave[i].y) > 500) {
                secondWave[i].draw();
                secondWave[i].move();
            }
    }
    // If no keys are pressed, redraw garage background to overlap the passing trucks
    if(!keyIsPressed) {
        // Draws the garage background
        noStroke();
        fill(180, 180, 180);
        rect(0, 0, width, 50);
        stroke(0, 0, 0);
    }
};