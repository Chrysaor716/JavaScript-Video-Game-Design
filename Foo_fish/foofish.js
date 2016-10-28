angleMode = "radians";
/*
 *  Subdivision implementation to draw smooth, arbitrary shapes
 */
//---------------------------------------------------------------------------------//
// The number of splits; double number of points per iteration
//      Larger iterations make smoother shapes
var iterations = 0;
// Creates new points between existing points; double the number of points
var splitPoints = function(me) {
    me.p2.splice(0, me.p2.length); // removes all the indicies starting from index 0; reset
    for(var i = 0; i < me.pointsArr.length - 1; i++) {
        // the original current coordinate
        me.p2.push(new PVector(me.pointsArr[i].x, me.pointsArr[i].y));
        // halfway between the current and next coordinate
        me.p2.push(new PVector((me.pointsArr[i].x + me.pointsArr[i+1].x)/2, (me.pointsArr[i].y + me.pointsArr[i+1].y)/2));
    }
    // Push the last cordinate and the halfway point between that and the first coordinate
    me.p2.push(new PVector(me.pointsArr[i].x, me.pointsArr[i].y));
    me.p2.push(new PVector((me.pointsArr[0].x + me.pointsArr[i].x)/2, (me.pointsArr[0].y + me.pointsArr[i].y)/2));
};
// Moves each point "forward" along the shape to the halfway
//      point between its current point and the next point
var average = function(me) {
    for(var i = 0; i < me.p2.length - 1; i++) {
        var x = (me.p2[i].x + me.p2[i+1].x)/2;
        var y = (me.p2[i].y + me.p2[i+1].y)/2;
        me.p2[i].set(x, y);
    }
    // Move last point "forward" up to halfway between it and the first point
    var x = (me.p2[i].x + me.pointsArr[0].x)/2;
    var y = (me.p2[i].y + me.pointsArr[0].y)/2;
    me.pointsArr.splice(0, me.pointsArr.length); // clear the points array
    // Replace the points array with the newly doubled array
    for(i = 0; i < me.p2.length; i++) {
        me.pointsArr.push(new PVector(me.p2[i].x, me.p2[i].y));
    }
};
// A single division/split of points along shape
//      The number of divisions is controlled by the global "iterations" variable
var subdivide = function(me) {
    splitPoints(me);
    average(me);
};
//---------------------------------------------------------------------------------//
/*
 *  Draws arbitrarily shaped fishes from the subdivision algorithm & animates their
 *      tail using bezier
 */
