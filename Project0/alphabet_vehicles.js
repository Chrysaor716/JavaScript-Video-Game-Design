// Create verticies relative to top left corner of the truck
var topLeftX = 40;
var topLeftY = 30;
var h = 20; // height for top half of front of truck

var drawTruck = function() {
    stroke(0, 0, 0);
    // First quadrilateral draws the top half of front of truck
    // Quadrilateral takes verticies from top left corner, to top right, to bottom right, to bottom left
    fill(28, 62, 230);
    quad(topLeftX, topLeftY, topLeftX+50, topLeftY, topLeftX+60, topLeftY+h, topLeftX-10, topLeftY+h);
    // Second quadrilateral draws the bottom half of front of truck
    quad(topLeftX-15, topLeftY+h, topLeftX+50+15, topLeftY+h, topLeftX+50+15+10, topLeftY+h+h+10, topLeftX-15-10, topLeftY+h+h+10);
    // Draws the window of truck
    fill(201, 228, 240);
    quad(topLeftX+5, topLeftY+10, topLeftX+45, topLeftY+10, topLeftX+55, topLeftY+h, topLeftX-5, topLeftY+h);
    // Draws the headlights of truck
    fill(245, 229, 128);
    rect(topLeftX+3, topLeftY-4, 12, 4);
    rect(topLeftX+33, topLeftY-4, 12, 4);
    // Draws the attachment to trailer of truck
    fill(73, 74, 107);
    rect(topLeftX, topLeftY+h+h+10, 50, 20);
    // Draws the trailer of truck
    fill(224, 224, 224);
    rect(topLeftX-15-10, topLeftY+h+h+10+20, 100, 260);
};

// Constructor
var letterI = function() {
    this.opacity = 0; // initialize opacity to zero (transparent)
    this.sign = -3; // this variable is used for flashing the letter "i"
};

letterI.prototype.flashI = function() {
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
    rect(topLeftX, topLeftY+5, 50, 40);
    rect(topLeftX, topLeftY+80, 50, 230);
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
draw = function() {
    drawTruck();
    i.flashI();
    drawSailboat();
    drawA();
};
