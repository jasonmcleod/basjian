var player = require('./player').player;
var packets = {
    handle:function(client) {
        client.on('register',function(token) {
            player.register(token,client)
        });
        client.on('dom.click',function() {
            server.players[client.id].clicks++;
            console.log(server)
            client.emit("confirm",{clicked:true})
        });
    }
}
exports.packets = packets;