var fishObj = function(x, y) {
    this.position = new PVector(x, y); // intesection point between body and tail
    this.facing = random(-50, 50); // negative val = facing right, positive = left

    this.pointsArr = [];
    this.p2 = []; // the doubled array for the points array, when split

    // Colors
    this.rRand = random(0, 255);
    this.gRand = random(0, 255);
    this.bRand = random(0, 255);
    // this.fishColor = color(this.rRand, this.gRand, this.bRand, random(200, 255));
    this.fishColor = color(this.rRand, this.gRand, this.bRand);
    // Re-randomize
    this.rRand = random(0, 255);
    this.gRand = random(0, 255);
    this.bRand = random(0, 255);
    this.tailOutline = color(this.rRand, this.gRand, this.bRand, random(200, 255));

    this.tailSize = random(20, 40);
    this.tailLength = random(30, 50);
    this.baseX = 0;
    this.baseY = 0; // point that the tail branches off the body of fish
    // Bezier variables
    this.x1 = 0;
    this.y1 = 0;
    this.cx1 = 0;
    this.cy1 = 0;
    this.cx2 = 0;
    this.cy2 = 0;
    this.x2 = 0;
    this.y2 = 0;

    this.cx1Dir = random(-1, 1);
    this.cx2Dir = random(-1, 1);
    // Re-generate random number for x deltas (of fish tails) until non-zero
    //      We want the middle two points on the Bezier curve to move
    //      horizontally always (non-zero).
    while(this.cx1Dir === 0 || this.cx2Dir === 0) {
        this.cx1Dir = random(-1, 1);
        this.cx2Dir = random(-1, 1);
    }
    this.xDeltaMin1 = random(25, 45);
    this.xDeltaMin2 = random(25, 45);
    this.xDeltaMax1 = random(50, 80);
    this.xDeltaMax2 = random(50, 80);
};
fishObj.prototype.randomize = function() {
    pushMatrix();
    translate(this.position.x, this.position.y);

    this.pointsArr.push(new PVector(0, 0)); // push origin point
    var midX = random(30, 90);
    var deltaX = random(30, 90);
    var midY = random(20, 60);
    this.baseX = midX+random(10, 30);
    if(this.facing >= 0) { // facing left
        this.pointsArr.push(new PVector(midX, midY));
        // push top and bottom
        this.pointsArr.push(new PVector(midX + deltaX, 0));
        this.pointsArr.push(new PVector(midX, -midY));
    } else { // facing right
        this.pointsArr.push(new PVector(-midX, midY));
        // push top and bottom
        this.pointsArr.push(new PVector(-midX -deltaX, 0));
        this.pointsArr.push(new PVector(-midX, -midY));
    }
    // this.pointsArr.push(new PVector(0, 0)); // push origin point again to complete the shape
/////////////////////////////////////////////////////////////////////////////////////
// Draws ellipses at points for testing
// for(var i = 0; i < this.pointsArr.length; i++) {
//     fill(255, 0, 0, 150);
//     ellipse(this.pointsArr[i].x, this.pointsArr[i].y, 10, 10);
//     fill(0, 0, 0);
//     textSize(10);
//     text(i, this.pointsArr[i].x-3, this.pointsArr[i].y-5);
// }
/////////////////////////////////////////////////////////////////////////////////////

    // Initialize Bezier variables
    if(this.facing >= 0) { // facing left
        this.x1 = this.baseX+this.tailLength;
        this.cx1 = this.x1 + 35;
        this.cx2 = this.cx1;
    } else {
        this.x1 = -this.baseX-this.tailLength;
        this.cx1 = this.x1 - 35;
        this.cx2 = this.cx1;
    }
    this.y1 = -this.tailSize;
    this.cy1 = -this.tailSize;
    this.cy2 = this.tailSize;
    this.x2 = this.x1;
    this.y2 = this.tailSize;

    popMatrix();
};
fishObj.prototype.draw = function() {
    pushMatrix();
    translate(this.position.x, this.position.y);

    if(iterations < 10) {
        subdivide(this);
        iterations++;
    }

    noStroke();
    fill(this.fishColor);

    beginShape();
    for(var i = 0; i < this.pointsArr.length; i++) {
        // vertex(this.pointsArr[i].x, this.pointsArr[i].y);
        curveVertex(this.pointsArr[i].x, this.pointsArr[i].y);
    }
    curveVertex(this.pointsArr[0].x, this.pointsArr[0].y);
    // vertex(this.pointsArr[0].x, this.pointsArr[0].y);
    endShape();

    // Draws tail
    if(this.facing >= 0) { // facing left
        // Draw base of tail
        triangle(this.baseX+1, 0, this.baseX+this.tailLength+1, -this.tailSize,
                 this.baseX+this.tailLength+1, this.tailSize);
        // Animate end of tail using bezier
        //
    } else {
        triangle(-this.baseX-1, 0, -this.baseX-this.tailLength-1, -this.tailSize,
                 -this.baseX-this.tailLength-1, this.tailSize);
    }
    // Animate end of tail using bezier
    strokeWeight(3);
    stroke(this.tailOutline);
    bezier(this.x1, this.y1, this.cx1, this.cy1, this.cx2, this.cy2, this.x2, this.y2);
    this.cx1 += this.cx1Dir;
    this.cx2 += this.cx2Dir;
    if(this.facing >= 0) {
        // Sets threshold xPos deltas for the tail
        if((this.cx1 < this.x1-this.xDeltaMin1) || (this.cx1 > this.x1+this.xDeltaMax1)) {
            this.cx1Dir = -this.cx1Dir;
        }
        if((this.cx2 < this.x2-this.xDeltaMin2) || (this.cx2 > this.x2+this.xDeltaMax2)) {
            this.cx2Dir = -this.cx2Dir;
        }
    } else {
        if((this.cx1 > this.x1+this.xDeltaMin1) || (this.cx1 < this.x1-this.xDeltaMax1)) {
            this.cx1Dir = -this.cx1Dir;
        }
        if((this.cx2 > this.x2+this.xDeltaMin2) || (this.cx2 < this.x2-this.xDeltaMax2)) {
            this.cx2Dir = -this.cx2Dir;
        }
    }

    // Draws the eyes
    var xEye;
    if(this.facing >= 0) { // facing left
        xEye = (this.pointsArr[1].x + this.pointsArr[2].x) / 2;
    } else { // facing right
        xEye = (this.pointsArr[1].x + this.pointsArr[2].x) / 2;
    }
    fill(0, 0, 0);
    ellipse(xEye, -5, 10, 10);

    popMatrix();
};
fishObj.prototype.move = function() {
    if(this.facing >= 0) { // facing left
        this.position.x -= random(0, 0.7);
        if(this.position.x <= -150) {
            this.position.x = 500;
        }
    } else {
        this.position.x += random(0, 0.7);
        if(this.position.x >= 550) {
            this.position.x = -100;
        }
    }
    // Random vertical movement
    // this.position.y += random(-0.7, 0.7);
};
var fishArr = [];
// Randomize fishes arbitrarily between 1 and 5
for(var i = 0; i < Math.floor(Math.random()*6) + 1; i++) {
    // var fishArr = [new fishObj(350, 350), new fishObj(width/2, height/2)];
    fishArr.push(new fishObj(random(100, 300), random(100, 300)));
}
for(var i = 0; i < fishArr.length; i++) {
    fishArr[i].randomize();
}

