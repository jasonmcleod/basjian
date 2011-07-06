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