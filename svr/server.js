var io = require('socket.io')();
io.on('connection', function(socket){
    socket.userid = null;
		
    socket.on('disconnect', function(){
	console.log('user disconnected');
	socket.userid = null;
    });

});
io.listen(3000);
