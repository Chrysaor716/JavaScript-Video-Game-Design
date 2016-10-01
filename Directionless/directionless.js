angleMode = "radians";

var gameState = "menu";
var paintDiameter = 30; // used in Menu screen and mouse click location detection
// Flags for changing head or ear color of character; global for mouse clicks
var changeHead = 0;

/***************************** KEYPRESSES *********************************/
/*
 *  Used to control the player character (bunny object)
 */
var keys = []; // Detect key multiple presses
var keyPressed = function() { 
    keys[keyCode] = true;
};
var keyReleased = function() { 
    keys[keyCode] = false; 
};
/**************************************************************************/

/**************** DRAW OBJECTS TO PLACE IN TILE MAP ********************/
// Rocks (uses 'r' in tilemap)
// Rocks are obstacles in the tilemap, so it should have collision-detection
// Food cannot be placed on top of the rocks
var rockObj = function(x, y) {
    this.position = new PVector(x, y);
};
rockObj.prototype.draw = function() {
    pushMatrix();
    translate(this.position.x, this.position.y);

    noStroke();
    fill(168, 168, 168);
    // Draws the base color of entire rock
    rect(0, 0, 20, 20);
    // Draws the details of the rock
    fill(99, 99, 99);
    rect(0, 3, 5, 17);
    rect(0, 15, 20, 5);
    fill(201, 201, 201);
    rect(5, 3, 13, 2);
    rect(17, 3, 3, 12);

    popMatrix();
};
var rockArr = [];

// Grass (uses 'g' in tilemap)
var grassObj = function(xPos, yPos) {
    this.x = xPos;
    this.y = yPos;
};
grassObj.prototype.draw = function() {
    noStroke();
    fill(15, 214, 32);
    // Draws the base color of grass patch
    rect(this.x, this.y, 20, 20);
    fill(129, 245, 125);
    ellipse(this.x+3, this.y+4, 2, 7);
    ellipse(this.x+10, this.y+10, 3, 10);
    // Draws the leaves/longer grass sticking out
    fill(0, 166, 28);
    ellipse(this.x+16, this.y+5, 2, 17);
    ellipse(this.x+11, this.y+2, 2, 12);
    ellipse(this.x+13, this.y+5, 3, 25);
    ellipse(this.x+4, this.y+10, 2, 15);
    ellipse(this.x+7, this.y+10, 3, 19);
};
var grassArr = [];

// Dirt (uses 'd' in tilemap)
var dirtObj = function(posX, posY) {
    this.x = posX;
    this.y = posY;
};
dirtObj.prototype.draw = function() {
    noStroke();
    // Draws dirt base
    fill(189, 150, 66);
    rect(this.x, this.y, 20, 20);
    // Draws dirt details
    stroke(212, 198, 155);
    line(this.x+16, this.y+6, this.x+13, this.y+8);
    line(this.x+13, this.y+5, this.x+9, this.y+10);
    line(this.x+3, this.y+5, this.x+5, this.y+9);
    line(this.x+6, this.y+14, this.x+8, this.y+16);
};
var dirtArr = [];
/***********************************************************************/

var foodPts = 0; // counts the number of food the player collected
// Draws the food (bread)
// Uses 'f' in tilemap
var foodObj = function(x, y) {
    this.position = new PVector(x, y);
};
foodObj.prototype.draw = function() {
    pushMatrix();
    translate(this.position.x, this.position.y);

    noStroke();
    // Draws bread base
    fill(204, 152, 63);
    // The food is drawn with ellipses, but the starting coordinates
    //      refer to the top left hand corner of the cell
    ellipse(10, 10, 16, 10);
    stroke(173, 124, 59);
    arc(10, 10, 16, 10, 0, Math.PI);
    ellipse(5, 8, 1, 3);
    ellipse(10, 8, 1, 4);
    ellipse(15, 8, 1, 2);
    noStroke();
    fill(240, 208, 149);
    ellipse(12, 8, 2, 4);

    popMatrix();
};
var foodArr = [];

