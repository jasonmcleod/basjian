var mainloop = function() {

    npcs.move();

    sio.sockets.emit('data',{
        players:server.players,
        world_npcs:server.world_npcs
    })

}
exports.mainloop = mainloop