var seaweedObj = function(x, y) {
    this.position = new PVector(x, y);

    // Bezier variables
    // Start with bottom of curve; base
    this.x2 = 0;
    this.y2 = 0;
    this.cx2 = random(-40, 40); // Go upwards
    this.cy2 = this.y2 + random(-25, -60);
    this.cx1 = random(-40, 40);
    this.cy1 = this.cy2 + random(-25, -60);
    this.x1 = random(-40, 40);
    this.y1 = this.cy1 + random(-25, -60);

    this.cx1Dir = random(-1, 1);
    this.cx2Dir = random(-1, 1);
    this.x1Dir = random(-1, 1);
    // Re-generate while non-zero
    while(this.cx1Dir === 0 || this.cx2Dir === 0 || this.x1Dir === 0) {
        this.cx1Dir = random(-1, 1);
        this.cx2Dir = random(-1, 1);
        this.x1Dir = random(-1, 1);
    }
    this.xDeltaMax = random(50, 60);

    // Seaweed can be in bundles (this draws up to 2 extra)
    this.numSeaweed = Math.floor(Math.random()*3) + 0;
};
seaweedObj.prototype.draw = function() {
    pushMatrix();
    translate(this.position.x, this.position.y);

    strokeWeight(2);
    stroke(0, 89, 0);
    fill(43, 128, 36);

    bezier(this.x1, this.y1, this.cx1, this.cy1, this.cx2, this.cy2, this.x2, this.y2);
    // Draws opposite half of seaweed
    bezier(this.x1, this.y1, -this.cx1, this.cy1, -this.cx2, this.cy2, this.x2, this.y2);
    this.cx1 += this.cx1Dir;
    this.cx2 += this.cx2Dir;
    this.x1 += this.x1Dir;
    // Sets threshold x distance changes
    if((this.cx1 < this.x2-this.xDeltaMax) || (this.cx1 > this.x2+this.xDeltaMax)) {
        this.cx1Dir = -this.cx1Dir;
    }
    if((this.cx2 < this.x2-this.xDeltaMax) || (this.cx2 > this.x2+this.xDeltaMax)) {
        this.cx2Dir = -this.cx2Dir;
    }
    if((this.x1 < this.x2-this.xDeltaMax) || (this.x1 > this.x2+this.xDeltaMax)) {
        this.x1Dir = -this.x1Dir;
    }
    for(var div = 1; div <= this.numSeaweed; div++) {
        bezier(this.x1/(div+1), this.y1, this.cx1/(div+1), this.cy1,
           this.cx2/(div+1), this.cy2, this.x2/(div+1), this.y2); // Draws another seaweed
    }

    fill(44, 99, 17);

    popMatrix();
};
var seaweedArr = [];
for(var i = 0 ; i < Math.floor(Math.random()*6) + 1; i++) {
    seaweedArr.push(new seaweedObj(random(40, 360), random(40, 420)));
}

//---------------------------------------------------------------------------------//
/*
 *  Draws bubbles
 */