/*********************** DRAW PLAYER CHARACTER ****************************/
var rockDetected = 0; // boolean for rock collision detection
var bunnyObj = function(x, y, headColor, earColor, snap) {
    // Drawing variables
    this.headRGB = headColor;
    this.earRGB = earColor;
    this.currFrame = frameCount;
    // variable to iterate through different images for animation
    this.snapshot = snap;
    
    this.position = new PVector(x, y);
    this.angle = 0;
};
bunnyObj.prototype.draw = function() {
    pushMatrix();
    translate(this.position.x, this.position.y);
    rotate(this.angle);
    
    stroke(0, 0, 0);
    // Draw bunny with coordinates relative to origin
    //      (due to translation and rotation of grid)
    switch(this.snapshot) {
        case 0:
            // Draws the feet sticking out for "hop"
            fill(this.headRGB);
            ellipse(-9, 7, 5, 14);
            ellipse(9, 7, 5, 14);
            ellipse(-7, -7, 5, 13);
            ellipse(7, -7, 5, 13);
            fill(this.headRGB);
            ellipse(0, 0, 20, 20);
            // Draws the nose and whiskers
            fill(242, 121, 165);
            ellipse(0, -9, 6, 6);
            stroke(0, 0, 0);
            line(-7, -3, -15, 0);
            line(7, -3, 15, 0);
            line(-5, -6, -12, -4);
            line(5, -6, 12, -4);
            // Draws the ears
            stroke(this.earRGB);
            fill(255, 105, 213);
            arc(-5, 3, 5, 25, radians(20), Math.PI);
            arc(5, 3, 5, 25, 0, radians(160));
        break;

        case 1:
            // Draws the feet slightly sticking out for "hop"
            fill(this.headRGB);
            ellipse(-9, 5, 5, 11);
            ellipse(9, 5, 5, 11);
            ellipse(-7, -5, 5, 11);
            ellipse(7, -5, 5, 11);
            fill(this.headRGB);
            ellipse(0, 0, 20, 20);
            // Draws the nose and whiskers
            fill(242, 121, 165);
            ellipse(0, -9, 6, 6);
            stroke(0, 0, 0);
            line(-7, -3, -15, 0);
            line(7, -3, 15, 0);
            line(-5, -6, -12, -4);
            line(5, -6, 12, -4);
            // Draws the ears
            stroke(this.earRGB);
            fill(255, 105, 213);
            arc(-5, 3, 5, 20, radians(20), Math.PI);
            arc(5, 3, 5, 20, 0, radians(160));
        break;

        case 2:
            // Draws the feet slightly sticking out for "hop"
            fill(this.headRGB);
            // No feet (below head; bird's eye view)
            fill(this.headRGB);
            ellipse(0, 0, 20, 20);
            // Draws the nose and whiskers
            fill(242, 121, 165);
            ellipse(0, -9, 6, 6);
            stroke(0, 0, 0);
            line(-7, -3, -15, 0);
            line(7, -3, 15, 0);
            line(-5, -6, -12, -4);
            line(5, -6, 12, -4);
            // Draws the ears
            stroke(this.earRGB);
            fill(255, 105, 213);
            arc(-5, 3, 5, 20, radians(20), Math.PI);
            arc(5, 3, 5, 20, 0, radians(160));
        break;

        case 3:
            // Draws the feet slightly sticking out for "hop"
            fill(this.headRGB);
            ellipse(-9, 5, 5, 11);
            ellipse(9, 5, 5, 11);
            ellipse(-7, -5, 5, 11);
            ellipse(7, -5, 5, 11);
            fill(this.headRGB);
            ellipse(0, 0, 20, 20);
            // Draws the nose and whiskers
            fill(242, 121, 165);
            ellipse(0, -9, 6, 6);
            stroke(0, 0, 0);
            line(-7, -3, -15, 0);
            line(7, -3, 15, 0);
            line(-5, -6, -12, -4);
            line(5, -6, 12, -4);
            // Draws the ears
            stroke(this.earRGB);
            fill(255, 105, 213);
            arc(-5, 3, 5, 20, radians(20), Math.PI);
            arc(5, 3, 5, 20, 0, radians(160));
        break;

        default:
            this.snapshot = 0;
        break;
    }
    if(this.currFrame < (frameCount - 20)) {
        this.currFrame = frameCount;
        this.snapshot++;
    }
    if(this.snapshot > 3) {
        this.snapshot = 0;
    }
    stroke(0, 0, 0);

    popMatrix();
};
bunnyObj.prototype.move = function() {
    // Uses key presses to move player character (bunny)
    if(keyIsPressed && keys[LEFT]) {
        // if(rockDetected === 0) {
            this.position.x -= 2;
        // } else {
        //     this.position.x += 3;
        //     rockDetected = 0;
        // }
    } if(keyIsPressed && keys[UP]) {
        // if(rockDetected === 0) {
            this.position.y -= 2;
        // } else {
        //     this.position.y += 3;
        //     rockDetected = 0;
        // }
    } if(keyIsPressed && keys[DOWN]) {
        // if(rockDetected === 0) {
            this.position.y += 2;
        // } else {
        //     this.position.y += 3;
        //     rockDetected = 0;
        // }
    } if(keyIsPressed && keys[RIGHT]) {
        // if(rockDetected === 0) {
            this.position.x += 2;
        // } else {
        //     this.position.x -= 3;
        //     rockDetected = 0;
        // }
    }
    
    // Bunny collects food when it goes on top of it
    for(var i = 0; i < foodArr.length; i++) {
        if(foodArr[i].position.x <= this.position.x+15 &&
           foodArr[i].position.x >= this.position.x-25) {
                if(foodArr[i].position.y <= this.position.y+10 &&
                   foodArr[i].position.y >= this.position.y-20) {
                       foodArr.splice(i, 1);
                       foodPts++;
                   }
           }
    }
};
// To display on menu screen; global for mouse detection (color changes)
var player = new bunnyObj(200, 100, color(255, 255, 255), color(255, 255, 255));
/************************************************************************/

