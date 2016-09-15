/*
 *  Frogger, but without the frog. This is the classic childhood imagination coming to life.
 *  Don't touch the lava!
 *
 *  Uses the default canvas size (400x400 pixels)
 */
frameRate(60);

// State machine variable for game
var state = "Menu";

draw = function() {
    background(255, 255, 255);
    switch(state) {
        case "Menu":
            // code
            
            state = "GameInit";
        break;
        
        case "GameInit":
            // Draws a background color to the top half of the screen
            noStroke();
            fill(207, 44, 57);
            rect(0, 0, width, height/2);
            // Draws a background color to the bottom half of the screen
            noStroke();
            fill(110, 62, 11);
            rect(0, height/2, width, height/2);
            // Draws the starting point, a couch, at the very bottom of the canvas
            // (canvas height) / (13 rows, like in Frogger) ~= 30 (rounded down)
            // The remainder leaves the bottom to be 40 pixels in height
            //      height-(30*12) = 40
            stroke(0, 0, 0);
            fill(189, 151, 85);
            // width / 3 = 400 / 3 = 133 remainder 1
            // Draws couch seats
            rect(5, 360, 128, 25);
            rect(5+128, 360, 128, 25);
            rect(5+128+128, 360, 128, 25);
            // Draws couch back rest
            quad(5, 360+25, 133, 360+25, 133, 360+25+20, 0, 360+25+20);
            rect(133, 360+25, 128, 20);
            quad(133+128, 360+25, 133+128+128, 360+25, width, height, 133+128, 360+25+20);
            // Draws couch arm rests
            rect(5, 360, 10, 25);
            rect(width-20, 360, 10, 25);
///////////////////////////////////////////////////////////////////////////////////////
// PLACEHOLDER; TEMPORARY; TODO REMOVE THIS LATER!!!!
            noStroke();
            fill(43, 41, 39);
            rect(0, 30*6, width, 30);
            
            stroke(0, 0, 0); // round down to 30
            for(var i = 0; i < 13; i++) {
                line(0, 30*i, width, 30*i);
            } // height-(30*12) = 40
///////////////////////////////////////////////////////////////////////////////////////
        break;
        
        default:
            state = "Menu";
        break;
    }
};