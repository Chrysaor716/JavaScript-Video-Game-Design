angleMode = "radians";

var drawCuboid = function(x, y, z, w, h, d) {
    // Labels for every corner
    // (x, y, z) coordinates plus width, height, and depth
    // 8 nodes (8 arrays inside "nodes" array)
    var nodes = [[x,   y,   z  ], // 0
                 [x,   y,   z+d], // 1
                 [x,   y+h, z  ], // 2
                 [x,   y+h, z+d], // 3
                 [x+w, y,   z  ], // 4
                 [x+w, y,   z+d], // 5
                 [x+w, y+h, z  ], // 6
                 [x+w, y+h, z+d]]; //7
    // Connects each node
    // 12 edges (12 arrays inside "edges" array)
    // Contains indicies 0-7 for the "nodes" array
    var edges = [[0, 1], [1, 3], [3, 2], [2, 0],
                 [4, 5], [5, 7], [7, 6], [6, 4],
                 [0, 4], [1, 5], [2, 6], [3, 7]];
    return { 'nodes': nodes, 'edges': edges }; // return JSON with key/value pairs
};
//                     x     y    z    w    h    d
var base = drawCuboid(-50, -130, -50, 100, 260, 100);
var comp = drawCuboid(50, -80, -40, 60, 210, 80); // complimentary shape
var shapes = [base, comp];

/*
 *      Rotations used in mouseDragged()
 */
// Rotate shape around the Z axis
var rotateZ3D = function(theta, nodes) {
    // How much to rotate (delta)
    var sinTheta = sin(theta);
    var cosTheta = cos(theta);
    for(var n = 0; n < nodes.length; n++) {
        var node = nodes[n]; // extract each array inside array
        var x = node[0]; // x
        var y = node[1]; // y
        // Move nodes based on delta
        node[0] = x * cosTheta - y * sinTheta;
        node[1] = y * cosTheta + x * sinTheta;
    }
};
// Rotate around Y axis
var rotateY3D = function(theta, nodes) {
    var sinTheta = sin(theta);
    var cosTheta = cos(theta);
    for(var n = 0; n < nodes.length; n++) {
        var node = nodes[n];
        var x = node[0]; // x
        var z = node[2]; // z
        node[0] = x * cosTheta - z * sinTheta;
        node[2] = z * cosTheta + x * sinTheta;
    }
};
// Rotate around X axis
var rotateX3D = function(theta, nodes) {
    var sinTheta = sin(theta);
    var cosTheta = cos(theta);
    for(var n = 0; n < nodes.length; n++) {
        var node = nodes[n];
        var y = node[1]; // y
        var z = node[2]; // z
        node[1] = y * cosTheta - z * sinTheta;
        node[2] = z * cosTheta + y * sinTheta;
    }
};