/**************** DRAW DEVILS TO PLACE IN TILE MAP ********************/
/*
 *      NPC states
 */
var chaseState = function() {
    this.velocity = new PVector(0,0);
};
chaseState.prototype.checkObstacle = function(pos) {
    for(var i = 0 ; i < rockArr.length; i++) {
        var distance = dist(pos.x, pos.y, rockArr[i].position.x, rockArr[i].position.y);
        if(distance < 30) {
            pos.sub(this.velocity);
        }
    }
};
chaseState.prototype.execute = function(me) {
    this.checkObstacle(me.position);
    if(dist(player.position.x, player.position.y, me.position.x, me.position.y) > 5) {
        this.velocity.set(player.position.x - me.position.x,
                          player.position.y - me.position.y);
        this.velocity.normalize();
        this.velocity.mult(2);
        me.position.add(this.velocity);
    }
    if(dist(me.position.x, me.position.y, player.position.x, player.position.y) > 80) {
         me.changeState(0);
    }
    if(dist(me.position.x, me.position.y, player.position.x, player.position.y) <= 8) {
        gameState = "defeat";
    }
};
//------------------------------
var wanderState = function() {
    this.wanderAngle = 0;
    this.wanderDist = random(70, 100);
    this.velocity = new PVector(0, 0);
};
wanderState.prototype.checkObstacle = function(pos) {
    for(var i = 0 ; i < rockArr.length; i++) {
        var vec = PVector.sub(rockArr[i].position, pos);
        // var angle = this.wanderAngle - 90 - vec.heading();
        var angle = this.wanderAngle - Math.PI/2 - vec.heading();
        var y = vec.mag() * cos(angle); // y distance away from obstacle
        if((y > -20) && (y < 20)) {
            var x = vec.mag() * sin(angle);
            if((x > 0) && (x < 20)) {
                this.wanderAngle--;
            }
            if((x <= 0) && (x > -20)) {
                this.wanderAngle++;
            }
            this.velocity.x = sin(this.wanderAngle);
            if(y > -20) {
                this.velocity.y = cos(this.wanderAngle);
            } else if(y <= 20) {
                this.velocity.y = -cos(this.wanderAngle);
            }
        }
    }
};
wanderState.prototype.execute = function(me) {
    this.checkObstacle(me.position);
    // Walk a direction at arbitray small angles
    this.velocity.set(cos(this.wanderAngle), sin(this.wanderAngle));
    me.position.add(this.velocity); // add vectors for wandering movement
    if(frameCount%30 === 0) {
        // small turns taken within "wandering distance"
        this.wanderAngle += random(-radians(15), radians(15));
    }
    this.wanderDist--; // distance before making significant turn

    if(this.wanderDist < 0 ||
       me.position.x >= 400 || me.position.x <= 0 || // Checks the borders of canvas
       me.position.y >= 800 || me.position.y <= 0) {
        this.wanderDist = random(70, 180);
        // Turn significantly when colliding with border
        this.wanderAngle += random(-Math.PI, Math.PI);
    }

    // Ensure position of the enemies do not surpass the borders
    if(me.position.x >= 380) {
        me.position.x--;
    } else if(me.position.x <= 20) {
        me.position.x++;
    }
    if(me.position.y >= 780) {
        me.position.y--;
    } else if(me.position.y <= 20) {
        me.position.y++;
    }
    
    // Change to chasing state if player is within certain distance from enemy
    if(dist(me.position.x, me.position.y, player.position.x, player.position.y) < 80) {
        me.changeState(1);
    }
};

