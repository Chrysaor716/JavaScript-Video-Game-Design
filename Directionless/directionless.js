/*
 *      Directionless
 */

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

/**************** DRAW HOMES TO PLACE IN TILE MAP ********************/
// There is one home for each animal type
var bunnyHomeObj = function(x, y) {
    this.position = new PVector(x, y);
};
bunnyHomeObj.prototype.draw = function() {
    pushMatrix();
    translate(this.position.x, this.position.y);
    
    noStroke();
    fill(176, 120, 23);
    rect(-3, -3, 26, 26);
    fill(42, 224, 54);
    ellipse(6, -2, 2, 12);
    ellipse(1, -4, 2, 16);
    ellipse(10, -5, 2, 10);
    fill(41, 41, 41);
    ellipse(10, 10, 20, 20);

    popMatrix();
};
var bunnyHomeArr = [];
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

/**************** DRAW ANIMALS TO PLACE IN TILE MAP ********************/
var bunnyObj = function(x, y, headColor, earColor, snap) {
    // Drawing variables
    this.headRGB = headColor;
    this.earRGB = earColor;
    this.currFrame = frameCount;
    // variable to iterate through different images for animation
    this.snapshot = snap;
    
    // Wander variables
    this.position = new PVector(x, y);
    this.step = new PVector(0, 0);
    this.wanderAngle = random(0, radians(180));
    // this.wanderAngle = random(0, Math.PI);
    this.wanderDist = random(70, 100); // distance in pixels
    
    this.foundHome = 0;
};
bunnyObj.prototype.draw = function() {
    pushMatrix();
    translate(this.position.x, this.position.y);
    rotate(this.wanderAngle);
    
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
            arc(-5, 3, 5, 25, 20, 180);
            arc(5, 3, 5, 25, 0, 160);
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
            arc(-5, 3, 5, 20, 20, 180);
            arc(5, 3, 5, 20, 0, 160);
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
            arc(-5, 3, 5, 20, 20, 180);
            arc(5, 3, 5, 20, 0, 160);
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
            arc(-5, 3, 5, 20, 20, 180);
            arc(5, 3, 5, 20, 0, 160);
        break;
        
        default:
            this.snapshot = 0;
        break;
    }
    if(this.currFrame < (frameCount - 30)) {
        this.currFrame = frameCount;
        this.snapshot++;
    }
    if(this.snapshot > 3) {
        this.snapshot = 0;
    }
    stroke(0, 0, 0);
    
    popMatrix();
};
bunnyObj.prototype.wander = function() {
    this.checkObstacle();
    // Walk a direction at arbitray small angles
    this.step.set(cos(this.wanderAngle), sin(this.wanderAngle));
    this.position.add(this.step); // add vectors for wandering movement
    // small turns taken within "wandering distance"
    this.wanderAngle += random(-15, 15);
    
    this.wanderDist--; // distance before making significant turn
    if(this.wanderDist < 0 ||
       this.position.x >= 400 || this.position.x <= 0 ||
       this.position.y >= 400 || this.position.y <= 0) {
        this.wanderDist = random(70, 180);
        this.wanderAngle += random(-180, 180);
        // this.wanderAngle += random(-(Math.PI/2), Math.PI/2);
    } // Continuously turn and change directions while walking a direction
    
    // Change angle and position when hitting the edges of the canvas
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
bunnyObj.prototype.checkObstacle = function() {
    // Checks for rock collision
    for(var i = 0; i < rockArr.length; i++) {
        // Compute distance between rocks and animals
        var vec = PVector.sub(rockArr[i].position, this.position);
        var angle = this.wanderAngle - 90 - vec.heading();
        // Extract the y distance between animals and objects
        var y = vec.mag() * cos(angle);
        if((y > -60) && (y < 60)) {
            // Extract x distance between animals and objects
            var x = vec.mag() * sin(angle);
            if((x > 0) && (x < 60)) {         
                this.wanderAngle++;         
            } else if((x <= 0) && (x > -60)) {
                this.wanderAngle--;
            }
            this.step.x = sin(this.wanderAngle);
            this.step.y = -cos(this.wanderAngle);
        }
    }
    // Checks for bunny hole
    for(var i = 0; i < bunnyHomeArr.length; i++) {
        if(this.position.x >= bunnyHomeArr[i].position.x-15 &&
           this.position.x <= bunnyHomeArr[i].position.x+15) {
                if(this.position.y >= bunnyHomeArr[i].position.y-15 &&
                  this.position.y <= bunnyHomeArr[i].position.y+15) {
                    this.foundHome = 1;
                }
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
var bunnyArr = [];
// To display on menu screen; global for mouse detection (color changes)
var bunnyMenu = new bunnyObj(200, 100, color(255, 255, 255), color(255, 255, 255));
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

// "menu" state: Menu interaction based on mouse location on canvas
// "game" state: Places food on the map depending on mouse click
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
                bunnyMenu.headRGB = color(255, 0, 0);
            } else {
                bunnyMenu.earRGB = color(255, 0, 0);
            }
        } else if(circleDetected(310, 260)) { // Green
            if(changeHead) {
                bunnyMenu.headRGB = color(0, 230, 0);
            } else {
                bunnyMenu.earRGB = color(0, 230, 0);
            }
        } else if(circleDetected(270, 260)) { // Blue
            if(changeHead) {
                bunnyMenu.headRGB = color(0, 0, 255);
            } else {
                bunnyMenu.earRGB = color(0, 0, 255);
            }
        } else if(circleDetected(230, 280)) { // Yellow
            if(changeHead) {
                bunnyMenu.headRGB = color(237, 237, 0);
            } else {
                bunnyMenu.earRGB = color(237, 237, 0);
            }
        } else if(circleDetected(220, 320)) { // Purple
            if(changeHead) {
                bunnyMenu.headRGB = color(214, 30, 214);
            } else {
                bunnyMenu.earRGB = color(214, 30, 214);
            }
        } else if(circleDetected(250, 345)) { // Black
            if(changeHead) {
                bunnyMenu.headRGB = color(0, 0, 0);
            } else {
                bunnyMenu.earRGB = color(0, 0, 0);
            }
        } else if(circleDetected(290, 350)) { // White
            if(changeHead) {
                bunnyMenu.headRGB = color(255, 255, 255);
            } else {
                bunnyMenu.earRGB = color(255, 255, 255);
            }
        }
        
        // Check if user clicked on the "Confirm" button
        if(mouseX <= 300+80 && mouseX >= 300 && mouseY >= 80 && mouseY <= 80+30) {
            // Initialize new bunny with a random starting position and with the
            //      menu bunny's attributes
            var bunny = new bunnyObj(Math.floor((Math.random() * 350) + 50),
                                     Math.floor((Math.random() * 350) + 50),
                                     bunnyMenu.headRGB, bunnyMenu.earRGB,
                                     Math.floor((Math.random() * 3) + 0));
            bunnyArr.push(bunny); // push the new bunny object into array
        }
        
        // Check if user clicked "GO!" for game start
        if(mouseX <= 40+60 && mouseX >= 40 && mouseY >= 260 && mouseY <= 260+40) {
            gameState = "game";
        }
    } else if(gameState === "game") {
        // Check if a rock is in the cell; if so, remove food source from
        //      that cell
        foodArr.push(new foodObj(mouseX-(mouseX%20), mouseY-(mouseY%20)));
        for(var i = 0; i < rockArr.length; i++) {
            if( (rockArr[i].position.x === mouseX-(mouseX%20)) &&
                (rockArr[i].position.y === mouseY-(mouseY%20)) ) {
                  foodArr.pop();
            }
        }
    }
};

