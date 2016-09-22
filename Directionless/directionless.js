/**************** DRAW OBJECTS TO PLACE IN TILE MAP ********************/
// Rocks (uses 'r' in tilemap)
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

////////////////////////////////////////////////////

// Draws the food (bread) on top of the mouse depending on mouse clicks
// The food overlays the tilemap and its objects
var foodObj = function(posX, posY) {
    this.x = posX;
    this.y = posY;
};
foodObj.prototype.draw = function() {
    noStroke();
    // Draws bread base
    fill(204, 152, 63);
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
/////////////////////////////////////TODO TODO TODO TODO//////////////////////////
// Places food on the map depending on mouse click
// mouseClicked = function() {
//     foodArr.push(mouseX);
// };
/***********************************************************************/
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
var tilemap = ["gddggg----dd--rgg-rr",
               "ddggg--d-----gggggg-",
               "dggdrrdd-dd---gggddd",
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
    
    //////////////////////////////////////////////////////////////////////////////////
    // TEMPORARY; PLACEHOLDER LINES TO LAY OUT GRID
    // 400 / 20 = 20
    // stroke(166, 166, 166);
    // for(var i = 20; i < 400; i = i + 20) {
    //     line(0, i, width, i);
    // }
    // for(var i = 20; i < 400; i = i + 20) {
    //     line(i, 0, i, height);
    // }
    //////////////////////////////////////////////////////////////////////////////////
};