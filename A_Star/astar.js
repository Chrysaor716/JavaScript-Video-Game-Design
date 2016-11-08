var sketchProc=function(processingInstance){ with (processingInstance){
size(400, 400); 
frameRate(60);

var iterations = 0; // to draw characters using subdivision
var splitPoints = function(arr, p2) {
    p2.splice(0, p2.length); // clear array
    for(var i = 0; i < arr.length - 1; i++) {
        p2.push(new PVector(arr[i].x, arr[i].y));
        p2.push(new PVector((arr[i].x + arr[i+1].x)/2, (arr[i].y + arr[i+1].y)/2));
    }
    p2.push(new PVector(arr[i].x, arr[i].y));
    p2.push(new PVector((arr[0].x + arr[i].x)/2, (arr[0].y + arr[i].y)/2));
};
// "Smooths" out shape
var average = function(arr, p2) {
    for(var i = 0; i < p2.length - 1; i++) {
        var x = (p2[i].x + p2[i+1].x)/2;
        var y = (p2[i].y + p2[i+1].y)/2;
        p2[i].set(x, y); 
    }
    var x = (p2[i].x + arr[0].x)/2;
    var y = (p2[i].y + arr[0].y)/2;
    arr.splice(0, arr.length); // clear the points array
    for(i = 0; i < p2.length; i++) {
        arr.push(new PVector(p2[i].x, p2[i].y));
    }
};
var subdivide = function(arr, p2) {
    splitPoints(arr, p2);
    average(arr, p2);
};

/*
 *     Tilemap & objects
 */
var wallObj = function(x, y) {
    this.x = x;
    this.y = y;
};
wallObj.prototype.draw = function() {
    noStroke();
    fill(120, 120, 120);
    rect(this.x, this.y, 20, 20);
};
var wallArr = [];

var turkeyObj = function(x, y) {
    this.position = new PVector(x, y);
    // this.state = [new haltState(), new turnState(), new chaseState()];
    // this.currState = 0;
    // this.angle = 0;
    // this.whisker1 = new PVector(0, 0);
    // this.whisker2 = new PVector(0, 0);
    
    // Arrays to draw a turkey wearing sunglasses using subdivision
    this.torsoPointsArr = [];
    this.torsoP2 = []; // the doubled array for the points array, when split
    this.tailPointsArr = [];
    this.tailP2 = [];
    this.shadesPointsArr = [];
    this.shadesP2 = [];
};
turkeyObj.prototype.generateShapes = function() {
    pushMatrix();
    translate(this.position.x, this.position.y);
    
    // initialize turkey torso
    this.torsoPointsArr.push(new PVector(20, 0));
    this.torsoPointsArr.push(new PVector(10, 0));
    this.torsoPointsArr.push(new PVector(10, 10));
    this.torsoPointsArr.push(new PVector(0, 10));
    this.torsoPointsArr.push(new PVector(0, 20));
    this.torsoPointsArr.push(new PVector(15, 20));
    this.torsoPointsArr.push(new PVector(20*(5/8), 6));
    this.torsoPointsArr.push(new PVector(20, 10));
    // turkey tail
    this.tailPointsArr.push(new PVector(5, 15));
    this.tailPointsArr.push(new PVector(7, 10-(10/3)));
    this.tailPointsArr.push(new PVector(10, 10-(20/3)));
    this.tailPointsArr.push(new PVector(5, 0));
    this.tailPointsArr.push(new PVector(0, 10-(20/3)));
    this.tailPointsArr.push(new PVector(2, 10-(10/3)));
    // sunglasses
    this.shadesPointsArr.push(new PVector(10, 0));
    this.shadesPointsArr.push(new PVector(20, 0));
    this.shadesPointsArr.push(new PVector(20, 5));
    this.shadesPointsArr.push(new PVector(15, 5));
    this.shadesPointsArr.push(new PVector(10+(10/2), 5));
    this.shadesPointsArr.push(new PVector(10+(10/2), 2));
    this.shadesPointsArr.push(new PVector(10, 2));
    
    popMatrix();
};
turkeyObj.prototype.draw = function() {
    pushMatrix();
    translate(this.position.x, this.position.y);
    
    if(iterations < 5) {
        subdivide(this.torsoPointsArr, this.torsoP2);
        subdivide(this.tailPointsArr, this.tailP2);
        subdivide(this.shadesPointsArr, this.shadesP2);
        iterations++;
    }
    noStroke();
    
    beginShape();
    fill(232, 159, 49);
    for(var i = 0; i < this.torsoPointsArr.length; i++) {
        curveVertex(this.torsoPointsArr[i].x, this.torsoPointsArr[i].y);
    }
    curveVertex(this.torsoPointsArr[0].x, this.torsoPointsArr[0].y);
    endShape();
    
    beginShape();
    fill(140, 99, 38);
    for(var i = 0; i < this.tailPointsArr.length; i++) {
        curveVertex(this.tailPointsArr[i].x, this.tailPointsArr[i].y);
    }
    curveVertex(this.tailPointsArr[0].x, this.tailPointsArr[0].y);
    endShape();
    
    beginShape();
    fill(0, 0, 0);
    for(var i = 0; i < this.shadesPointsArr.length; i++) {
        curveVertex(this.shadesPointsArr[i].x, this.shadesPointsArr[i].y);
    }
    curveVertex(this.shadesPointsArr[0].x, this.shadesPointsArr[0].y);
    endShape();
    
    noStroke();
    fill(133, 133, 133, 100);
    rect(0, 0, 20, 20);
    
    popMatrix();
};
var turkey = new turkeyObj(width/2, height/2);
turkey.generateShapes();
//--------------------------------------------------------------
// 20x20
var tilemap = ["wwwwwwwwwwwwwwwwwwww",
               "w          ww      w",
               "w wwwwwwww    w  www",
               "w wwww     wwww wwww",
               "w      wwwwwwww    w",
               "w wwww          wwww",
               "w      wwwwwwww    w",
               "wwwwww wwwww    wwww",
               "w  ww    wwwwww   ww",
               "w  wwwww   ww   wwww",
               "w      www  ww w   w",
               "w  wwwwwww       www",
               "w  www     wwww wwww",
               "w      wwwwwwww    w",
               "w wwww          wwww",
               "w      wwwwwwww    w",
               "wwwwww wwwww    wwww",
               "w  ww    w   ww   ww",
               "w     ww    ww  wwww",
               "wwwwwwwwwwwwwwwwwwww"];
var initTilemap = function() {
    for(var i = 0; i < tilemap.length; i++) {
        for(var j = 0; j < tilemap[i].length; j++) {
            switch(tilemap[i][j]) {
                case 'w': // wall
                    wallArr.push(new wallObj(j*20, i*20));
                    // TODO add negative weight to graph
                break;
                default:
                    // blank
                    // TODO add weight of 0 to graph
                break;
            } // end switch/case
        } // end inner for loop
    } // end outer for loop
};
var displayTilemap = function() {
    for(var i = 0; i < wallArr.length; i++) {
        wallArr[i].draw();
    }
};

initTilemap();
draw = function() {
    background(255, 255, 255);
    displayTilemap();
    turkey.draw();
};

}};
