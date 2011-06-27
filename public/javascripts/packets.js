game.handle_packets = function() {
    game.socket.on('auth',function(data) {
        game.authenticate(data);
    });
    
    game.socket.on("confirm",function(data) {
        console.log(data)
        console.log("fuck yeah")
    }); 
}