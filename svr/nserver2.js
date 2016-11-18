var io = require('socket.io')();
var fs = require('fs');
var SAT = require('sat');

var lobby = [];

var player_positions = {};

var player_nsp = io.of('/player');

var map_json = {};
fs.readFile('./maze.json', 'utf8', function(error, content) {
    var resp = "error"
    if (!error) {
	resp = content;
    }

    map_json = JSON.parse(content);
    
    init();
});

function game_update(){
    io.emit("game_update", player_positions);
    setTimeout(game_update, 100);
}

function init(){
  io.on('connection', function(socket){	
    
      socket.on('prep', function(){
	  console.log("got prep", player_positions);

	  socket.name =  "player" + lobby.length.toString();

	  lobby.push(socket.name);

	  var index = Math.min(lobby.length - 1, 7);
	  if(socket.name){
	      player_positions[socket.name] = map_json.spawn[index];
	  }
	      
	  console.log("test ", map_json.spawn[index]);
	  
          var tmp = {};
          tmp.name = socket.name;
          tmp.image = "data:image/png;base64,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";
          tmp.spawn = player_positions[socket.name];
          tmp.mapData = map_json;
        
          socket.emit('prep_resp', tmp);
      });

      socket.on('game_start', function(){
	  console.log("game start", player_positions);
	  socket.emit('game_start');
	  game_update(socket);
      });

      socket.on('player_update', function(coord){
	  if(!coord)
	      return;
	  
	  console.log("got player_update", coord, player_positions);
          var box0 = new SAT.Box(new SAT.Vector(coord[0], coord[1]), 10, 10).toPolygon();

          var response = new SAT.Response();

          var collided = false;
          
          Object.keys(player_positions).forEach(function(key) {
	      if(key != socket.name){
		  var pcoord = player_positions[key];
		  var box1 =  new SAT.Box(new SAT.Vector(pcoord[0], pcoord[1]), 10, 10).toPolygon();
		  if(SAT.testPolygonPolygon(box0, box1, response)){
		      collided = true;
		  }
	      }
          });
          
          if(collided){
	      console.log("Player-player collision!");
          }else{
	      if(socket.name)
		  player_positions[socket.name] = coord;
          }
      });
      
      socket.on('disconnect', function(){
          console.log(socket.name, "disconnected", lobby.length);
          for(var i=0; i<lobby.length; ++i){
              if(lobby[i] == socket.name){
		  lobby.splice(i, 1);
              }
          }
          console.log("disconnected after", lobby.length);
      });

  });

    io.listen(3002);
}
