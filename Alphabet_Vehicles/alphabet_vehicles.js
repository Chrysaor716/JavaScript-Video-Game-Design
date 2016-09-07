// Create verticies relative to top left corner of the truck
var truckVehicle = function(topLeftX, topLeftY) {
    this.x = topLeftX;
    this.y = topLeftY;
    this.h = 20; // height for top half of front of truck
};

truckVehicle.prototype.move = function() {
    if(this.y <= 20) {
        this.y = 20;
    }
    this.y -= 3;
    stroke(0, 0, 0);
    // First quadrilateral draws the top half of front of truck
    // Quadrilateral takes verticies from top left corner, to top right, to bottom right, to bottom left
    fill(28, 62, 230);
    quad(this.x, this.y, this.x+50, this.y, this.x+60, this.y+this.h, this.x-10, this.y+this.h);
    // Second quadrilateral draws the bottom half of front of truck
    quad(this.x-15, this.y+this.h, this.x+65, this.y+this.h, this.x+75, this.y+this.h+this.h+10, this.x-25, this.y+this.h+this.h+10);
    // Draws the window of truck
    fill(201, 228, 240);
    quad(this.x+5, this.y+10, this.x+45, this.y+10, this.x+55, this.y+this.h, this.x-5, this.y+this.h);
    // Draws the headlights of truck
    fill(245, 229, 128);
    rect(this.x+3, this.y-4, 12, 4);
    rect(this.x+33, this.y-4, 12, 4);
    // Draws the attachment to trailer of truck
    fill(73, 74, 107);
    rect(this.x, this.y+this.h+this.h+10, 50, 20);
    // Draws the trailer of truck
    fill(224, 224, 224);
    rect(this.x-15-10, this.y+this.h+this.h+10+20, 100, 260);
};

// Constructor
var letterI = function() {
    this.opacity = 0; // initialize opacity to zero (transparent)
    this.sign = -3; // this variable is used for flashing the letter "i"
};

letterI.prototype.flash = function() {
    noStroke();
    // The below "if/else if" toggles opacity for flashing effect
    if(this.opacity >= 300) { // set a cap/threshold for opacity
        this.opacity = 300;
        this.sign *= -1; // toggle
    } else if (this.opacity <= 0) { // reverse opacity; toggle
        this.opacity = 0;
        this.sign *= -1;
    }
    this.opacity += this.sign;
    fill(0, 196, 255, this.opacity);
    rect(40, 25, 50, 40);
    rect(40, 105, 50, 230);
};

//////////////////////////////////////////////////////////////////////////////

// Create verticies relative to top left corner of the truck
var poleX = 230;
var poleTopY = 50;
var poleLength = 230;

var drawSailboat = function() {
    // Draws the rod/pole to hold the flag of the sailboat
    stroke(138, 138, 138);
    strokeWeight(8);
    line(poleX, poleTopY, poleX, poleTopY+poleLength);
    // Draws a shiny reflection across the pole to add lighting
    stroke(207, 207, 207);
    strokeWeight(3);
    line(poleX-2, poleTopY, poleX-2, poleTopY+poleLength);
    // Draws the right flag of the sailboat
    stroke(0, 0, 0);
    strokeWeight(1);
    fill(255, 255, 255);
    triangle(poleX+3, poleTopY, poleX+3, poleTopY+poleLength-15, 390, poleTopY+poleLength-15);
    // Draws the left flag of the sailboat
    fill(255, 255, 255, 0); // make the fill of the arc completely transparent so that the color doesn't overlap the pole (only show outlines of arc)
    arc(poleX+3, poleTopY+(poleLength/2), 40, poleTopY+poleLength-50, 110, 250);
    arc(poleX+45, poleTopY+(poleLength-43), 300, poleTopY+poleLength+100, 170, 250);
    arc(poleX+37, poleTopY+(poleLength+15), 295, poleTopY+poleLength-150, 200, 250);
    // Draws the boat
    noStroke();
    fill(125, 90, 0);
    arc(poleX+30, poleTopY+poleLength, 250, 160, 0, 180);
};

var drawA = function() {
    // The letter "A" on the right flag
    fill(240, 39, 39);
    rect(poleX+12, poleTopY+50, 20, poleLength-75);
    quad(poleX+12, poleTopY+50, poleX+32, poleTopY+50, poleX+145, poleTopY+50+(poleLength-75), poleX+120,  poleTopY+50+(poleLength-75));
    quad(poleX+12, poleTopY+145, poleX+32, poleTopY+125+40, poleX+110, poleTopY+125+40, poleX+80, poleTopY+145);
};

var i = new letterI();
var truck = new truckVehicle(40, 410); // Initialize truck off the canvas
draw = function() {
    background(255, 255, 255);
    truck.move();
    i.flash();
    drawSailboat();
    drawA();
};
