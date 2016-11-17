var parseString = require('xml2js').parseString;
var fs = require('fs');

/*
Generate maze using http://www.mazegenerator.net/ and export as SVG
Modify SVG to our liking in inkscape and export as PNG and SVG
Create a json array of the rectangles  that compose the maze for hitboxes on the phone using SVG internal data:
[{tlCoord:{x,y},brCoord:{x,y}, ...]
Collision detection for phone: https://github.com/jriecken/sat-js
Import SVG into blender and create 3d model: http://blender.stackexchange.com/questions/39044/making-3d-object-from-a-svg-file
Import created 3d model into unity.
Use PNG to display the map on the phone and the hitboxes for collisions
*/

function writeOutput(processedJSON, fn){
    var jsonStr = JSON.stringify(processedJSON);

    fs.writeFile(fn, jsonStr);
}

function createJSON(rawJSON){
    var width = parseInt(rawJSON.svg.$.width);
    var height = parseInt(rawJSON.svg.$.width);

    var output = {width: width,
		  height: height,
		  map:[]};

    var main = rawJSON.svg.g[0];
    var lines = main.line;

    var line_width = parseInt(main.$["stroke-width"]);
    var half_width = line_width / 2;

    for (var i = 0; i < lines.length; i++) {
	var x1 = lines[i].$.x1;
	var y1 = lines[i].$.y1;
	var x2 = lines[i].$.x2;
	var y2 = lines[i].$.y2;

	var width, height, tl;
	
	if(x1 == x2){
	    width = line_width;
	    height = Math.abs(y1 - y2);
	    tl = [x1 - half_width,  Math.min(y1, y2)];
	    
	}else{
	    width = Math.abs(x1 - x2);
	    height = line_width;
	    tl = [Math.min(x1, x2), y1 - half_width];
	}

	obj = {
	    w: width,
	    h: height,
	    tl: tl,
	};

	output.map.push(obj);
    }

    writeOutput(output, "maze.json");

}

fs.readFile(__dirname + '/maze.svg', function(err, data){
    if (err) {
	throw err; 
    }
    var xml = data.toString();
    parseString(xml, function(err, result){
	if (err) {
	    throw err;
	}

	createJSON(result);
    });
});
