/************** DRAW OBJECTS TO PLACE IN TILE MAP ******************/
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
    fill(191, 153, 40);
    rect(this.x, this.y, 20, 20);
    // Draws dirt details
    fill(166, 129, 70);
    ellipse(this.x+13, this.y+12, 8, 3);
    ellipse(this.x+16, this.y+4, 3, 4);
    rect(this.x, this.y+17, 20, 4);
    rect(this.x, this.y, 3, 20);
    rect(this.x+5, this.y+3, 6, 3);
    stroke(212, 198, 155);
    line(this.x+16, this.y+5, this.x+13, this.y+15);
    line(this.x+13, this.y+2, this.x+9, this.y+16);
    line(this.x+8, this.y+3, this.x+6, this.y+10);
};
var dirtArr = [];
/*******************************************************************/
/*
    STRETCH GOAL: Add a setup menu for the tile map that allows
                  users to place the objects on the grid with
                  mouse clicks and object selection. Do not allow
                  more than 20 rocks/obstacles.
*/
// Used to initialize object's positions; separate from drawing them
var tilemap = ["gddgggdd------rgggrr",
               "ddgggddd-----ggggggg",
               "dggdrrddddd---ggg---",
               "ggggrddddd----------",
               "ggggdddd------------",
               "ggggggddd------r---d",
               "ddggddd----------ddd",
               "ddddd---------ggdddd",
               "drgddggg----ggggggdd",
               "drrgddggggggdgggggdd",
               "drggggggggddddgggggd",
               "g-ddddgggdddddddgggd",
               "g--ddggrrrdddddddddd",
               "g-gggddggddggddddddd",
               "ggggddddgdddggggddgg",
               "gggrrggdgdddgdddddgg",
               "gggggggggdddddrddggg",
               "ggggdddrrdddgddggggg",
               "ddddggdrddggdddddggg",
               "dddgdgdddddddggggggg"];
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

//TODO
/*
character.move();
character.checkCollsion();
character.draw();
*/

initTilemap();
draw = function() {
    background(255, 255, 255);
    
    for(var i = 0; i < rockArr.length; i++) {
        rockArr[i].draw();
    }
    for(var i = 0; i < grassArr.length; i++) {
        grassArr[i].draw();
    }
    for(var i = 0; i < dirtArr.length; i++) {
        dirtArr[i].draw();
    }
    
    //////////////////////////////////////////////////////////////////////////////////
    // TEMPORARY; PLACEHOLDER LINES TO LAY OUT GRID
    // 400 / 20 = 20
    stroke(166, 166, 166);
    for(var i = 20; i < 400; i = i + 20) {
        line(0, i, width, i);
    }
    for(var i = 20; i < 400; i = i + 20) {
        line(i, 0, i, height);
    }
    //////////////////////////////////////////////////////////////////////////////////
};