game.handle_packets = function() {
    
    game.socket.on('auth',function(data) {
        console.log('auth')
        game.authenticate(data);
    });
    
    game.socket.on("confirm",function(data) {
        console.log(data);
    }); 
    
    game.socket.on('assets',function(data) {
        console.log(data);
        game.assets.register(data)
    })
    
}