//---------------------------------------------------------------------------------//
// Basic bubbles overlaying fishes under the sea
var regularBubbleObj = function(x, y) {
    this.position = new PVector(x, y);
    this.size = random(15, 80);

    this.shinePos = this.size / 6;
    this.shineSize = this.size/4;
};
regularBubbleObj.prototype.draw = function() {
    pushMatrix();
    translate(this.position.x, this.position.y);

    noStroke();
    fill(255, 255, 255, 180);
    ellipse(0, 0, this.size, this.size);
    ellipse(this.shinePos, -this.shinePos, this.shineSize, this.shineSize);

    popMatrix();
};
regularBubbleObj.prototype.move = function() {
    this.position.y -= random(0, 0.7);
    this.position.x += random(-0.25, 0.25);
};
var regBubbleArr = [];
for(var i = 0; i < Math.floor(Math.random()*20) + 10; i++) {
    regBubbleArr.push(new regularBubbleObj(random(10, 390), random(10, 390)));
}

// Bursting particle bubbles upon mouse click
var burstObj = function() {
    this.position = new PVector(0, 0);
    this.direction = new PVector(0, 0);
    this.size = random(1, 10);
    this.timer = random(50, 130); // countdown to "pop" bubbles
};
burstObj.prototype.draw = function() {
    noStroke();
    fill(random(240, 255), random(240, 255), random(240, 255), random(100, 255));
    ellipse(this.position.x, this.position.y, this.size, this.size);
    this.position.x += this.direction.y*cos(this.direction.x)/2;
    this.position.y += this.direction.y*sin(this.direction.x)/2;
    this.timer--;
};
// Creates an array of paricle bundles
var particleBundles = function(x, y) {
    this.burstArr = [];
    for(var i = 0; i < Math.floor(random(50, 130)); i++) {
        this.burstArr.push(new burstObj()); // pushes individual particles into array
    }
    // Set particle starting position
    for(var i = 0; i < this.burstArr.length; i++) {
        this.burstArr[i].position.set(x, y); // burst from mouse position
    }
};
particleBundles.prototype.draw = function() {
    for(var i = 0; i < this.burstArr.length; i++) {
        // burst in random upwards directions (x)
        //      in N range of magnitudes (y)
        this.burstArr[i].direction.set(random(-Math.PI/4, -3*Math.PI/4), random(0, 9));
        this.burstArr[i].draw();
        // After arbitrary times for each particle/bubble, pop
        if(this.burstArr[i].timer <= 0) {
            this.burstArr.splice(i, 1);
        }
    }
};
var bundleArr = [];

mouseClicked = function() {
    bundleArr.push(new particleBundles(mouseX, mouseY));
};
//---------------------------------------------------------------------------------//
draw = function() {
    background(16, 104, 166, 200);
    // Draws ~half of the fishes first
    for(var i = 0; i < Math.floor(fishArr.length/2); i++) {
        fishArr[i].draw();
        fishArr[i].move();
    }
    // Do the same for drawing seaweed
    for(var i = 0; i < Math.floor(seaweedArr.length/2); i++) {
        seaweedArr[i].draw();
    }
    for(var i = 0; i < regBubbleArr.length; i++) {
        regBubbleArr[i].draw();
        regBubbleArr[i].move();
        // Delete bubble from array once it gets past the top of the canvas limit
        if(regBubbleArr[i].position.y < -100) {
            regBubbleArr.splice(i, 1);
        }
    }

    // Draws remaining ~half of fishes (so some could be in front of bubbles and seaweed)
    for(var i = Math.floor(fishArr.length/2); i < fishArr.length; i++) {
        fishArr[i].draw();
        fishArr[i].move();
    }
    for(var i = Math.floor(seaweedArr.length/2); i < seaweedArr.length; i++) {
        seaweedArr[i].draw();
    }

    // Occassionally spawn new bubbles beyond the bottom of the screen
    if(frameCount % (Math.floor(Math.random()*200) + 60) === 0) {
        regBubbleArr.push(new regularBubbleObj(random(5, 395), random(400, 550)));
    }

    // Draws bubble bursts on mouse clicks
    for(var i = 0 ; i < bundleArr.length; i++) {
        bundleArr[i].draw();
        // Remove instance of bubble/particle bundle when all the bubbles have "popped"
        if(bundleArr[i].burstArr.length <= 0) {
            bundleArr.splice(i, 1);
        }
    }
};
