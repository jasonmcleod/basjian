//var sha1 = require('./lib/sha1/sha1');
//var player = require('./player').player;
server = {
    players:{},
    maptiles:{},
    fixtures:{},
    world_fixtures:{},
    items:{},
    world_items:{},
    inventory_items:{},
    npcs:{},
    world_npcs:{},
    bank_items:{},
    encounters:{},
    world_shops:{},
    assets_ready:function() {
        console.log('ready!')
    }
}
exports.server = server;