/*
 *      NPC drawing and behvior
 */
var enemyObj = function(x, y, snap) {
    this.currFrame = frameCount;
    // variable to iterate through different images for animation
    this.snapshot = snap;

    // Wander variables
    this.position = new PVector(x, y);
    // this.velocity = new PVector(0, -1);
    // // this.wanderAngle = random(0, Math.PI);
    // this.wanderAngle = 0;
    // this.wanderDist = random(70, 100); // distance in pixels
    
    this.state = [new wanderState(), new chaseState()];
    this.currState = 0;
};
enemyObj.prototype.changeState = function(s) {
    this.currState = s;
};
enemyObj.prototype.draw = function() {
    pushMatrix();
    translate(this.position.x, this.position.y);
    // rotate(this.wanderAngle + Math.PI/2);
    rotate(Math.PI/2);

    stroke(0, 0, 0);
    switch(this.snapshot) {
        case 0:
            // Draws the tail
            stroke(255, 0, 0); // fill color for arcs
            fill(255, 0, 0, 0); // transparent fill; only want outline of arcs
            arc(0, 15, 10, 10, (Math.PI/2)+(radians(10)), radians(240));
            arc(0, 25, 10, 10, radians(270), Math.PI + (3*Math.PI/2));
            fill(255, 0, 0);
            triangle(-7, 28, 0, 27, -3, 33);
        break;

        case 1:
            // Draws the tail
            stroke(255, 0, 0); // fill color for arcs
            fill(255, 0, 0, 0); // transparent fill; only want outline of arcs
            arc(0, 25, 10, 10, (Math.PI/2)+(radians(10)), radians(270));
            arc(0, 15, 10, 10, radians(270), Math.PI + (3*Math.PI/2));
            fill(255, 0, 0);
            triangle(7, 29, 2, 26, 0, 33);
        break;

        default:
            this.snapshot = 0;
        break;
    }
    // Draws the head
    stroke(0, 0, 0);
    fill(255, 0, 0);
    ellipse(0, 0, 20, 20);
    // Draws the ears
    arc(-7, 5, 10, 20, Math.PI/2, radians(240));
    arc(7, 5, 10, 20, radians(-60), Math.PI/2);

    if(this.currFrame < (frameCount - 20)) {
        this.currFrame = frameCount;
        this.snapshot++;
    }
    if(this.snapshot > 1) {
        this.snapshot = 0;
    }
    stroke(0, 0, 0);

    popMatrix();
};
var enemyArr = [];
// for(var i = 0; i < 3; i++) { // Create 3 enemies to roam the map
//     enemyArr.push(new enemyObj(Math.floor((Math.random()*350)+50),
//                               Math.floor((Math.random()*750)+50),
//                               Math.floor(Math.random())));
// }
enemyArr.push(new enemyObj(250, 200, 0));
enemyArr.push(new enemyObj(250, 550, 1));
enemyArr.push(new enemyObj(300, 700, 0));
/***********************************************************************/

