/*
 *      Directionless
 */

angleMode = "radians";

var gameState = "menu";
var paintDiameter = 30; // used in Menu screen and mouse click location detection
// Flags for changing head or ear color of character; global for mouse clicks
var changeHead = 0;

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

// Draws the food (bread) on cell of tilemap depending on mouse clicks
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
    arc(10, 10, 16, 10, 0, 180);
    ellipse(5, 8, 1, 3);
    ellipse(10, 8, 1, 4);
    ellipse(15, 8, 1, 2);
    noStroke();
    fill(240, 208, 149);
    ellipse(12, 8, 2, 4);

    popMatrix();
};
var foodArr = [];

/**************** DRAW CHARACTERS TO PLACE IN TILE MAP ********************/
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
//////////////////////////// TODO checkObstale unused///////////////////////////////
bunnyObj.prototype.checkObstacle = function() {
    // Checks for rock collision
    for(var i = 0; i < rockArr.length; i++) {
        // Compute distance between rocks and animals
        var vec = PVector.sub(rockArr[i].position, this.position);
        var angle = this.wanderAngle - (Math.PI/2) - vec.heading();
        // Extract the y distance between animals and objects
        var y = vec.mag() * cos(angle);
        if((y > -30) && (y < 30)) {
            // Extract x distance between animals and objects
            var x = vec.mag() * sin(angle);
            if((x > 0) && (x < 30)) {
                // "Bounce" off at an angle between these values
                this.wanderAngle += random(Math.PI/4, Math.PI/2);
            } else if((x <= 0) && (x > -30)) {
                this.wanderAngle -= random(Math.PI/4, Math.PI/2);
            }
            this.step.set(-cos(this.wanderAngle), -sin(this.wanderAngle));
        }
    }
    // Checks for food
    for(var i = 0; i < foodArr.length; i++) {
        if(foodArr[i].position.x <= this.position.x+10 &&
           foodArr[i].position.x >= this.position.x-10) {
                if(foodArr[i].position.y <= this.position.y+10 &&
                   foodArr[i].position.y >= this.position.y-10) {
                       foodArr.splice(i, 1);
                   }
           }
    }
};
// To display on menu screen; global for mouse detection (color changes)
var player = new bunnyObj(200, 100, color(255, 255, 255), color(255, 255, 255));

var enemyObj = function(x, y, snap) {
    this.currFrame = frameCount;
    // variable to iterate through different images for animation
    this.snapshot = snap;

    // Wander variables
    this.position = new PVector(x, y);
    this.step = new PVector(0, 0);
    this.wanderAngle = random(0, Math.PI);
    this.wanderDist = random(70, 100); // distance in pixels
};
enemyObj.prototype.draw = function() {
    pushMatrix();
    translate(this.position.x, this.position.y);
    rotate(this.wanderAngle);

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
enemyObj.prototype.wander = function() {
    // Walk a direction at arbitray small angles
    this.step.set(cos(this.wanderAngle), sin(this.wanderAngle));
    this.position.add(this.step); // add vectors for wandering movement
    if(frameCount%30 === 0) {
        // small turns taken within "wandering distance"
        this.wanderAngle += random(-radians(15), radians(15));
    }
    this.wanderDist--; // distance before making significant turn

    if(this.wanderDist < 0 ||
       this.position.x >= 400 || this.position.x <= 0 || // Checks the borders of canvas
       this.position.y >= 400 || this.position.y <= 0) {
        this.wanderDist = random(70, 180);
        // Turn significantly when colliding with border
        this.wanderAngle += random(-Math.PI, Math.PI);
    }

    // Change position when hitting the edges of the canvas
    if(this.position.x >= 400) {
        this.position.x--;
    } else if(this.position.x <= 0) {
        this.position.x++;
    }
    if(this.position.y >= 400) {
        this.position.y--;
    } else if(this.position.y <= 0) {
        this.position.y++;
    }
};
var enemyArr = [];
for(var i = 0; i < 3; i++) { // Create 3 enemies to roam the map
    enemyArr.push(new enemyObj(Math.floor((Math.random()*350)+50),
                               Math.floor((Math.random()*350)+50),
                               Math.floor(Math.random())));
}
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

var keys = []; // Detect key multiple presses
var keyPressed = function() {
    keys[keyCode] = true;
};
var keyReleased = function() {
    keys[keyCode] = false;
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
// 20 pixel x 20 pixel tiles in grid/tilemap --> 20 rows, 40, columns
//      for 400x800 pixel map
// 20 * 40 = 800 tiles --> 40% rocks
// 800 * 0.40 = 320 tiles are rocks; include borders
// 116 rocks allocated on borders --> 204 rocks left
var tilemap = ["rrrrrrrrrrrrrrrrrrrr",
               "r------d----------gr",
               "r--------dd---ggg--r",
               "rrrrrrrr-----------r",
               "rrrrrrrr----rrrr---r",
               "rrr---------rrrr---r",
               "rrr---------rrrr---r",
               "r-----------rr-----r",
               "r---ddd---------g--r",
               "rr---dd--------gg-dr",
               "rrrrr---------rrrrrr",
               "rrrrrr------dd-----r",
               "rrrr--g----------dgr",
               "r---------rrrrrrrrrr",
               "r--g-------ggg--rrrr",
               "r-----------gg--rrrr",
               "r------d-----ggdd-gr",
               "r------gr---------gr",
               "r--------dd-ddd----r",
               "rrrrrrd-ggg---g----r",
               "rrggdrd------gg---gr",
               "r--ggr-d----------gr",
               "r---rrr--dd---ggg--r",
               "r---rrrr-d---------r",
               "r---rrrrrr--dd-r---r",
               "r-b------------r---r",
               "r--------------g---r",
               "r----rrrrr-------rrr",
               "r---dddrrr------grrr",
               "rg---ddrrr-----ggrrr",
               "rggd---rrrrrr----rrr",
               "rg--rrrrrr--dd---rrr",
               "r---rrrrrr-------dgr",
               "r------r-----d----gr",
               "r--g---r---ggg-----r",
               "r------rr---gg-----r",
               "r------rr----ggdd-gr",
               "r------rr---------gr",
               "r--------dd-ddd----r",
               "rrrrrrrrrrrrrrrrrrrr"];     // current rock count ~132
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
                 "3. When you've finalized your customization, click \"Confirm\"\n" +
                 "4. Proceed to make as many animals as desired.\n" +
                 "5. Press \"GO!\" to start!", 20, 135);

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
        break;

        case "game":
            background(189, 145, 79);

            // Rocks are obstables not to be collided into
            // Food cannot be spawned on rocks either
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
                enemyArr[i].draw();
                enemyArr[i].wander();
            }

            if(keyIsPressed && keys[LEFT]) {
                player.position.x--;
            } if(keyIsPressed && keys[UP]) {
                player.position.y--;
            } if(keyIsPressed && keys[DOWN]) {
                player.position.y++;
            } if(keyIsPressed && keys[RIGHT]) {
                player.position.x++;
            }
            player.draw();
        break;

        default:
            gameState = "menu";
        break;
    }
};
