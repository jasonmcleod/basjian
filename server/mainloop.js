var mainloop = function() {

    sio.sockets.emit('data',{
        players:server.players
    })

}
exports.mainloop = mainloop