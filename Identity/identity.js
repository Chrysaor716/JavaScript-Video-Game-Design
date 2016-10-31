var sketchProc=function(processingInstance){ with (processingInstance){

size(600, 400); // canvas size
frameRate(60);
angleMode = "radians";

draw = function() {
	background(255, 255, 255);
	fill(0, 0, 0);
	textSize(20);
	text("Hello World! Testing.", width/2-70, height/2);
};


}};
