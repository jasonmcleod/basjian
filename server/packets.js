var packets = {
    handle:function(client) {
        client.on('register',function(token) {
            console.log('handling register')
            player.register(token,client);
        });

        // player initiated events
        client.on('player.putme',function(data) {
            var p = player.findBySession(client.id);
            player.requestMove(p,data.x,data.y);
        });

        client.on('useonmap',function(data) {
            general.useOnMap(data.x,data.y)
        })

        // client.on('dom.click',function() {
        //     server.players[player.findBySession(client.id)].clicks++;
        //     client.emit('confirm',{clicked:true})
        // });
    }
}
exports.packets = packets;