// Detects color palette selection in "menu" state
var circleDetected = function(xPos, yPos) {
    var dx = mouseX - xPos;
    var dy = mouseY - yPos;
    var sqDist = dx*dx + dy*dy;
    var radius = paintDiameter / 2;
    var sqRadius = radius * radius;
    if(sqDist <= sqRadius) {
        return true;
    } else {
        return false;
    }
};
mouseClicked = function() {
    // Lots of mouse-clicking location detection on the canvas
    if(gameState === "menu") {
        // Check for body selection for which body part's color to change
        if(mouseX <= 50+20 && mouseX >= 20 && mouseY <= 360+20 && mouseY >= 360) {
            changeHead = 1;
        } if(mouseX <= 90+50 && mouseX >= 90 && mouseY <= 360+20 && mouseY >= 360) {
            changeHead = 0;
        }

        // Check color palette click locations & check for button
        //      selection to change desired body part
        if(circleDetected(350, 280)) { // Red
            if(changeHead) {
                player.headRGB = color(255, 0, 0);
            } else {
                player.earRGB = color(255, 0, 0);
            }
        } else if(circleDetected(310, 260)) { // Green
            if(changeHead) {
                player.headRGB = color(0, 230, 0);
            } else {
                player.earRGB = color(0, 230, 0);
            }
        } else if(circleDetected(270, 260)) { // Blue
            if(changeHead) {
                player.headRGB = color(0, 0, 255);
            } else {
                player.earRGB = color(0, 0, 255);
            }
        } else if(circleDetected(230, 280)) { // Yellow
            if(changeHead) {
                player.headRGB = color(237, 237, 0);
            } else {
                player.earRGB = color(237, 237, 0);
            }
        } else if(circleDetected(220, 320)) { // Purple
            if(changeHead) {
                player.headRGB = color(214, 30, 214);
            } else {
                player.earRGB = color(214, 30, 214);
            }
        } else if(circleDetected(250, 345)) { // Black
            if(changeHead) {
                player.headRGB = color(0, 0, 0);
            } else {
                player.earRGB = color(0, 0, 0);
            }
        } else if(circleDetected(290, 350)) { // White
            if(changeHead) {
                player.headRGB = color(255, 255, 255);
            } else {
                player.earRGB = color(255, 255, 255);
            }
        }

        // Check if user clicked "GO!" for game start
        if(mouseX <= 40+60 && mouseX >= 40 && mouseY >= 260 && mouseY <= 260+40) {
            // Initialize player at position
            player.position = new PVector(200, 400);
            gameState = "game";
        }
    }
};

