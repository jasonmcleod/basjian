var packets = {
    handle:function(client) {
        client.on('register',function(token) {
            player.register(token,client);
            
        });
        client.on('dom.click',function() {            
            console.log(client.id)
            server.players[player.findBySession(client.id)].clicks++;
            client.emit('confirm',{clicked:true})
        });
    }
}
exports.packets = packets;