var step = 0;
var grid = [];
grid.length = 16 * 16 * 16;
var pixels;
// Colors in the shapes
var renderShapes = function(shape) {
    // REFERENCE: returned shape
    //
    //            return { 'nodes': nodes, 'edges': edges };
    //
    // Note: Only 3 sides of the shape is facing the "camera" or from a 1st person's POV
    var ox = 0.5 + step % 100 / 100 * 16;
    step++;
    var oy = 5.5;
    var oz = 5.5;

    for(var x = 0; x < width/2; x++) {
        var xpos = (x - width/4) / (height/2);
        for(var y = 0; y < height/2; y++) {
            var ypos = (y - height/4) / (height/2);
            var zv = 1;

            var col = 0;
            var br = 255;
            
            var xp = 10;
            var yp = 10;
            var zp = 10;
            
            var gridVal = grid[(zp & 15) << 8 | (yp & 15) << 4 | (xp & 15)];

            pixels.data[(x + y * width/2) * 4 + 0] = 130;
            pixels.data[(x + y * width/2) * 4 + 1] = 100;
            pixels.data[(x + y * width/2) * 4 + 2] = 255;
        }
    }
};
var pixel_img;
var canvas;
var context;
var pixels;
var initGrid = function() {
    var i, x, y, z, xd, yd, zd;

    for(x = 0; x < 16; x++) {
        for (y = 0; y < 16; y++) {
            for (z = 0; z < 16; z++) {
                i = z << 8 | y << 4 | x;
                grid[i] = 0;
            }
        }
    }

// set some random blocks
i = 3 << 8 | 4 << 4 | 5; grid[i] = 1;
i = 3 << 8 | 4 << 4 | 6; grid[i] = 2;
i = 6 << 8 | 4 << 4 | 5; grid[i] = 3;
i = 3 << 8 | 3 << 4 | 5; grid[i] = 4;
i = 4 << 8 | 5 << 4 | 5; grid[i] = 5; // bricks
i = 4 << 8 | 3 << 4 | 5; grid[i] = 8; // green-black dots
i = 4 << 8 | 3 << 4 | 5; grid[i] = 9; // purple
i = 4 << 8 | 3 << 4 | 8; grid[i] = 10;
i = 3 << 8 | 4 << 4 | 9; grid[i] = 11;
i = 3 << 8 | 4 << 4 | 3; grid[i] = 15; 

    pixel_img = createImage(width/2, height/2, 1);
    canvas = pixel_img.sourceImg;
    context = canvas.getContext("2d");
    pixels = context.createImageData(width/2, height/2);

    for(i = 0; i < (width/2) * (height/2); i++) {
        pixels.data[i * 4 + 3] = 255;
    }
};

mouseDragged = function() {
    var dx = mouseX - pmouseX;
    var dy = mouseY - pmouseY;
    for(var shapeNum = 0; shapeNum < shapes.length; shapeNum++) {
        var nodes = shapes[shapeNum].nodes;
        rotateY3D(dx, nodes);
        rotateX3D(dy, nodes);
    }
};

// Initial rotation
for(var i = 0; i < shapes.length; i++) {
    rotateX3D(-Math.PI/4, shapes[i].nodes);
    rotateY3D(Math.PI/6, shapes[i].nodes);
}
initGrid();
draw = function() {
    translate(100, 100);
    
    background(0, 0, 0);
    var nodes, edges;
    
    // Draw edges
    stroke(255, 255, 255);
    strokeWeight(1);
    for(var shapeNum = 0; shapeNum < shapes.length; shapeNum++) {
        nodes = shapes[shapeNum].nodes;
        edges = shapes[shapeNum].edges;
        for(var e = 0; e < edges.length; e++) {
            // "edges" contains the indicies for the "nodes" array to
            //      determine which two nodes to connect (by drawing a line)
            var n0 = edges[e][0];
            var n1 = edges[e][1];
            var node0 = nodes[n0];
            var node1 = nodes[n1];
            line(node0[0], node0[1], node1[0], node1[1]);
        }   
    }
    // [[0, 1], [1, 3], [3, 2], [2, 0], --> edges
    // nodes = [[x,   y,   z  ],
    //          [x,   y,   z+d],
    // n0 = 0
    // n1 = 1
    //          [0, 1]
    // node0 = nodes[0] = [x,   y,   z  ]
    // node1 = nodes[1] = [x,   y,   z+d]
    // line(x0, y0, x1, y1);
    stroke(255, 0, 0);
    strokeWeight(5);
    line(shapes[1].nodes[edges[2][0]], shapes[1].nodes[edges[2][1]],
         shapes[1].nodes[edges[2][0]], shapes[1].nodes[edges[2][1]]);
    
    // Draw nodes (optional)
    fill(184, 46, 184);
    noStroke();
    for(var shapeNum = 0; shapeNum < shapes.length; shapeNum++) {
        nodes = shapes[shapeNum].nodes;
        for(var n = 0; n < nodes.length; n++) {
            var node = nodes[n];
            ellipse(node[0], node[1], 5, 5);
        }
    }
    
    // renderShapes(shapes[0]); // base shape
    // context.putImageData(pixels, 0, 0);
    // image(pixel_img, 0, 0, 400, 400);
};