/*
    STRETCH GOAL: Dynamically place rocks (except for the hardcoded
                  rocks that go on the borders) -- about 40% of
                  map, including borders
                  ---
    OPTIONAL:     Multi-layered tile maps; a layer dedicated to
                  particular objects (rocks, grass, dirt, etc.)
                  and differently scaled (20x20 for one layer,
                  25x25 for next layer, 40x40 for the next, etc.)
*/
// Used to initialize object's positions; separate from drawing them
var tilemap = ["rrrrrrrrrrrrrrrrrrrr",
               "r-------d----rr---gr",
               "r--------dd---ggg--r",
               "rrrrrrr------------r",
               "rrrrrrr-----rrrr---r",
               "rrr---------rrrr---r",
               "rrr---------rrrr---r",
               "r-----rrrr--rr-----r",
               "r---ddrrrr------g--r",
               "rr---dd--r-----gg-dr",
               "rrrrr----r----rrrrrr",
               "rrrrrr------dd-----r",
               "rrrr--g----------dgr",
               "r-------rrrrrrrrrrrr",
               "r--g----rr-ggg--rrrr",
               "rrr-----rr--gg--rrrr",
               "rrr----drrrr-ggdd-gr",
               "r------grrrr------gr",
               "r--------drrrrrr---r",
               "rrrrrrd-ggg-rrrr---r", // @ ~400 pixels down from top
               "rrggdrd------rrr--gr",
               "r--ggr-d------rr--gr",
               "r---rrr--dd---ggg--r",
               "r---rrrr-d---------r",
               "r---rrrrrr--ddrrrrrr",
               "r-b-----------rrrrrr",
               "r--------------g---r",
               "rrrrrrrrrr---------r",
               "r---rrrrrr------grrr",
               "rg---drrrr-----ggrrr",
               "rggd---rrrrrrr---rrr",
               "rg--rrrrrr--dd---rrr",
               "r---rrrrrr-------dgr",
               "r-----rr-----d----gr",
               "r--gg-rr---ggg-----r",
               "r---g-rrrrr-gg-----r",
               "rd----rrrrr--ggdd-gr",
               "rrd---------------rr",
               "rrd------dd-ddd--rrr",
               "rrrrrrrrrrrrrrrrrrrr"];
var initTilemap = function() {
    for(var i = 0; i < tilemap.length; i++) {
        for(var j = 0; j < tilemap[i].length; j++) {
            switch(tilemap[i][j]) {
                case '-': // blank
                    //
                break;

                case 'r': // rock
                    rockArr.push(new rockObj(j*20, i*20));
                break;

                case 'g': // grass
                    grassArr.push(new grassObj(j*20, i*20));
                break;

                case 'd': // dirt
                    dirtArr.push(new dirtObj(j*20, i*20));
                break;

                default:
                    //
                break;
            }
        }
    }
};
initTilemap();

var initFood = function() {
    // UNCOMMENT THIS OUT IN FINAL CODE; SIZE REDUCED FOR FASTER RENDERING
    //      ON KHAN ACDEMY
//    for(var i = 0; i < 100; i++) {
    for(var i = 0; i < 50; i++) {
        // Check if a rock is in the cell; if so, remove food source from
        //      that cell
        var randX = Math.floor((Math.random()*400)+0);
        var randY = Math.floor((Math.random()*800)+0);
        foodArr.push(new foodObj(randX - (randX%20), randY - (randY%20)));
        for(var j = 0; j < rockArr.length; j++) {
            if( (rockArr[j].position.x === randX-(randX%20)) &&
                (rockArr[j].position.y === randY-(randY%20)) ) {
                  foodArr.pop();
                  i--;
            }
        }
    }
};
initFood();

