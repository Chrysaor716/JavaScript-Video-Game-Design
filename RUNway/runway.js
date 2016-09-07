/*
 *  Based on a 500x500 pixel canvas.
 *  Via link: https://www.khanacademy.org/computer-programming/runway/5355173884854272?width=500&height=500
 */

frameRate(60);
// Create verticies relative to top left corner of the truck
var truckVehicle = function() {
    var lane = Math.floor((Math.random() * 3) + 1); // Generate a random multiplyer: 1, 2, or 3. This is the starting xPos.
    var yStartPos = Math.floor((Math.random() * 1000) + 90);
    // Halfway into the canvas is 250 (subtract 15 b/c it is relative to the top leftmost edge of truck)
    // Halfway between the 250th pixel and the left edge (0th pixel) is 125; right lane is at pixel 375.
    // Multiply 125 by 1, 2, or 3, to determine which lane to generate the truck in.
    this.x = (125*lane)-15;
    this.y = yStartPos+height;
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
}; // Total truck length = 298 pixels ~= 300 pixels

truckVehicle.prototype.move = function() {
    this.y -= this.speed;
    if(this.y < -1000) {
        this.y = height;
        var lane = Math.floor((Math.random() * 3) + 1); // Generate a random multiplyer: 1, 2, or 3. This is the starting xPos.
        this.x = (125*lane)-15;
    }
};

var truckArray = [];
for(var i = 0; i < 3; i++) {
    var truck = new truckVehicle();
    truckArray.push(truck);
}
var prevLane = 0;

draw = function() {
    background(255, 255, 255);

    for(var i = 0; i < truckArray.length; i++) {
        if(truckArray[i].x !== prevLane) {
            truckArray[i].draw();
            truckArray[i].move();
        }
        prevLane = truckArray[i].x; // Ensures the truck initialized on the same lane doesn't overlap each other
    }
};