/*
    STRETCH GOAL: Add a setup menu for the tile map that allows
                  users to place the objects on the grid with
                  mouse clicks and object selection. Do not allow
                  more than 20 rocks/obstacles.
                  ---
    OPTIONAL:     Multi-layered tile maps; a layer dedicated to
                  particular objects (rocks, grass, dirt, etc.)
                  and differently scaled (20x20 for one layer,
                  25x25 for next layer, 40x40 for the next, etc.)
*/
// Used to initialize object's positions; separate from drawing them
// "Final product" map; uncomment this out for "better" map
// Commented because Khan Academy can barely render the details!
/*
var tilemap = ["gddggg----dd--rgg-rr",
              "ddggg--d-----gggggg-",
              "dggbrrdd-dd---gggddd",
              "-gggrdd--d-----ddddd",
              "gggg--dd----dd------",
              "ggggggddd---dddr---d",
              "d-ggddd------ddg-ddd",
              "--dddg--------ggdddd",
              "-rgddggd---gggggg-dd",
              "-rrgdgg---ggdgg---dd",
              "-rgggggg----ddg--ggd",
              "-dddddggg---dd-dgggd",
              "---ddggrrrdddddd--dd",
              "g-gggddggddggd-----d",
              "ggggddddgd--ggg-d---",
              "-ggrrggdgg-d-dddddg-",
              "--gggggggdddddrdd-gg",
              "ggggdddrr-ddgdd---dg",
              "d---ggdr--ggdddddggg",
              "dddgdgd---dddgg---gg"];
*/
///////////////////////////////////////////////////////////////////////////////
// This is a lighter tilemap; use for development and easier render
//      and to reduce freezing time
var tilemap = ["--------------r-----",
               "---gg--d----------rr",
               "----rr---dd---ggg---",
               "----rdd--d----------",
               "------------dd------",
               "--b------------r---d",
               "---------------g----",
               "--------------------",
               "-r-----------------d",
               "-rr---------------dd",
               "-r------------------",
               "------------dd------",
               "-------rrr----------",
               "g------------d------",
               "--------------------",
               "---rr---------------",
               "--------------rdd-g-",
               "-------rr-----------",
               "d------r------------",
               "--------------------"];