draw = function() {
    switch(gameState) {
        case "menu":
            background(115, 115, 115);
            fill(0, 0, 0);
            textSize(40);
            text("Directionless", width/2-120, 40);
            textSize(15);
            text("Hello! To begin, customize the character below:", 40, 60);
            textSize(12);
            text("Use your mouse!", 150, 75);
            // Print instructions
            textSize(14);
            text("1. Start by clicking on the paint color on the palette.\n" +
                 "2. Notice you can select which body part you want to\n" +
                 "    change from the HEAD & EAR buttons at the bottom.\n" +
                 "3. When you've finalized your customization, click \"GO!\"\n" +
                 "    to begin! You will need to collect all the food on the\n" +
                 "    map without getting caught by the devils!", 20, 135);
            fill(89, 29, 29);
            text("Gameplay controls: arrow keys", 30, 240);

            // Draws a paint palette
            noStroke();
            fill(201, 155, 99);
            ellipse((width/2)+90, (height/2)+110, 200, 150);
            fill(115, 115, 115);
            ellipse((width/2)+195, (height/2)+130, 80, 40);
            ellipse((width/2)+130, (height/2)+130, 25, 25);
            // Draws paint/color options on the palette
            fill(255, 0, 0); // red
            ellipse(350, 280, paintDiameter, paintDiameter);
            fill(0, 230, 0); // green
            ellipse(310, 260, paintDiameter, paintDiameter);
            fill(0, 0, 255); // blue
            ellipse(270, 260, paintDiameter, paintDiameter);
            fill(237, 237, 0); // yellow
            ellipse(230, 280, paintDiameter, paintDiameter);
            fill(214, 30, 214); // purple
            ellipse(220, 320, paintDiameter, paintDiameter);
            fill(0, 0, 0); // black
            ellipse(250, 345, paintDiameter, paintDiameter);
            stroke(0, 0, 0);
            fill(255, 255, 255); // white
            ellipse(290, 350, paintDiameter, paintDiameter);

            player.draw();

            // Draw buttons to choose between changing head and ear of animal
            noStroke();
            fill(0, 0, 0);
            rect(20, 360, 50, 20);
            rect(90, 360, 50, 20);
            fill(255, 255, 255);
            textSize(13);
            text("Which do you want to change?", 10, 350);
            textSize(15);
            text("HEAD", 24, 375);
            text("EAR", 100, 375);
            // Highlights button selection for visual feedback
            stroke(232, 208, 55);
            strokeWeight(3);
            fill(255, 255, 255, 0); // transparent rect (only show stroke color)
            if(changeHead) {
                rect(20, 360, 50, 20);
            } else {
                rect(90, 360, 50, 20);
            }

            // Draws a button to enter gameplay
            noStroke();
            fill(63, 31, 242);
            rect(40, 260, 60, 40);
            // Draw button details to prettify it
            strokeWeight(5);
            stroke(255, 255, 255, 230);
            rect(40, 260, 60, 40);
            stroke(255, 255, 255, 180);
            rect(43, 263, 55, 36);
            fill(255, 255, 255); // Add text to button
            textSize(15);
            text("GO!", 57, 286);

            strokeWeight(1); //reset stroke weight
            
            // Initialize enemies to wandering state
            for(var i = 0; i < enemyArr.length; i++) {
                enemyArr[i].changeState(0);
            }
        break;

        case "game":
            pushMatrix();
            translate(0, -(player.position.y-200));
            
            background(189, 145, 79);
            
            for(var i = 0; i < rockArr.length; i++) {
                rockArr[i].draw();
            }

            for(var i = 0; i < grassArr.length; i++) {
                grassArr[i].draw();
            }
            for(var i = 0; i < dirtArr.length; i++) {
                dirtArr[i].draw();
            }
            
            for(var i = 0; i < foodArr.length; i++) {
                foodArr[i].draw();
            }

            for(var i = 0; i < enemyArr.length; i++) {
                // enemyArr[i].wander();
                enemyArr[i].draw();
                enemyArr[i].state[enemyArr[i].currState].execute(enemyArr[i]);
            }
            
            player.draw();
            player.move();
            // Check for rocks
            for(var i = 0 ; i < rockArr.length; i++) {
                var distance = dist(player.position.x, player.position.y,
                                    rockArr[i].position.x, rockArr[i].position.y);
                if(distance <= 20) {
                    rockDetected = 1;
                }
            }
            
            textSize(20);
            fill(255, 255, 255);
            text("Score: " + foodPts, 10, player.position.y-180);
            
            if(foodPts >= 100) {
                gameState = "victory";
            }
            
            popMatrix();
        break;
        
        case "defeat":
            background(0, 0, 0);
            textSize(25);
            fill(255, 0, 0);
            text("Oh no! You got caught!", 80, 200);
        break;
        
        case "victory":
            background(0, 0, 0);
            textSize(25);
            fill(255, 0, 0);
            text("You win!", 80, 200);
        break;

        default:
            gameState = "menu";
        break;
    }
};