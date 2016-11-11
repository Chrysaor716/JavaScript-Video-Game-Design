var sketchProc=function(processingInstance){ with (processingInstance){
size(400, 400); 
frameRate(60);

/*
 *    Note: Works on just Khan Academy at the moment (uses
 *    angle mode "degrees").
 *    A* algorithm taken from
 *    professor's example.
 */

// angleMode = "degrees";
// 400x400 pixel canvas size

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

var qObj = function(x, y) {
    this.x = x;
    this.y = y;
    this.fcost = 0;
};
qObj.prototype.set = function(a, b) {
    this.x = a;
    this.y = b;
};
var graph = new Array(20);
var cost = new Array(20);
var inq = new Array(20);
var comefrom = new Array(20); // closed nodes
for(var i = 0; i < 20; i++) {
    graph[i] = new Array(20);
    cost[i] = new Array(20);
    inq[i] = new Array(20);
    comefrom[i] = new Array(20);
}
var path = [];
var q = [];
for(var i = 0; i < 400; i++) {
    path.push(new PVector(0, 0));
    q.push(new qObj(0, 0));
}
for(var i = 0; i < 20; i++) {
    for(var j = 0; j < 20; j++) {
        comefrom[i][j] = new PVector(0, 0);
    }
}
var pathLen = 0;
var pathFound = 0;
var qLen = 0;
var qStart = 0;
var initialized = 0;

var initGraph = function(x, y) {
    for(var i = 0; i< 20; i++) {
        for(var j = 0; j<20; j++) {
            if(graph[i][j] > 0) {
                graph[i][j] = 0;
            }
            inq[i][j] = 0;
            cost[i][j] = 0;
        }
    }
    graph[x][y] = 1;
};

var targetObj = function(x, y) {
    this.x = x;
    this.y = y;
};
var target = new targetObj(0, 0);
var targetPos = new targetObj(0, 0);
var finalDest = new targetObj(0, 0);

//---------------------------------------------
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
                    graph[i][j] = -1;
                break;
                default:
                    // blank
                    graph[i][j] = 0;
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

//---------------------------------------------
var findIntersection = function(p) {
    var distance = 0;
    
    for(var i = 0; i < wallArr.length; i++) {
        var d = dist(p.x, p.y, wallArr[i].x+10, wallArr[i].y+10);
        if(d < 20) {
            distance += d;
        }
    }
    if(distance === 0) {
        distance = 100000;
    }
    
    return(distance);
};
//---------------------------------------------

/*
 *  States for the turkey
 */
var haltState = function() {
    this.angle = 0;
};
haltState.prototype.execute = function(me) {
    if(dist(me.position.x, me.position.y, target.x, target.y) < 5) {
        me.changeState(1); // turn state
    }
};
var turnState = function() {
    this.angle = 0;
    this.angleDir = 0;
    this.vec = new PVector(0,0);
};
turnState.prototype.execute = function(me) {
    this.vec.set(target.x - me.position.x, target.y - me.position.y);
    this.angle = this.vec.heading();
    var angleDiff = abs(this.angle - me.angle);
    if(angleDiff > 2) {
        if(this.angle > me.angle) {
            this.angleDir = 1;
        } else {
            this.angleDir = -1;
        }
        if(angleDiff > 180) {
            this.angleDir = -this.angleDir;
        }
        me.angle += this.angleDir;
        if(me.angle > 180) {
            me.angle = -179;
        } else if (me.angle < -180) {
            me.angle = 179;
        }
    } else {
        me.changeState(2); // chase state
    }
};
var chaseState = function() {
    this.step = new PVector(0,0);
};
chaseState.prototype.collideWall = function(me) {
    var collide = 0;
    this.step.set(target.x - me.position.x, target.y - me.position.y);
    this.step.normalize();
    this.step.mult(8);
    var ahead = PVector.add(me.position, this.step);
    for(var i = 0; i < wallArr.length; i++) {
        if(dist(ahead.x, ahead.y, wallArr[i].x+10, wallArr[i].y+10) < 19) {
            collide = 1;
            me.whisker1.set(this.step.x, this.step.y);
            me.whisker2.set(this.step.x, this.step.y);
            me.whisker1.rotate(45);
            me.whisker2.rotate(-60); // different angle "prevents" it from getting stuck
            me.whisker1.add(me.position);
            me.whisker2.add(me.position);
            var dist1 = findIntersection(me.whisker1);
            var dist2 = findIntersection(me.whisker2);
            if(dist1 > dist2) {
                target.x = me.whisker1.x;
                target.y = me.whisker1.y;
            } else {
                target.x = me.whisker2.x;
                target.y = me.whisker2.y;
            }
        }
    }
    return(collide);
};
chaseState.prototype.execute = function(me) {
    if(this.collideWall(me) === 1) {
        me.changeState(1); // turn when colliding with wall
    } else if(dist(target.x, target.y, me.position.x, me.position.y) > 2) {
        this.step.set(target.x - me.position.x, target.y - me.position.y);
        this.step.normalize();
        me.position.add(this.step);
    } else {
        if((finalDest.x === target.x) && (finalDest.y === target.y)) {
            me.changeState(0);
        } else {
            pathLen--;
            if(pathLen > 0) {
                target.x = path[pathLen].x;
                target.y = path[pathLen].y;
            } else {
                target.x = finalDest.x;
                target.y = finalDest.y;
            }
            me.changeState(1); // turn state
        }
    }
};
var turkeyObj = function(x, y) {
    this.position = new PVector(x, y);
    this.state = [new haltState(), new turnState(), new chaseState()];
    this.currState = 0;
    this.angle = 0;
    this.whisker1 = new PVector(0, 0);
    this.whisker2 = new PVector(0, 0);
    
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
    this.torsoPointsArr.push(new PVector(10, -10));
    this.torsoPointsArr.push(new PVector(0, -10));
    this.torsoPointsArr.push(new PVector(0, 0));
    this.torsoPointsArr.push(new PVector(-10, 0));
    this.torsoPointsArr.push(new PVector(-10, 10));
    this.torsoPointsArr.push(new PVector(5, 10));
    this.torsoPointsArr.push(new PVector(10*(5/8), -4));
    this.torsoPointsArr.push(new PVector(10, 0));
    // turkey tail
    this.tailPointsArr.push(new PVector(-5, 5));
    this.tailPointsArr.push(new PVector(-3, -(10/3)));
    this.tailPointsArr.push(new PVector(0, -(20/3)));
    this.tailPointsArr.push(new PVector(-5, -10));
    this.tailPointsArr.push(new PVector(-10, -(20/3)));
    this.tailPointsArr.push(new PVector(-8, -(10/3)));
    // sunglasses
    this.shadesPointsArr.push(new PVector(0, -10));
    this.shadesPointsArr.push(new PVector(10, -10));
    this.shadesPointsArr.push(new PVector(10, -5));
    this.shadesPointsArr.push(new PVector(5, -5));
    this.shadesPointsArr.push(new PVector((10/2), -5));
    this.shadesPointsArr.push(new PVector((10/2), -8));
    this.shadesPointsArr.push(new PVector(0, -8));
    
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
    fill(204, 138, 38);
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
    
    popMatrix();
};
turkeyObj.prototype.changeState = function(state) {
    this.currState = state;
};
var turkey = new turkeyObj(width/2-10, height/2-10);
turkey.generateShapes();

var randomObj = function(x, y) {
    this.position = new PVector(x, y);
    this.state = [new haltState(), new turnState(), new chaseState()];
    this.currState = 0;
    this.angle = 0;
    this.whisker1 = new PVector(0, 0);
    this.whisker2 = new PVector(0, 0);
};
randomObj.prototype.draw = function() {
    pushMatrix();
    translate(this.position.x, this.position.y);
    rotate(this.angle);
    fill(0, 85, 196);
    rect(-10, -10, 20, 20);
    fill(0, 0, 0);
    ellipse(-5, -5, 5, 5);
    ellipse(5, -5, 5, 5);
    stroke(0, 0, 0);
    line(-5, 5, 5, 5);
    popMatrix();
};
randomObj.prototype.changeState = function(x) {
    this.currState = x;
};
var obj = new randomObj(200, 110);
//--------------------------------------------------------------

var findAStarPath = function(x, y) {
    var i, j, a, b;
    qLen = 0;
    graph[x][y] = 1;
    inq[x][y] = 1;
    q[qLen].set(x, y);
    q[qLen].fcost = 0;
    qLen++;
    pathLen = 0;
    qStart = 0;
    var findMinInQ = function() {
        var min = q[qStart].fcost;
        var minIndex = qStart;
        for(var i = qStart+1; i<qLen; i++) {
            if(q[i].fcost < min) {
                min = q[i].qStart;
                minIndex = i;
            }
        }
        if(minIndex !== qStart) {  // swap
        var t1 = q[minIndex].x;
        var t2 = q[minIndex].y;
        var t3 = q[minIndex].fcost;
        q[minIndex].x = q[qStart].x;
        q[minIndex].y = q[qStart].y;
        q[minIndex].fcost = q[qStart].fcost;
        q[qStart].x = t1;
        q[qStart].y = t2;
        q[qStart].fcost = t3;
        }
    };
    var setComeFrom = function(a, b, i, j) {
        inq[a][b] = 1;
        comefrom[a][b].set(i, j);
        q[qLen].set(a, b);
        cost[a][b] = cost[i][j] + 10;
        q[qLen].fcost = cost[a][b] + dist(b*20+10, a*20+10, finalDest.x, finalDest.y);
        qLen++;
    };
    while ((qStart < qLen) && (pathFound === 0)) {
        findMinInQ();
        i = q[qStart].x;
        j = q[qStart].y;
        graph[i][j] = 1;
        qStart++;
        
        if((i === targetPos.x) && (j === targetPos.y)) {
            pathFound = 1;
            path[pathLen].set(j*20+10, i*20+10);
            pathLen++;
        }
        a = i+1;
        b = j;
        if((a < 20) && (pathFound === 0)) {
            if((graph[a][b] === 0) && (inq[a][b] === 0)) {
                setComeFrom(a, b, i, j);
            }
        }
        a = i-1;
        b = j;
        if((a >= 0) && (pathFound === 0)) {
            if((graph[a][b] === 0) && (inq[a][b] === 0)) {
                setComeFrom(a, b, i, j);
            }
        }
        a = i;
        b = j+1;
        
        if((b < 20) && (pathFound === 0)) {
            if ((graph[a][b] === 0) && (inq[a][b] === 0)) {
                setComeFrom(a, b, i, j);
            }
        }
        a = i;
        b = j-1;
        
        if((b >= 0) && (pathFound === 0)) {
            if((graph[a][b] === 0) && (inq[a][b] === 0)) {
                setComeFrom(a, b, i, j);
            }
        }
    }   // while
    while((i !== x) || (j !== y)) {
        a = comefrom[i][j].x;
        b = comefrom[i][j].y;
        path[pathLen].set(b*20 + 10, a*20+10);
        pathLen++;
        i = a;
        j = b;
    }
};
//--------------------------------------------------------------
var mouseClicked = function() {
    target.x = mouseX;
    target.y = mouseY;
    finalDest.x = target.x;
    finalDest.y = target.y;
    targetPos.x = floor(finalDest.y / 20);
    targetPos.y = floor(finalDest.x / 20);
    
    var i = floor(turkey.position.y / 20);
    var j = floor(turkey.position.x / 20);
    initGraph(i, j);
    pathFound = 0;
    pathLen = 0;
    findAStarPath(i, j);
    pathLen--;
    target.x = path[pathLen].x;
    target.y = path[pathLen].y;
    if(turkey.currState !== 1) {
        turkey.changeState(1);
    }
    
    if(obj.currState !== 1) {
        obj.changeState(1);
    }
};

initTilemap();
draw = function() {
    background(255, 255, 255);
    displayTilemap();
    turkey.draw();
    turkey.state[turkey.currState].execute(turkey);
    
    // obj.draw();
    // obj.state[obj.currState].execute(obj);
};

}};
