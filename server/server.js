var sha1 = require('./lib/sha1/sha1')
var player = require('./player').player
server = {
    players:{},
    npcs:{},
    items:{}
}
exports.server = server;