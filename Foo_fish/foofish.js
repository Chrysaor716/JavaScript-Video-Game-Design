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
 *  Parabolic computation for arbitray fish shape.
 *     Used for testing and visualization.
 */
//---------------------------------------------------------------------------------//
var tPoints = [];
var tPointsTop = [];
var numTPoints = 50;
var computeTPoints = function(me) {
    var t = 0;
    var stepSize = 1/numTPoints;
    var q = new PVector(0, 0);
    var r = new PVector(0, 0);
    for(var i = 0; i < numTPoints + 1; i++) {
        q.set(t*me.pointsArr[1].x+(1-t)*me.pointsArr[0].x,
              t*me.pointsArr[1].y+(1-t)*me.pointsArr[0].y);
        r.set(t*me.pointsArr[2].x+(1-t)*me.pointsArr[1].x,
              t*me.pointsArr[2].y+(1-t)*me.pointsArr[1].y);
        tPoints.push(new PVector(t*r.x+(1-t)*q.x, t*r.y+(1-t)*q.y));
        t += stepSize;
    }
};
// This function is not necessary--mostly there for testing and visualization
var drawArc = function() {
    stroke(0, 112, 0);
    for(var i = 0; i < numTPoints; i++) {
        line(tPoints[i].x, tPoints[i].y, tPoints[i+1].x, tPoints[i+1].y);
    }
    for(var i = 0; i < numTPoints; i++) {
        line(tPointsTop[i].x, tPointsTop[i].y, tPointsTop[i+1].x, tPointsTop[i+1].y);
    }
};
//---------------------------------------------------------------------------------//
/*
 *  Draws arbitrarily shaped fishes from the subdivision algorithm
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
    this.fishColor = color(this.rRand, this.gRand, this.bRand, random(200, 255));
};
fishObj.prototype.randomize = function() {
    pushMatrix();
    translate(this.position.x, this.position.y);

    this.pointsArr.push(new PVector(0, 0)); // push origin point
    var midX = random(30, 90);
    var deltaX = random(30, 90);
    var midY = random(20, 60);
    // push midway points
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

    popMatrix();
};
fishObj.prototype.draw = function() {
    pushMatrix();
    translate(this.position.x, this.position.y);

    if(iterations < 10) {
        subdivide(this);
        iterations++;
    }

    fill(this.fishColor);
    noStroke();

    // computeTPoints(this);
    // drawArc();

    beginShape();
    for(var i = 0; i < this.pointsArr.length; i++) {
        // vertex(this.pointsArr[i].x, this.pointsArr[i].y);
        curveVertex(this.pointsArr[i].x, this.pointsArr[i].y);
    }
    curveVertex(this.pointsArr[0].x, this.pointsArr[0].y);
    // vertex(this.pointsArr[0].x, this.pointsArr[0].y);
    endShape();

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
    if(frameCount%20 === 0) {
        if(this.facing >= 0) { // facing left
            this.position.x -= random(0, 5);
            if(this.position.x <= -100) {
                this.position.x = 500;
            }
        } else {
            this.position.x += random(0, 5);
            if(this.position.x >= 500) {
                this.position.x = -100;
            }
        }
    }
};
var fishArr = [];
// Randomize fishes arbitrarily between 1 and 5
for(var i = 0; i < Math.floor(Math.random()*5) + 1; i++) {
    // var fishArr = [new fishObj(350, 350), new fishObj(width/2, height/2)];
    fishArr.push(new fishObj(random(100, 300), random(100, 300)));
}
for(var i = 0; i < fishArr.length; i++) {
    fishArr[i].randomize();
}
//---------------------------------------------------------------------------------//
var draw = function() {
    background(255, 255, 255);
    for(var i = 0; i < fishArr.length; i++) {
        fishArr[i].draw();
        fishArr[i].move();
    }
};
