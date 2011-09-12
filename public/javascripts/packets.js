game.handle_packets = function() {

    game.socket.on('initialPlayerData',function(data) {
        game.player.handleInitialData(data);
    });

//    game.socket.on('player.location',function(data) {
//        game.player.location(data.p,data.x,data.y)
//    });

    game.socket.on("confirm",function(data) {
        console.log(data);
    });

    game.socket.on('assets',function(data) {
        console.log(data);
        game.assets.register(data)
    })


    game.socket.on('data',function(data) {
        if('put' in data) {
            if(data.put.type == TYPE_PLAYER) {
                game.player.location(parseInt(data.put.id),data.put.x,data.put.y)
            }
        }
        if('add' in data) {
            if('player' in data.add) {

            }
        }
        if('players' in data) {
            game.players = data.players
        }
    })
}