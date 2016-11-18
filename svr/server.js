var dummy = true;
var vr_ready = false;
var io = require('socket.io')();
var fs = require('fs');
var qt = require('quadtree.js');
var SAT = require('sat');

const quadtree = new qt.Quadtree({
    x: 0,
    y: 0,
    width:1284,
    height:1284
});

var player_lobby = {};
var state = "";
var lobby = [];
var counter = 0;

var player_positions = {};
var vr_info = {
    blockers: {}
};

var player_nsp = io.of('/player');

var map_json = {};
fs.readFile('./maze.json', 'utf8', function(error, content) {
    var resp = "error"
    if (!error) {
	resp = content;
    }

    map_json = JSON.parse(content);

    for(var i=0; i<map_json.map.length; ++i){
	var element = map_json.map[i];
	quadtree.insert({
	    x: element.tl[0],
	    y: element.tl[1],
	    width: element.w,
	    height: element.h,
	}, new SAT.Box(new SAT.Vector(element.tl[0], element.tl[1]), element.w, element.h).toPolygon());
    }
    
    init();
});

function game_update(){
    io.emit("game_update", player_positions);
    setTimeout(game_update, 100);
}

function init(){
    player_nsp.on('connection', function(socket){
	socket.name =  "player" + counter.toString();
	player_lobby[socket.id] = socket.name;
	++counter;

	lobby.push(socket.name);
	io.emit("lobby_update", {
	    lobby: lobby
	});

	var index = Math.min(player_positions.length - 1, 7);
	player_positions[socket.name] = map_json.spawn[index];
	
	console.log("got player connection", socket.name);

	socket.on('bundle_request', function(){
	    console.log("got bundle request");
	    fs.readFile('./new.jsbundle', 'utf8', function(error, content) {
		var resp = "error"
		if (!error) {
		    resp = content;
		}
		socket.emit("bundle_resp", resp);
	    });
	});

	socket.on('bundle_name', function(){
	    socket.emit('bundle_name_resp', "Flatland");
	});

	socket.on('prep', function(){
	    var tmp = map_json;
	    tmp.name = socket.name;
	    socket.emit('prep_resp', tmp);
	});

	socket.on('player_update', function(coord){
	    var orig_coord = player_positions[socket.name];
	    var lowx = Math.min(orig_coord[0], coord[0]);
	    var lowy = Math.min(orig_coord[1], coord[1]);
	    var w = Math.abs(orig_coord[0] - orig_coord[0]);
	    var h =  Math.abs(orig_coord[1] - orig_coord[1]);
	    
	    var potentials = quadtree.queryWithBoundingBox({
		x: lowx, y: lowy,
		width: w,
		height: h,
	    });

	    var box = new SAT.Box(new V(lowx, lowy), w, h).toPolygon();

	    var open = true;
	    
	    for(var i = 0; i < potentials.length; ++i){
		if(testPolygonPolygon(potentials[i], box)){
		    collison = false;
		    break;
		}
	    }
	    
	    if(open){
		player_positions[socket.name] = JSON.parse(coord);
	    }else{
		console.log("Player-wall collision!");
	    }
	});

	socket.on('disconnect', function(){
	    for(var i=0; i<lobby.length; ++i){
		if(lobby[i] == socket.name){
		    lobby.splice(i, 1);
		}
	    }
	});

    });

    
    io.on('connection', function(socket){

	console.log("got connection");

	socket.emit("vr_attempt");
	
	socket.on('vr_connect', function(){
	    console.log("got vr connection", socket.id);
	    socket.name =  "vr";
	    player_lobby[socket.id] = socket.name;
	    
	    var id =  player_lobby[socket.id];
	    lobby.push(id);

	    io.emit("lobby_update", {
		lobby: lobby
	    });
	});
	
	socket.on('vr_ready', function(){
	    state = "lobby";
	    player_nsp.emit("lobby_state");
	});

	socket.on('vr_start', function(){
	    state = "game";
	    player_nsp.emit("game_state");
	    setTimeout(game_update, 100);
	});

	socket.on('vr_blocker_update', function(data){
	    vr_info.blockers = JSON.parse(data);
	});

	socket.on('disconnect', function(){
	    if(socket.name == "vr"){
		console.log("lost vr player!!!!");
		for(var i=0; i<lobby.length; ++i){
		    if(lobby[i] == socket.name){
			lobby.splice(i, 1);
		    }
		}
	    }
	});
    });

    io.listen(3000);

    if(dummy){
	var http = require('http');
	http.createServer(function (request, response) {
	    fs.readFile('./dummy.html', function(error, content) {
		if (error) {
		    response.writeHead(500);
		    response.end();
		} else {
		    response.writeHead(200, { 'Content-Type': 'text/html' });
		    response.end(content, 'utf-8');
		}
	    });
	}).listen(80);
	
	console.log('Server running at http://127.0.0.1:80/');
    }
}
