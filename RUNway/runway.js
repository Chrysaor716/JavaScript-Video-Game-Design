/*
 *  Based on a 500x500 pixel canvas.
 */

frameRate(60);

// Create verticies relative to top left corner of the truck
var truckVehicle = function(topLeftX, topLeftY) {
    this.x = topLeftX;
    this.y = topLeftY;
    this.speed = 5;
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
};

truckVehicle.prototype.move = function() {
    this.y -= this.speed;
};

var truckArray = [];
var prevLane = 0;
for(var i = 0; i < 3; i++) {
    var lane = Math.floor((Math.random() * 3) + 1); // Generate a random multiplyer: 1, 2, or 3.
    var yStartPos = Math.floor((Math.random() * 900) + 90);
    // Halfway into the canvas is 250 (subtract 15 b/c it is relative to the top leftmost edge of truck)
    // Halfway between the 250th pixel and the left edge (0th pixel) is 125; right lane is at pixel 375.
    // Multiply 125 by 1, 2, or 3, to determine which lane to generate the truck in.
    var truck = new truckVehicle((125*lane)-15, yStartPos+height); // Initialize truck off the canvas
    // This ensures the trucks don't overlap each other; only push to the array if the trucks got
    //      generated onto different lanes.
    if(lane !== prevLane) {
        truckArray.push(truck);
    }
    prevLane = lane;
}

draw = function() {
    background(255, 255, 255);
    for(var i = 0; i < truckArray.length; i++) {
        truckArray[i].draw();
        truckArray[i].move();
    }
};
