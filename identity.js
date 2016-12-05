var sketchProc=function(processingInstance){ with (processingInstance){

size(600, 400); // canvas size
frameRate(60);

var keys = [];
var keyPressed = function() {
    keys[keyCode] = true;
};
var keyReleased = function(){
    keys[keyCode] = false;
};

/*
 *  Uses particle system to animate hitting an enemy
 */
// Single particle
var batBurstObj = function() {
    this.position = new PVector(0, 0);
    this.direction = new PVector(0, 0);
    this.size = random(1, 5);
    this.timer = random(50, 80);
};
batBurstObj.prototype.draw = function() {
    noStroke();
    fill(0, 0, 0);
    ellipse(this.position.x, this.position.y, this.size, this.size);
    this.position.x += this.direction.y*cos(this.direction.x);
    this.position.y += this.direction.y*sin(this.direction.x);
    this.position.y += (90/(this.timer + 100)); // adds gravity
    this.timer--;
};
// Creates an array of paricle bundles; origin of particles
var particleBundles = function(x, y) {
    this.burstArr = [];
    // Randomize number of particles
    for(var i = 0; i < Math.floor(random(5, 10)); i++) {
        this.burstArr.push(new batBurstObj()); // pushes individual particles into array
    }
    // Set particle starting position
    for(var i = 0; i < this.burstArr.length; i++) {
        this.burstArr[i].position.set(x, y);
    }
};
particleBundles.prototype.draw = function() {
    for(var i = 0; i < this.burstArr.length; i++) {
        // burst in random upwards directions (x)
        //      in N range of magnitudes (y)
        this.burstArr[i].direction.set(random(-Math.PI/6, -5*Math.PI/6), random(0, 3));
        this.burstArr[i].draw();
        // After arbitrary times for each particle/bubble, pop
        if(this.burstArr[i].timer <= 0) {
            this.burstArr.splice(i, 1);
        }
    }
};
var bundleArr = [];

// Bat/Bee objects created later in code; needed here to check collision with it
var batArr = [];
var beeArr = [];
/*
 *  Shadow powers
 */
var laserObj = function(x, y, dir) {
    this.x = x;
    this.y = y;
    this.dir = dir; // direction to shoot laser
    this.speed = 1.5;
    this.maxDist = 500; // max distance the laser can travel
    this.maxReached = false;
    this.distCounter = 0;
};
laserObj.prototype.draw = function() {
    stroke(0, 0, 0);
    strokeWeight(3);
    line(this.x, this.y, this.x - 40, this.y);
};
laserObj.prototype.move = function() {
    this.x += this.speed * this.dir;
    this.distCounter += this.speed;
    if(this.distCounter >= this.maxDist) {
        this.distCounter = 0;
        this.maxReached = true;
    }
    this.checkCollision();
};
laserObj.prototype.checkCollision = function() {
    var bat;
    for(var i = 0; i < batArr.length; i++) {
        bat = batArr[i];
        if(this.y <= bat.position.y + bat.size/2 &&
           this.y >= bat.position.y - bat.size/2) {
              if(this.x >= bat.position.x - (bat.size/2 + 10) &&
                 this.x-20 <= bat.position.x + (bat.size/2 + 10)) {
                    bundleArr.push(new particleBundles(bat.position.x, bat.position.y));
                    bat.hp--;
                    // Draw bat HP bar upon impact
                    noStroke();
                    fill(255, 0, 0, 200);
                    rect(bat.position.x-bat.size/2, bat.position.y-bat.size/2-10, bat.hp/4, 6);
                }
        }
    }
};
var laserArr = [];
/*
 *  Child's powers
 */
var shieldTime = 60;
var shieldUp = false;
var shieldCooldown = 180; // 60 * 3 (frame rate = 60)
var startCooldown = false;
var shieldObj = function(x, y, size, dir) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.direction = dir; // based on facing of character
};
shieldObj.prototype.draw = function() {
    stroke(38, 208, 227);
    fill(255, 255, 255, 0);
    strokeWeight(5);
    if(this.direction < 0) { // facing left
        arc(this.x, this.y, this.size+5, this.size+5,
            Math.PI/2, 3*Math.PI/2);
    } else {
        arc(this.x, this.y, this.size+5, this.size+5,
            -Math.PI/2, Math.PI/2);
    }
};
var shield = new shieldObj(0, 0, 0, 0);

/*
 *  Characters
 */
var rockArr = []; // Rock object created later in code; needed here to check collision with it
var childObj = function(x, y, charType) {
    this.position = new PVector(x, y);
    // Indicates whether the character is the original (1), its shadow (0), or its reflection (2)
    this.charType = charType;
    this.size = 40; // default
    this.facing = 1; // default: character is facing right
    this.collided = false; // collision with bat NPCs

    // animation variables
    this.snapshot = 0;
    this.currFrame = frameCount;
    this.dir = 1; // direction of frame iterations for animation

    // Keep track of feet position to connect characters
    //      (e.g. shadow attached to original char)
    this.backFoot = new PVector(0, 0);
    this.frontFoot = new PVector(0, 0);

    // PHYSICS
    this.position = new PVector(x, y);
    this.velocity = new PVector(0, 0);
    this.inFlight = true;
    this.gravity = 0.4;
    this.speed = 0.1;
    this.maxSpeed = 2;
    this.jumpVel = 8;
    this.terminalVelocity = 10;
};
childObj.prototype.draw = function() {
    pushMatrix();
    translate(this.position.x, this.position.y);

    noStroke();
    fill(222, 187, 104);
    if(this.charType === 0) { // shadow
        fill(0, 0, 0);
    }
    ellipse(0, -this.size/4, this.size/2, this.size/2); //head
    ellipse(this.size/4 * this.facing, -this.size/4, this.size/6, this.size/8); //nose
    fill(0, 0, 0);
    arc(0, -this.size/3, this.size/1.5, this.size/1.5, -Math.PI, 0); //hair (top)
    if(this.facing === 1) { // facing right
        arc(0, -this.size/3, this.size/1.5, this.size/1.5, Math.PI/2, 3*Math.PI/2); //hair(back)
    } else {
        arc(0, -this.size/3, this.size/1.5, this.size/1.5, -Math.PI/2, Math.PI/2); //hair(back)
    }
    ellipse(this.size/6 * this.facing, -this.size/4, this.size/12, this.size/6); //eye
    fill(222, 187, 104);
    if(this.charType === 0) {
        fill(0, 0, 0);
    }
    ellipse(0, -this.size/4, this.size/6, this.size/5); //ear

    // TODO jump animations
    switch(this.snapshot) {
        case 0:
            stroke(222, 187, 104);
            if(this.charType === 0) {
                stroke(0, 0, 0);
            }
            strokeWeight(this.size/8);
            line(0, 0, -this.size/4 * this.facing, this.size/4); //arms (back)
            line(0, this.size/3, this.size/4 * this.facing, this.size/2); //leg (back)
            this.backFoot.set(this.size/4 * this.facing, this.size/2);

            noStroke();
            fill(54, 64, 255);
            if(this.charType === 0) {
                fill(0, 0, 0);
            }
            ellipse(0, this.size/5, this.size/2, this.size/2); //torso

            stroke(222, 187, 104);
            if(this.charType === 0) {
                stroke(0, 0, 0);
            }
            strokeWeight(this.size/8);
            line(0, 0, this.size/4 * this.facing, this.size/4); //arms (front)
            line(0, this.size/3, -this.size/4 * this.facing, this.size/2); //leg (front)
            this.frontFoot.set(-this.size/4 * this.facing, this.size/2);
        break;

        case 1:
            stroke(222, 187, 104);
            if(this.charType === 0) {
                stroke(0, 0, 0);
            }
            strokeWeight(this.size/8);
            line(0, 0, -this.size/6 * this.facing, this.size/4); //arms (back)
            line(0, this.size/3, this.size/6 * this.facing, this.size/2); //leg (back)
            this.backFoot.set(this.size/6 * this.facing, this.size/2);

            noStroke();
            fill(54, 64, 255);
            if(this.charType === 0) {
                fill(0, 0, 0);
            }
            ellipse(0, this.size/5, this.size/2, this.size/2); //torso

            stroke(222, 187, 104);
            if(this.charType === 0) {
                stroke(0, 0, 0);
            }
            strokeWeight(this.size/8);
            line(0, 0, this.size/6 * this.facing, this.size/4); //arms (front)
            line(0, this.size/3, -this.size/6 * this.facing, this.size/2); //leg (front)
            this.frontFoot.set(-this.size/6 * this.facing, this.size/2);
        break;

        case 2:
            stroke(222, 187, 104);
            if(this.charType === 0) {
                stroke(0, 0, 0);
            }
            strokeWeight(this.size/8);
            line(0, 0, -this.size/8 * this.facing, this.size/4); //arms (back)
            line(0, this.size/3, this.size/8 * this.facing, this.size/2); //leg (back)
            this.backFoot.set(this.size/8 * this.facing, this.size/2);

            noStroke();
            fill(54, 64, 255);
            if(this.charType === 0) {
                fill(0, 0, 0);
            }
            ellipse(0, this.size/5, this.size/2, this.size/2); //torso

            stroke(222, 187, 104);
            if(this.charType === 0) {
                stroke(0, 0, 0);
            }
            strokeWeight(this.size/8);
            line(0, 0, this.size/8 * this.facing, this.size/4); //arms (front)
            line(0, this.size/3, -this.size/8 * this.facing, this.size/2); //leg (front)
            this.frontFoot.set(-this.size/8 * this.facing, this.size/2);
        break;

        case 3:
            stroke(222, 187, 104);
            if(this.charType === 0) {
                stroke(0, 0, 0);
            }
            strokeWeight(this.size/8);
            line(0, 0, 0, this.size/4); //arms (back)
            line(0, this.size/3, 0, this.size/2); //leg (back)
            this.backFoot.set(0, this.size/2);

            noStroke();
            fill(54, 64, 255);
            if(this.charType === 0) {
                fill(0, 0, 0);
            }
            ellipse(0, this.size/5, this.size/2, this.size/2); //torso

            stroke(222, 187, 104);
            if(this.charType === 0) {
                stroke(0, 0, 0);
            }
            strokeWeight(this.size/8);
            line(0, 0, 0, this.size/4); //arms (front)
            line(0, this.size/3, 0, this.size/2); //leg (front)
            this.frontFoot.set(0, this.size/2);
        break;

        case 4:
            stroke(222, 187, 104);
            if(this.charType === 0) {
                stroke(0, 0, 0);
            }
            strokeWeight(this.size/8);
            line(0, 0, -this.size/-8 * this.facing, this.size/4); //arms (back)
            line(0, this.size/3, this.size/-8 * this.facing, this.size/2); //leg (back)
            this.backFoot.set(this.size/-8 * this.facing, this.size/2);

            noStroke();
            fill(54, 64, 255);
            if(this.charType === 0) {
                fill(0, 0, 0);
            }
            ellipse(0, this.size/5, this.size/2, this.size/2); //torso

            stroke(222, 187, 104);
            if(this.charType === 0) {
                stroke(0, 0, 0);
            }
            strokeWeight(this.size/8);
            line(0, 0, this.size/-8 * this.facing, this.size/4); //arms (front)
            line(0, this.size/3, -this.size/-8 * this.facing, this.size/2); //leg (front)
            this.frontFoot.set(-this.size/-8 * this.facing, this.size/2);
        break;

        case 5:
            stroke(222, 187, 104);
            if(this.charType === 0) {
                stroke(0, 0, 0);
            }
            strokeWeight(this.size/8);
            line(0, 0, -this.size/-6 * this.facing, this.size/4); //arms (back)
            line(0, this.size/3, this.size/-6 * this.facing, this.size/2); //leg (back)
            this.backFoot.set(this.size/-6 * this.facing, this.size/2);

            noStroke();
            fill(54, 64, 255);
            if(this.charType === 0) {
                fill(0, 0, 0);
            }
            ellipse(0, this.size/5, this.size/2, this.size/2); //torso

            stroke(222, 187, 104);
            if(this.charType === 0) {
                stroke(0, 0, 0);
            }
            strokeWeight(this.size/8);
            line(0, 0, this.size/-6 * this.facing, this.size/4); //arms (front)
            line(0, this.size/3, -this.size/-6 * this.facing, this.size/2); //leg (front)
            this.frontFoot.set(-this.size/-6 * this.facing, this.size/2);
        break;

        case 6:
            stroke(222, 187, 104);
            if(this.charType === 0) {
                stroke(0, 0, 0);
            }
            strokeWeight(this.size/8);
            line(0, 0, -this.size/-4 * this.facing, this.size/4); //arms (back)
            line(0, this.size/3, this.size/-4 * this.facing, this.size/2); //leg (back)
            this.backFoot.set(this.size/-4 * this.facing, this.size/2);

            noStroke();
            fill(54, 64, 255);
            if(this.charType === 0) {
                fill(0, 0, 0);
            }
            ellipse(0, this.size/5, this.size/2, this.size/2); //torso

            stroke(222, 187, 104);
            if(this.charType === 0) {
                stroke(0, 0, 0);
            }
            strokeWeight(this.size/8);
            line(0, 0, this.size/-4 * this.facing, this.size/4); //arms (front)
            line(0, this.size/3, -this.size/-4 * this.facing, this.size/2); //leg (front)
            this.frontFoot.set(-this.size/-4 * this.facing, this.size/2);
        break;

        default:
            //
        break;
    }
    /////////////////////////////////////////////////////////////////////////////
    if(this.currFrame < (frameCount - 20)) {
        this.currFrame = frameCount;
        this.snapshot += this.dir;
    }
    if(this.snapshot > 6) {
        this.snapshot = 5;
        this.dir = -this.dir;
    }
    if(this.snapshot < 0) {
        this.snapshot = 1;
        this.dir = -this.dir;
    }

    popMatrix();
};
var boy = new childObj(width/2, height/2, 1);
var shadow = new childObj((width/2)-100, height/2, 0);
shadow.size = 60; // init
// TODO: make reflection
childObj.prototype.update = function() {
    if(keys[LEFT]) {
        this.velocity.x -= this.speed;
        this.facing = -1;
    }
    if(keys[RIGHT]) {
        this.velocity.x += this.speed;
        this.facing = 1;
    }
    if(!keys[LEFT] && !keys[RIGHT]) {
        if(this.velocity.x > 0) {
            this.velocity.x -= this.speed;
        }
        if(this.velocity.x < 0) {
            this.velocity.x += this.speed;
        }
        // Don't apply any force/speed when x-velocity is 0
    }

    // Key for jumping
    if(keys[UP] && !this.inFlight) {
        this.velocity.y = -this.jumpVel;
    }

    // Add gravity to child
    this.velocity.y += this.gravity;
    // Check threshold velocities
    if(this.velocity.y > this.terminalVelocity) {
        this.velocity.y = this.terminalVelocity;
    }
    if(this.velocity.x > this.maxSpeed) {
        this.velocity.x = this.maxSpeed;
    }
    if(this.velocity.x < -this.maxSpeed) {
        this.velocity.x = -this.maxSpeed;
    }

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    // Always assume child is in flight until it hits the top of a rock (in checkCollision())
    this.inFlight = true;
};
childObj.prototype.checkCollision = function() {
    // Checks collision with rocks
    for(var i = 0; i < rockArr.length; i++) {
        // Reference:
        //    http://gamedev.stackexchange.com/questions/29786/a-simple-2d-rectangle-collision-algorithm-that-also-determines-which-sides-that
        // Half of (width of character + width of rock)
        var w = (this.size + 20) / 2;
        // Half of (height of character + height of rock)
        var h = (this.size + 20) / 2;
        // Center of character - center of rock
        var dx = (this.position.x - (rockArr[i].x+10));
        var dy = (this.position.y - (rockArr[i].y+10));
        // Collision occurs of deltas are less than the halves
        if(abs(dx) <= w && abs(dy) <= h) {
            var wy = w * dy;
            var hx = h * dx;
            if(wy > hx) {
                if(wy > -hx) {
                    // Collision at top edge (of child)
                    this.velocity.y = 0;
                    this.inFlight = true;
                    this.position.y = rockArr[i].y + 20 + this.size/2 + 5;
                } else {
                    // Collision at right edge
                    this.velocity.x = 0;
                    this.position.x = rockArr[i].x - this.size/2;
                }
            } else {
                if(wy > -hx) {
                    // Collision on left edge
                    this.velocity.x = 0;
                    this.position.x = rockArr[i].x + 20 + this.size/2;
                } else {
                    // Collision on bottom edge
                    this.velocity.y = 0;
                    this.inFlight = false;
                    this.position.y = rockArr[i].y - this.size/2;
                }
            }
        }
    }

    // Check collision with bat NPCs
    for(var i = 0; i < batArr.length; i++) {
        if(this.position.x+this.size/2 >= batArr[i].position.x-batArr[i].size/2-10 &&
           this.position.x-this.size/2 <= batArr[i].position.x+batArr[i].size/2+10 &&
           this.position.y+this.size/2 >= batArr[i].position.y-batArr[i].size/2 &&
           this.position.y-this.size/2 <= batArr[i].position.y+batArr[i].size/2) {
               this.collided = true;
        }
    }

    // Check collision with bee NPCs
    for(var i = 0; i < beeArr.length; i++) {
        if(this.position.x+this.size/2 >= beeArr[i].position.x-beeArr[i].w/2 &&
           this.position.x-this.size/2 <= beeArr[i].position.x+beeArr[i].w/2 &&
           this.position.y+this.size/2 >= beeArr[i].position.y-beeArr[i].h/2 &&
           this.position.y-this.size/2 <= beeArr[i].position.y+beeArr[i].h/2) {
               this.collided = true;
           }
    }
};

/*
 *  NPC states
 */
var chaseState = function() {};
chaseState.prototype.checkObstacle = function(pos) {};
chaseState.prototype.execute = function(me) {};
//-----------------------------------------------------
var wanderState = function() {
    this.wanderAngle = 0;
    this.wanderDist = random(70, 100);
    this.velocity = new PVector(0, 0);
};
// Optional: In case you want the NPCs to avoid the rocks
wanderState.prototype.checkObstacle = function(pos) {};
wanderState.prototype.execute = function(me) {
    // this.checkObstacle(me.position);
    // Walk a direction at arbitray small angles
    this.velocity.set(cos(this.wanderAngle), sin(this.wanderAngle));
    me.position.add(this.velocity); // add vectors for wandering movement
    if(frameCount%30 === 0) {
        // small turns taken within "wandering distance"
        this.wanderAngle += random(-15*Math.PI/180, 15*Math.PI/180);
    }
    this.wanderDist--; // distance before making significant turn

    if(this.wanderDist < 0 ||
      me.position.x >= width*2 || me.position.x <= 0 || // Checks the borders of canvas
      me.position.y >= height || me.position.y <= 0) {
        this.wanderDist = random(70, 200);
        // Turn significantly when colliding with border
        this.wanderAngle += random(-Math.PI, Math.PI);
    }
    // Ensure position of the enemies do not surpass the borders
    if(me.position.x >= width*3-20) {
        me.position.x--;
    } else if(me.position.x <= 20) {
        me.position.x++;
    }
    if(me.position.y >= 200) {
        me.position.y--;
    } else if(me.position.y <= 20) {
        me.position.y++;
    }

    for(var i = 0; i < laserArr.length; i++) {
        if(dist(laserArr[i].x, laserArr[i].y, me.position.x, me.position.y) < 90) {
            me.position.sub(this.velocity);
        }
    }
};
//-----------------------------------------------------

var batWingObj = function(x, y, size, side) {
    this.position = new PVector(x, y);
    this.size = size;
    this.side = side;
    // animation variables
    if(this.side === "left") {
        this.snapshot = 5;
    } else {
        this.snapshot = 0;
    }
    this.currFrame = frameCount;
};
batWingObj.prototype.draw = function() {
    pushMatrix();
    translate(this.position.x, this.position.y);

    // Animate wings
    switch(this.snapshot) {
        case 0:
            rotate(Math.PI/4);
        break;

        case 1:
            rotate(0);
        break;

        case 2:
            rotate(7*Math.PI/4);
        break;

        default:
            rotate(0);
        break;
    }

    if(this.side === "left") {
        line(-this.size/2, 0,
             -(this.size/2)-this.size/1.5, 0);
        line(((-this.size/2)+(-(this.size/2)-this.size/1.5))/1.5, 0,
             ((-this.size/2)+(-(this.size/2)-this.size/1.5))/1.5,
             this.size/3);
        line(((-this.size/2)+(-(this.size/2)-this.size/1.5))/2, 0,
             ((-this.size/2)+(-(this.size/2)-this.size/1.5))/2,
             this.size/2);
        line(((-this.size/2)+(-(this.size/2)-this.size/1.5))/3, 0,
             ((-this.size/2)+(-(this.size/2)-this.size/1.5))/3,
             this.size/1.5);
    } else {
        line(this.size/2, 0,
             (this.size/2)+this.size/1.5, 0);
        line((this.size/2+this.size/2+this.size/1.5)/1.5, 0,
             (this.size/2+this.size/2+this.size/1.5)/1.5,
             this.size/3);
        line((this.size/2+this.size/2+this.size/1.5)/2, 0,
             (this.size/2+this.size/2+this.size/1.5)/2,
             this.size/2);
        line((this.size/2+this.size/2+this.size/1.5)/3, 0,
             (this.size/2+this.size/2+this.size/1.5)/3,
             this.size/1.5);
    }

    if(this.currFrame < (frameCount - 20)) {
        this.currFrame = frameCount;
        this.snapshot++;
    }
    if(this.snapshot > 3) {
        this.snapshot = 0;
    }

    popMatrix();
};
var batEnemyObj = function(x, y) {
    this.position = new PVector(x, y);
    this.size = random(20, 30);
    this.hp = 150;

    this.leftWing = new batWingObj(this.position.x, this.position.y, this.size, "left");
    this.rightWing = new batWingObj(this.position.x, this.position.y, this.size, "right");

    // Variables for AI
    this.state = [new wanderState(), new chaseState()];
    this.currState = 0;
};
batEnemyObj.prototype.changeState = function(s) {
    this.currState = s;
};
batEnemyObj.prototype.draw = function() {
    noStroke();
    fill(0, 0, 0);
    ellipse(this.position.x, this.position.y, this.size+10, this.size); //body
    stroke(0, 0, 0);
    this.leftWing.draw();
    this.leftWing.position = this.position;
    this.rightWing.draw();
    this.rightWing.position = this.position;
    // Draw eyes
    noStroke();
    fill(255, 255, 255, 150);
    ellipse(this.position.x-this.size/4, this.position.y, this.size/3, this.size/3);
    ellipse(this.position.x+this.size/4, this.position.y, this.size/3, this.size/3);
    fill(245, 255, 133);
    ellipse(this.position.x-this.size/4, this.position.y, this.size/5, this.size/5);
    ellipse(this.position.x+this.size/4, this.position.y, this.size/5, this.size/5);
};
// Spawn 4-8 bats in random location at shadow's half of screen
for(var i = 0; i < Math.floor(Math.random()*8) + 4; i++) {
    batArr.push(new batEnemyObj(random(180, 2.5*width), random(60, 180)));
}
//--------------------------------------------------
var beeEnemyObj = function(x, y) {
    this.position = new PVector(x, y);
    this.h = random(10, 20);
    this.w = this.h + random(1, 5);
    this.hp = 150;
    this.speed = 2;
};
beeEnemyObj.prototype.draw = function() {
    noStroke();
    fill(222, 215, 24);
    ellipse(this.position.x, this.position.y, this.w, this.h);
    fill(0, 0, 0);
    if(this.speed > 0) {
        ellipse(this.position.x-7, this.position.y, 5, 5); // eye
    } else {
        ellipse(this.position.x+7, this.position.y, 5, 5);
    }
    fill(70, 205, 217, 220);
    ellipse(this.position.x, this.position.y-10, 6, 12); // wing
};
beeEnemyObj.prototype.move = function() {
    this.position.x -= this.speed;
    if(this.position.x <= -50 && this.speed >= 0) {
        this.position.x = random(3*width+10, 3*width+2000);
    }
    if(this.position.x >= width*3+50 && this.speed < 0) {
        this.position.x = random(-2000, -10);
    }
    this.checkCollision();
};
beeEnemyObj.prototype.checkCollision = function() {
    if(this.position.x+this.w >= shield.x-shield.size-5 &&
       this.position.x-this.w <= shield.x+shield.size+5 &&
       this.position.y+this.h >= shield.y-shield.size-5 &&
       this.position.y-this.h <= shield.y+shield.size+5 &&
       shieldUp) {
           this.speed = -this.speed;
       }
};
// Spawn 3-6 bees at random location at child's (bottom) half
for(var i = 0; i < Math.floor(Math.random()*6) + 3; i++) {
    beeArr.push(new beeEnemyObj(random(3*width+10, 3*width+2000), random(230, 380)));
}

/*
 *  Draws a starry sky
 */
var nightSkyObj = function() {
    this.starArr = [];
    this.t = 0; // "time" variable for sin function
};
nightSkyObj.prototype.initialize = function() {
    for(var i = 0; i < random(80, 120); i++) {
        this.starArr.push(new PVector(random(0, width), random(0, 250)));
    }
};
nightSkyObj.prototype.draw = function() {
    // Draws stars in sky
	for(var i = 0; i < this.starArr.length; i++) {
	    // Use sin to slow the "twinkling" increment
	    // Scales the rate of transparency change over time
	    stroke(255, 255, 255, 255*abs(sin(Math.PI*i*this.t/7200)));
        point(this.starArr[i].x, this.starArr[i].y);
        // Make "plus" sign ("star" shape)
        point(this.starArr[i].x-1, this.starArr[i].y);
        point(this.starArr[i].x+1, this.starArr[i].y);
        point(this.starArr[i].x, this.starArr[i].y-1);
        point(this.starArr[i].x, this.starArr[i].y+1);
	}
	this.t++;
};
var nightSky = new nightSkyObj();
nightSky.initialize();

/*
 *  Draws mountains in the background using Perlin noise
 */
var mountainObj = function(colour) {
    this.colour = colour;
};
mountainObj.prototype.draw = function() {
    var step = 0.01;
    fill(this.colour, this.colour, this.colour, 100);

    stroke(this.colour, this.colour, this.colour, 170);
    for(var t = step; t < step * width/2.5; t += step) {
        var n = noise(t + this.colour * 20);
        var m = map(n, 0, 1, 0, width/2);
        rect(t*100, 250, 1, m/(t+0.5));
    }
};
var mountainsBack = new mountainObj(150);
var mountainsFront = new mountainObj(25);

/*
 *	Tilemaps
 */
// Rocks
var rockObj = function(xPos, yPos) {
    this.x = xPos;
    this.y = yPos;
};
rockObj.prototype.draw = function() {
    noStroke();
    fill(168, 168, 168);
    // Draws the base color of entire rock
    rect(this.x, this.y, 20, 20);
    // Draws the shading and shines of the rock
    fill(99, 99, 99);
    rect(this.x, this.y+3, 5, 17);
    rect(this.x, this.y+15, 20, 5);
    fill(201, 201, 201);
    rect(this.x+5, this.y+3, 13, 2);
    rect(this.x+17, this.y+3, 3, 12);
};
// 600x400 pixel canvas size, each tile 20x20 pixels
// 40x20 tile array --> 800x400 pixel
var rockTilemap = ["rrrrrrrrrrrrrrrrrrrrr-------rrrrrrrrrrrrrrrrrr-------------------------------------------r",
                   "r---------rrrrrrrrrrr--------------------rrrrr-------------------------------------------r",
                   "r-------------rrrrrrr--------------------rrrrr-------------------------------------------r",
                   "r-------------rrrrrrrrrrr----------------rrrrr-------------------------------------------r",
                   "r------------------rrrrrr----------------rrrrrrrrr---------------------------------------r",
                   "r------------------rrrrrrrr--------------------------------------rrrrrrrr------rrrrr-----r",
                   "r------------------rrrrrrrrrr-------------------------rrrrrrr----rr------------rrrrr-----r",
                   "r-------rr---------rrrrrrrrrr------------------------rrrrrrrr----rr-----------rrrrrrr----r",
                   "r-------rr----------------------rrrr----------------rrrrrrrrr----rr-----------rrrrrrr----r",
                   "r-----rrrrrr--------------------rrrr---------------rrrrrrrrrr--rrrrrrrrrrrr--rrrrrrrrr---r",
                   "r-----rrrrrr--------------------rrrr--------------rrrrrrrrrrr--rrrrrrrrrrrrrrrrrrrrrrr---r",
                   "r-------------------------------------------------rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr", // start of original's relm
                   "r---------------------------------------------------rrr-----r----rrr---------------------r",
                   "r---------------------------------------------------rrr-----r----rrr---------------------r",
                   "r----------------------rrrrrrrrrrr-------------------------------rrr---------------------r",
                   "r----------------------rr----------------------------------------rrrrrrrrrrr---------rrrrr",
                   "r----------rrrrrrrrr-------------------------rrrr--------------------------------rrrrrrrrr",
                   "r---------rrrrrrrrrr----------------rrrrr----rrrr-----------r-------------------rrrrrrrrrr",
                   "r--------rrrrrrrrrrr----------------rrrrr----rrrr-----------r------------------rrrrrrrrrrr",
                   "rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr"]; // @ ~400 pixels down
var initRockTilemap = function() {
    for(var i = 0; i < rockTilemap.length; i++) {
        for(var j = 0; j < rockTilemap[i].length; j++) {
            switch(rockTilemap[i][j]) {
                case 'r': // rock in place
                    rockArr.push(new rockObj(j*20, i*20)); // 20x20 pixel cells
                break;

                default:
                    //
                break;
            }
        }
    }
};
initRockTilemap();

/*
 *	Game States
 */
var mainMenu = function() {
    this.rockArr = [];
    for(var i = 0; i < 30; i++) {
        this.rockArr.push(new rockObj(i*20, height-20));
    }
}; // constructor
mainMenu.prototype.execute = function(obj) {
	background(72, 72, 122);
	nightSky.draw();
	// Draws "floor" below the sky
	fill(130, 98, 74);
	rect(0, 250, width, 250);
    mountainsBack.draw();
    mountainsFront.draw();

	fill(30, 0, 222);
	textSize(40);
    textFont(createFont("monospace"));
	text("Identity", width/2-100, 60);

	fill(0, 0, 0);
	textSize(15);
	text("Child, where is your imagination going today? Who will\n" +
	"  you be? What will you do? Where will you venture?", 60, 100);

    // Draw the boy's shadow first
    shadow.size = 60;
    shadow.position.set(200, 220);
    shadow.snapshot = boy.snapshot;
    shadow.draw();
    // Connects the shadow to the boy
	stroke(0, 0, 0);
	strokeWeight(7);
	line(boy.backFoot.x + boy.position.x, boy.backFoot.y + boy.position.y,
	     shadow.backFoot.x + shadow.position.x, shadow.backFoot.y + shadow.position.y);
	line(boy.frontFoot.x + boy.position.x, boy.frontFoot.y + boy.position.y,
	     shadow.frontFoot.x + shadow.position.x, shadow.frontFoot.y + shadow.position.y);
	strokeWeight(1); // reset stroke weight back to normal
	// Draws the boy on top of shadow
    boy.position.set(350, 356);
	boy.draw();

	// Draws edge between floor and wall
	stroke(0, 0, 0);
	strokeWeight(3);
	line(0, 250, width, 250);

	// Draws "outside" of house (bricks)
	noStroke();
	fill(173, 29, 29, 190);
	rect(width-40, 0, 40, height);
	rect(0, 0, 40, height);
	stroke(255, 255, 255);
	strokeWeight(2);
	for(var i = 0; i < height/20; i++) {
	    // Draws horizontal lines of the brick wall on either side
	    line(width-40, i*20, width, i*20);
	    line(0, i*20, 38, i*20);
	    // Draws the vertical line patterns of brick wall on either side
	    if(i%2 === 0) {
	        line(width-20, i*20, width-20, i*20+19);
	        line(20, i*20, 20, i*20+19);
	    }
	}
	// Draws rock ground
	for(var i = 0; i < this.rockArr.length; i++) {
	    this.rockArr[i].draw();
	}

	fill(89, 150, 247);
	text("About", width-120, 170);
	text("Controls", width-120, 200);
	text("Play", width-120, 230);
	strokeWeight(1);
	stroke(110, 110, 110);
	// Underline selection when mouse hovers above it
	//      for visual feedback
	if(mouseX >= width-130 && mouseX <= width-40) {
	    if(mouseY > 150 && mouseY < 180) {
	        line(width-120, 175, width-90, 175);
	    }
	    if(mouseY > 180 && mouseY < 210) {
	        line(width-120, 205, width-90, 205);
	    }
	    if(mouseY > 210 && mouseY < 240) {
	        line(width-120, 235, width-90, 235);
	    }
	}

	fill(0, 0, 0);
	textSize(15);
	text("The child and his\n" +
	     "shadow act as one.\n" +
	     "They share the same\n" +
	     "HP. Destroy all the\n" +
	     "shadow bats while\n" +
	     "dodging the bees.", 385, 280);
};
var about = function() {};
about.prototype.execute = function(obj) {
    background(0, 0, 0);
    fill(255, 255, 255);
	textSize(30);
	textFont(createFont("monospace"));
	text("About", width/2-50, 60);

    textSize(15);
    text("You are what you make yourself out to be, child. Your\n              alternate ego is with you...", 60, 90);

    text("\"Identity\" is a game where you play as an imaginative\n" +
    "child. Your shadows and your reflections act as your\n" +
    "imagined self, having abilities beyond what your physical,\n" +
    "moral self can do. Since they branch off of you, they are\n" +
    "restricted to your physical bodies. Venture off and let\n" +
    "that imagination go wild!", 60, 150);

	fill(0, 30, 255);
	textSize(20);
	text("Identity", width/2-50, 290);
	fill(255, 255, 255);
	textSize(12);
	text("Christina Nguyen", width/2-60, 310);

	textSize(10);
	text("Click anywhere on the screen to return to main menu", 150, 340);
};
var controls = function() {}; // constructor
controls.prototype.execute = function(obj) {
	background(255, 255, 255);

	fill(0, 0, 0);
	textSize(30);
	textFont(createFont("monospace"));
	text("Controls", width/2-60, 40);

	textSize(20);
	text("Left/Right arrow keys: move", 150, 70);
	text("Up key: jump", 230, 100);
	text("C: shield (blocks bees)", 175, 130);

	textSize(12);
	text("(Give it a try!)", 250, 155);

	boy.size = 40;
    boy.draw();
    boy.update();
    boy.inFlight = true;
    // Adds a ground in the controls menu
    if(boy.position.y >= height/2+30) {
        boy.position.y = height/2+30;
        boy.inFlight = false;
    }
    // X bounds
    if(boy.position.x > width-50) {
        boy.position.x = width-50;
    }
    if(boy.position.x < 50) {
        boy.position.x = 50;
    }
    // Draw shield for boy
	shield.size = boy.size;
	shield.direction = boy.facing;
    shield.x = boy.position.x;
    shield.y = boy.position.y;
	if(keys[67] && !startCooldown) { // C key
        shieldUp = true;
	}
	if(shieldUp) {
	    shield.draw();
	    shieldTime--;
	    if(shieldTime <= 0) {
	        shieldUp = false;
	        shieldTime = 60;
	        startCooldown = true;
	    }
	}
	if(startCooldown) {
	    shieldCooldown--;
	    if(shieldCooldown <= 0) {
	        startCooldown = false;
	        shieldCooldown = 180;
	    }
	}
	// Show shield cooldown time in UI
	fill(42, 49, 250);
	textSize(12);
	if(shieldCooldown >= 0 && shieldCooldown <= 60) {
	    text("Shield cooldown: 1", 20, 370);
	} else if(shieldCooldown >= 61 && shieldCooldown <= 120) {
	    text("Shield cooldown: 2", 20, 370);
	} else if(shieldCooldown >= 121 && shieldCooldown <= 180) {
	    text("Shield cooldown: 3", 20, 370);
	} else {
	    text("Shield cooldown: 0", 20, 370);
	}

	textSize(10);
	text("Click anywhere on the screen to return to main menu", 150, 260);

	textSize(20);
	fill(0, 0, 0);
	text("Z: shoot lasers (from shadow)", 140, 300);

	shadow.size = 40;
	shadow.position.set(300, 350);
	shadow.draw();
	shadow.update();
	// Add laser-shooting from shadow's eyes
    if(keys[90]) { // Z key
        if(frameCount%10 === 0) { // delay generation
        laserArr.push(new laserObj(shadow.position.x, shadow.position.y - shadow.size/2, shadow.facing));
        }
    }
	// Draw lasers
    for(var i = 0; i < laserArr.length; i++) {
        laserArr[i].draw();
        laserArr[i].move();
        if(laserArr[i].maxReached) {
            laserArr.splice(i, 1);
        }
    }
};
var HP = 600; // init health
var play = function() {}; // constructor
play.prototype.execute = function(obj) {
    // Scrolling
    // NOTE: translating x=-50 shifts screen to the RIGHT
    //                   x=50  shifts screen to the LEFT
    // WHY IS IT INVERTED
    translate(-((boy.position.x+shadow.position.x)/2)+200, 0);
	background(245, 245, 245);
	noStroke();
	fill(72, 72, 122);
	rect(0, 0, width*3, 220);
	// Draws "divider" between original char and the shadow
	fill(0, 0, 0);
	stroke(0, 0, 0);
	line(0, 220, width*3, 220);

    shadow.update();
    // Synchronize the shadow with the original
    shadow.snapshot = boy.snapshot;
    shadow.checkCollision();
    // Limit shadow to divider (acts as a "ground" for shadow)
    if(shadow.position.y + shadow.size/2 >= 220) {
        shadow.velocity.y = 0;
        shadow.inFlight = false;
        shadow.position.y = 220 - shadow.size/2;
    }

    for(var i = 0; i < rockArr.length; i++) {
		rockArr[i].draw();
	}

    // Add laser-shooting from shadow's eyes
    if(keys[90]) { // Z key
        if(frameCount%10 === 0) { // delay generation
        laserArr.push(new laserObj(shadow.position.x, shadow.position.y - shadow.size/3, shadow.facing));
        }
    }
    // Draw lasers
    for(var i = 0; i < laserArr.length; i++) {
        laserArr[i].draw();
        laserArr[i].move();
        if(laserArr[i].maxReached) {
            laserArr.splice(i, 1);
        }
    }

    // Decrease HP if shadow collides with bats
    if(shadow.collided) {
        HP--;
        shadow.collided = false; // reset
    }
    // Draw HP bar
    noStroke();
    fill(11, 184, 60, 230);
    rect((boy.position.x+shadow.position.x)/2-200, 210, HP, 20);
    if(HP <= 0) {
        obj.changeStateTo(4); // gameOver state
    }
    shadow.draw();

	// Draws bat enemy
    for(var i = 0; i < batArr.length; i++) {
        batArr[i].draw();
        batArr[i].state[batArr[i].currState].execute(batArr[i]);
        // Bat dies when HP reaches zero
        if(batArr[i].hp <= 0) {
            batArr.splice(i, 1);
        }
    }
    // Draws particles when laser collides with bats
    for(var i = 0 ; i < bundleArr.length; i++) {
        bundleArr[i].draw();
        if(bundleArr[i].burstArr.length <= 0) {
            bundleArr.splice(i, 1);
        }
    }

    if(batArr.length === 0) {
        obj.changeStateTo(5); // win state
    }

    // Connects the shadow to the boy
	stroke(0, 0, 0);
	strokeWeight(7);
	line(boy.backFoot.x + boy.position.x, boy.backFoot.y + boy.position.y,
	     shadow.backFoot.x + shadow.position.x, shadow.backFoot.y + shadow.position.y);
	line(boy.frontFoot.x + boy.position.x, boy.frontFoot.y + boy.position.y,
	     shadow.frontFoot.x + shadow.position.x, shadow.frontFoot.y + shadow.position.y);
	strokeWeight(1); // reset stroke weight back to normal

	boy.update();
	boy.draw();
	boy.checkCollision();
	// Draw shield for boy
	shield.size = boy.size;
	shield.direction = boy.facing;
    shield.x = boy.position.x;
    shield.y = boy.position.y;
	if(keys[67] && !startCooldown) { // C key
        shieldUp = true;
	}
	if(shieldUp) {
	    shield.draw();
	    shieldTime--;
	    if(shieldTime <= 0) {
	        shieldUp = false;
	        shieldTime = 60;
	        startCooldown = true;
	    }
	}
	if(startCooldown) {
	    shieldCooldown--;
	    if(shieldCooldown <= 0) {
	        startCooldown = false;
	        shieldCooldown = 180;
	    }
	}
	// Show shield cooldown time in UI
	fill(42, 49, 250);
	textSize(12);
	if(shieldCooldown >= 0 && shieldCooldown <= 60) {
	    text("Shield cooldown: 1", (boy.position.x+shadow.position.x)/2-190, 390);
	} else if(shieldCooldown >= 61 && shieldCooldown <= 120) {
	    text("Shield cooldown: 2", (boy.position.x+shadow.position.x)/2-190, 390);
	} else if(shieldCooldown >= 121 && shieldCooldown <= 180) {
	    text("Shield cooldown: 3", (boy.position.x+shadow.position.x)/2-190, 390);
	} else {
	    text("Shield cooldown: 0", (boy.position.x+shadow.position.x)/2-190, 390);
	}

	// Draw bees
	for(var i = 0; i < beeArr.length; i++) {
	    beeArr[i].draw();
	    beeArr[i].move();
	}
	// Checks if boy/original collided with bees
	if(boy.collided) {
        HP -= 0.5; // Take half the damage for bees
        boy.collided = false; // reset
    }
};
var gameOver = function() {};
gameOver.prototype.execute = function(obj) {
    fill(255, 0, 0);
    textSize(30);
    text("Game over!", 250, 200);
};
var win = function() {};
win.prototype.execute = function(obj) {
    fill(13, 0, 255);
    textSize(35);
    text("Good job, champ!", 160, 200);
};
//--------------------------------------------------------
var gameObj = function() {
	this.state = [new mainMenu(), new about(), new controls(),
	              new play(), new gameOver(), new win()];
	this.currState = 0; // Initialize to state in first index (main menu)
};
gameObj.prototype.changeStateTo = function(state) {
	this.currState = state;
};
var game = new gameObj();

/*
 *	Mouse interactions.
 */
mouseClicked = function() {
	if(game.currState === 0) { // Main menu screen
	    if(mouseX >= width-130 && mouseX <= width-40) {
	        // Mouse hovered over the "About" option
	        if(mouseY > 150 && mouseY < 180) {
	            game.changeStateTo(1); // "About" screen
	        }
	        if(mouseY > 180 && mouseY < 210) {
	            boy.position.set(width/2, height/2+30);
	            boy.velocity.set(0, 0);
	            game.changeStateTo(2); // "Controls" screen
	        }
	        if(mouseY > 210 && mouseY < 240) {
	            boy.position.set(60, 350);
                boy.size = 40;
                shadow.position.set(40, 170);
                shadow.size = 50;
                // for(var i = 0; i < batArr.length; i++) {
                //     batArr[i].state = 0; // init states
                // }
                HP = 600; // re-initialize health
	            game.changeStateTo(3); // "Play" state
	        }
	    }
	} else if(game.currState === 1) { // "About" screen
	    game.changeStateTo(0); // main menu
	} else if(game.currState === 2) { // "Controls" screen
	    game.changeStateTo(0); // main menu
	} else if(game.currState === 3) { // "Play" state; gameplay
	    //
	} else if(game.currState === 4) { // "Game over" state
	    HP = 600; // re-initialize health
	    // Re-spawn the bats
        for(var i = 0; i < Math.floor(Math.random()*8) + 4; i++) {
            batArr.push(new batEnemyObj(random(180, 2.5*width), random(60, 180)));
        }
	    game.changeStateTo(0); // main menu
	} else if(game.currState === 5) { // "Win" state
	    game.changeStateTo(0); // main menu
	}
};

draw = function() {
	game.state[game.currState].execute(game);
////////////////////// DEBUGGING //////////////////////
// game.state[5].execute(game);
///////////////////////////////////////////////////////
};

}};
