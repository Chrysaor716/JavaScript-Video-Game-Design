/*
 *      Directionless
 */

var gameState = "menu";
var headColor = color(255, 255, 255); // for character customization
var earColor = color(255, 255, 255);
var paintDiameter = 30; // used in Menu screen and mouse click location detection
// Flags for changing head or ear color of character; global for mouse clicks
var changeHead = 0;

/**************** DRAW ANIMALS TO PLACE IN TILE MAP ********************/
var bunnyObj = function(xPos, yPos, headColor, earColor) {
    this.x = xPos; // initial position
    this.y = yPos;
    this.speed = 4;
    this.headRGB = headColor;
    this.earRGB = earColor;
};
bunnyObj.prototype.draw = function() {
    noStroke();
    // Draws the head
    fill(this.headRGB);
    ellipse(this.x, this.y, 20, 20);
    // Draws the ears
    stroke(this.earRGB);
    fill(255, 105, 213);
    arc(this.x-5, this.y+3, 5, 30, 20, 180);
    arc(this.x+5, this.y+3, 5, 30, 0, 160);
    // Draws the nose and whiskers
    noStroke();
    fill(242, 121, 165);
    ellipse(this.x, this.y-9, 6, 6);
    stroke(0, 0, 0);
    line(this.x-7, this.y-3, this.x-15, this.y);
    line(this.x+7, this.y-3, this.x+15, this.y);
    line(this.x-5, this.y-6, this.x-12, this.y-4);
    line(this.x+5, this.y-6, this.x+12, this.y-4);
};
var bunnyArr = [];
// To display on menu screen; global for mouse detection (color changes)
var bunnyMenu = new bunnyObj(100, 90, headColor, earColor);
/***********************************************************************/

/**************** DRAW OBJECTS TO PLACE IN TILE MAP ********************/
// Rocks (uses 'r' in tilemap)
// Rocks are obstacles in the tilemap, so it should have collision-detection
// Food cannot be placed on top of the rocks
var rockObj = function(xPos, yPos) {
    this.x = xPos;
    this.y = yPos;
};
rockObj.prototype.draw = function() {
    noStroke();
    fill(168, 168, 168);
    // Draws the base color of entire rock
    rect(this.x, this.y, 20, 20);
    // Draws the details of the rock
    fill(99, 99, 99);
    rect(this.x, this.y+3, 5, 17);
    rect(this.x, this.y+15, 20, 5);
    fill(201, 201, 201);
    rect(this.x+5, this.y+3, 13, 2);
    rect(this.x+17, this.y+3, 3, 12);
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
var foodObj = function(posX, posY) {
    this.x = posX;
    this.y = posY;
};
foodObj.prototype.draw = function() {
    noStroke();
    // Draws bread base
    fill(204, 152, 63);
    // The food is drawn with ellipses, but the starting coordinates
    //      refer to the top left hand corner of the cell
    ellipse(this.x+10, this.y+10, 16, 10);
    stroke(173, 124, 59);
    arc(this.x+10, this.y+10, 16, 10, 0, 180);
    ellipse(this.x+5, this.y+8, 1, 3);
    ellipse(this.x+10, this.y+8, 1, 4);
    ellipse(this.x+15, this.y+8, 1, 2);
    noStroke();
    fill(240, 208, 149);
    ellipse(this.x+12, this.y+8, 2, 4);
};
var foodArr = [];

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
                headColor = color(255, 0, 0);
                bunnyMenu.headRGB = headColor;
            } else {
                earColor = color(255, 0, 0);
                bunnyMenu.earRGB = earColor;
            }
        } else if (circleDetected(310, 260)) { // Green
            if(changeHead) {
                headColor = color(0, 230, 0);
                bunnyMenu.headRGB = headColor;
            } else {
                earColor = color (0, 230, 0);
                bunnyMenu.earRGB = earColor;
            }
        }
    } else if(gameState === "game") {
        // Check if a rock is in the cell; if so, remove food source from
        //      that cell
        foodArr.push(new foodObj(mouseX-(mouseX%20), mouseY-(mouseY%20)));
        for(var i = 0; i < rockArr.length; i++) {
            if( (rockArr[i].x === mouseX-(mouseX%20)) &&
                (rockArr[i].y === mouseY-(mouseY%20)) ) {
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
// var tilemap = ["gddggg----dd--rgg-rr",
//               "ddggg--d-----gggggg-",
//               "dggdrrdd-dd---gggddd",
//               "-gggrdd--d-----ddddd",
//               "gggg--dd----dd------",
//               "ggggggddd---dddr---d",
//               "d-ggddd------ddg-ddd",
//               "--dddg--------ggdddd",
//               "-rgddggd---gggggg-dd",
//               "-rrgdgg---ggdgg---dd",
//               "-rgggggg----ddg--ggd",
//               "-dddddggg---dd-dgggd",
//               "---ddggrrrdddddd--dd",
//               "g-gggddggddggd-----d",
//               "ggggddddgd--ggg-d---",
//               "-ggrrggdgg-d-dddddg-",
//               "--gggggggdddddrdd-gg",
//               "ggggdddrr-ddgdd---dg",
//               "d---ggdr--ggdddddggg",
//               "dddgdgd---dddgg---gg"];
///////////////////////////////////////////////////////////////////////////////
// This is a lighter tilemap; use for development and easier render
var tilemap = ["--------------r-----",
               "---gg--d----------rr",
               "----rr---dd---ggg---",
               "----rdd--d----------",
               "------------dd------",
               "---------------r---d",
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
            text("Hello! To begin, choose a character below:", 60, 60);

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
            ellipse((width/2)+70, (height/2)+60, paintDiameter, paintDiameter);
            fill(237, 237, 0); // yellow
            ellipse((width/2)+30, (height/2)+80, paintDiameter, paintDiameter);
            fill(214, 30, 214); // purple
            ellipse((width/2)+20, (height/2)+120, paintDiameter, paintDiameter);
            fill(0, 0, 0); // black
            ellipse((width/2)+50, (height/2)+145, paintDiameter, paintDiameter);
            stroke(0, 0, 0);
            fill(255, 255, 255); // white
            ellipse((width/2)+90, (height/2)+150, paintDiameter, paintDiameter);

            // TODO add more animals and if/else or switch/case for animals
            bunnyMenu.draw();
            // TODO When confirmed, push bunny into bunny array

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

            // gameState = "game";
        break;

        case "game":
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
