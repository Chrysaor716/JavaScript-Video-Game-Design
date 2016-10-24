// The title because fish is foo--I mean, not to be eaten... ;)

angleMode = "radians";

/*
 *  Subdivision implementation to draw smooth, arbitrary shapes
 */
//---------------------------------------------------------------------------------//
var pointsArr = [];
var p2 = []; // the doubled array for the points array, when split
// The number of splits; double number of points per iteration
//      Larger iterations make smoother shapes
var iterations = 0;
// Creates new points between existing points; double the number of points
var splitPoints = function() {
    p2.splice(0, p2.length); // removes all the indicies starting from index 0; reset
    for(var i = 0; i < pointsArr.length - 1; i++) {
        // the original current coordinate
        p2.push(new PVector(pointsArr[i].x, pointsArr[i].y));
        // halfway between the current and next coordinate
        p2.push(new PVector((pointsArr[i].x + pointsArr[i+1].x)/2, (pointsArr[i].y + pointsArr[i+1].y)/2));
    }
    // Push the last cordinate and the halfway point between that and the first coordinate
    p2.push(new PVector(pointsArr[i].x, pointsArr[i].y));
    p2.push(new PVector((pointsArr[0].x + pointsArr[i].x)/2, (pointsArr[0].y + pointsArr[i].y)/2));
};
// Moves each point "forward" along the shape to the halfway
//      point between its current point and the next point
var average = function() {
    for(var i = 0; i < p2.length - 1; i++) {
        var x = (p2[i].x + p2[i+1].x)/2;
        var y = (p2[i].y + p2[i+1].y)/2;
        p2[i].set(x, y); 
    }
    // Move last point "forward" up to halfway between it and the first point
    var x = (p2[i].x + pointsArr[0].x)/2;
    var y = (p2[i].y + pointsArr[0].y)/2;
    pointsArr.splice(0, pointsArr.length); // clear the points array
    // Replace the points array with the newly doubled array
    for (i = 0; i < p2.length; i++) {
        pointsArr.push(new PVector(p2[i].x, p2[i].y));
    }
};
// A single division/split of points along shape
//      The number of divisions is controlled by the global "iterations" variable
var subdivide = function() {
    splitPoints();
    average();
}; 
//---------------------------------------------------------------------------------//
var draw = function() {
    background(255, 255, 255);
    for (var i = 0; i < pointsArr.length; i++) {
        vertex(pointsArr[i].x, pointsArr[i].y);
    } 
    vertex(pointsArr[0].x, pointsArr[0].y);
    endShape();
    if (iterations < 5) {
        subdivide();
        iterations++;
    }
};