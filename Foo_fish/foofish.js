// The title because fish is foo--I mean, not to be eaten... ;)

angleMode = "radians";

/*
 *  Subdivision implementation to draw smooth, arbitrary shapes
 */
//---------------------------------------------------------------------------------//
// var pointsArr = [];
// var p2 = []; // the doubled array for the points array, when split

// The number of splits; double number of points per iteration
//      Larger iterations make smoother shapes
var iterations = 5;
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
 *  Draws arbitrarily shaped fishes from the subdivision algorithm
 */
var fishObj = function(x, y) {
    this.position = new PVector(x, y); // intesection point between body and tail
    this.deltaX = 0;
    this.deltaY = 0;

    this.pointsArr = [];
    this.p2 = []; // the doubled array for the points array, when split
};
fishObj.prototype.randomize = function() {
    pushMatrix();
    translate(this.position.x, this.position.y);

    // Push first, base point (which is zero since the matrix translated to starting
    //      intersecting point position--that is, the body will be drawn from where
    //      it intersects with the tail)
    this.pointsArr.push(new PVector(0, 0));
    // Loop through each "quadrant" of the fish an arbitrary number of times
    for(var i = 0; i < Math.floor(Math.random() * 10) + 3; i++) {
        // Push arbitrary, decrementing points
        // Going counter-clockwise, the fish's body is being drawn from the intersecting
        //      point (where the tail attaches) upwards
        // X values are already negative since the "intersecting point" of the fish
        //      is at (0, 0) due to the translate
        this.deltaX += random(3, 25);
        this.deltaY += random(3, 20);
        this.pointsArr.push(new PVector(-this.deltaX, -this.deltaY));
    }
    for(var i = 0; i < Math.floor(Math.random() * 10) + 3; i++) {
        // Draws from top of fish downwards and left
        this.deltaX += random(3, 25);
        this.deltaY -= random(3, 15);
        if(-this.deltaY >= 0) { // Ensures the change in y doesn't go below 0 (at this quad)
            this.deltaY = 0;
            i = 12; // Stop looping (we don't want to keep changing x while y is constant)
        }
        this.pointsArr.push(new PVector(-this.deltaX, -this.deltaY));
    }
    // Compute halfway point of the fish
    var halfway = this.deltaX / 2;
// println("HALFWAY: " + halfway);
    for(var i = 0; i < Math.floor(Math.random() * 10) + 3; i++) {
        // Draws from leftmost part of the fish downwards to draw bottom half of fish body
        this.deltaX -= random(3, 20);
// println(this.deltaX);
        // stop this current "quadrant" drawing if xPos goes past the halfway point of fish
        if(-this.deltaX >= -halfway) {
            this.deltaX = halfway;
            i = 12;  // exit loop
        }
        this.deltaY += random(3, 15);
        this.pointsArr.push(new PVector(-this.deltaX, this.deltaY));
    }
    for(var i = 0; i < Math.floor(Math.random() * 10) + 3; i++) {
        // Starts drawing upwards and towards the right to finish off the fish's body
        this.deltaX -= random(3, 25); // disallow xPos to go past "intersection point"/origin
        if(-this.deltaX >= 0) {
            this.deltaX = 0;
            i = 12;
        }
        this.deltaY -= random(3, 10);
        this.pointsArr.push(new PVector(-this.deltaX, this.deltaY));
    }

/////////////////////////////////////////////////////////////////////////////////////
for(var i = 0; i < this.pointsArr.length; i++) {
    fill(255, 0, 0);
    ellipse(this.pointsArr[i].x, this.pointsArr[i].y, 10, 10);
    fill(0, 0, 0);
    textSize(10);
    text(i, this.pointsArr[i].x-3, this.pointsArr[i].y-5);
}
/////////////////////////////////////////////////////////////////////////////////////

    popMatrix();
};
fishObj.prototype.draw = function() {
    pushMatrix();
    translate(this.position.x, this.position.y);

    // noFill();
    // beginShape();
    // for(var i = 0; i < this.pointsArr.length; i++) {
    //     vertex(this.pointsArr[i].x, this.pointsArr[i].y);
    // }
    // vertex(this.pointsArr[0].x, this.pointsArr[0].y);
    // endShape();
    // for(var i = 0; i < iterations; i++) {
    //     subdivide(this);
    // }

    popMatrix();
};
// TODO: randomize position in a for loop arbitrarily between 1 and 5
// var fishArr = [new fishObj(50, 50), new fishObj(width/2, height/2)];
var fishArr = [new fishObj(300, height/2)];
for(var i = 0; i < fishArr.length; i++) {
    fishArr[i].randomize();
}
//---------------------------------------------------------------------------------//
var draw = function() {
    // background(255, 255, 255);
    for(var i = 0; i < fishArr.length; i++) {
        fishArr[i].draw();
    }
};