///////////////////////////////////////////////////////////////////////////////
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
                
                case 'b': // bunny home/hole
                    bunnyHomeArr.push(new bunnyHomeObj(j*20, i*20));
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
            text("Hello! To begin, modify a character below:", 60, 60);
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
            fill(255, 255, 255);
            text("During game, you can click\n" +
                 "around to spawn food!", 20, 233);
            
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
            
            // TODO add more animals and if/else or switch/case for animals
            bunnyMenu.draw();
            
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
            
            // Draws a character confirmation button; pushes bunny to array
            noStroke();
            fill(0, 0, 0);
            rect(300, 80, 80, 30);
            stroke(255, 255, 255); // Adds extra detail to button
            fill(255, 255, 255, 0);
            rect(305, 85, 70, 20);
            fill(255, 255, 255);
            textSize(15);
            text("Confirm", 314, 100);
            strokeWeight(1); // reset stroke weight for subsequent drawings
            
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
            
            // Display number of characters added
            fill(0, 0, 0);
            textSize(12);
            text("Number of characters added: " + bunnyArr.length, 10, 320);
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
            
            for(var i = 0; i < bunnyHomeArr.length; i++) {
                bunnyHomeArr[i].draw();
            }
            
            for(var i = 0; i < bunnyArr.length; i++) {
                bunnyArr[i].draw();
                if(bunnyArr[i].foundHome !== 1) {
                    bunnyArr[i].wander();
                }
            }
            
            //////////////////////////////////////////////////////////////////////////////
            // TEMPORARY; PLACEHOLDER LINES TO LAY OUT GRID
            // 400 / 20 = 20
            // stroke(166, 166, 166);
            // for(var i = 20; i < 400; i = i + 20) {
            //     line(0, i, width, i);
            // }
            // for(var i = 20; i < 400; i = i + 20) {
            //     line(i, 0, i, height);
            // }
            //////////////////////////////////////////////////////////////////////////////
        break;
        
        default:
            gameState = "menu";
        break;
    }
};