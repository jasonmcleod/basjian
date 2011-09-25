var packets = {
    handle:function(client) {
        var thisPlayer = player.findBySession(client.id);

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
            var p = player.findBySession(client.id);
            general.useOnMap(data.x,data.y,p)
        })

        client.on('identify',function(data) {
            var p = player.findBySession(client.id);
            general.identify(data.x,data.y,p)
        })
        // client.on('dom.click',function() {
        //     server.players[player.findBySession(client.id)].clicks++;
        //     client.emit('confirm',{clicked:true})
        // });
    }
}
exports.packets = packets;