//var player = require('./player').player;
var packets = {
    handle:function(client) {
        client.on('register',function(token) {
            player.register(token,client);
            client.emit('assets',{
                players:            server.players,
                maptiles:           server.maptiles,
                fixtures:           server.fixture,
                world_fixtures:     server.world_fixtures,
                items:              server.items,
                world_items:        server.world_items,
                npcs:               server.npcs,
                world_npcs:         server.world_npcs
            });
        });
        client.on('dom.click',function() {
            server.players[client.id].clicks++;
            client.emit('confirm',{clicked:true})
        });
    }
}
exports.packets = packets;