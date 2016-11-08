var sketchProc=function(processingInstance){ with (processingInstance){
size(400, 400); 
frameRate(60);

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
            
            // if(tilemap[i][j] === 'w') {
            //     wallArr.push(new wallObj(j*20, i*20));
            // }
            
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
};

}};
