assets = {
    needed:['maptiles','fixtures','world_fixtures','items','world_items','inventory_items','npcs','world_npcs','bank_items','encounters','world_shops'],
    loaded:[],
    register:function(what) {
        assets.loaded.push(what);
        console.log('Loaded asset: ' + assets.loaded.length + '/' + assets.needed.length + ' ' + what);
        if(assets.loaded.length == assets.needed.length) { 
            server.assets = assets;
            console.log("All set, waiting for players!");  
            server.assets_ready();
        }
    },
    fetch:function() {
        mysql.query('USE ' + config.db.database);
        mysql.query('SELECT * FROM maptiles ORDER BY id',function(err, results, fields) {	if (err) { throw err; }
            for(var row=0;row<results.length;row++) {
                server.maptiles[results[row].id] = {};
                for(var field in results[row]) {
                    server.maptiles[results[row].id][field] = results[row][field]
                }
            }
            assets.register('maptiles');
        });
        
        mysql.query('USE ' + config.db.database);
        mysql.query('SELECT * FROM fixtures ORDER BY id',function(err, results, fields) {	if (err) { throw err; }
            for(var row=0;row<results.length;row++) {
                server.fixtures[results[row].id] = {};
                for(var field in results[row]) {
                    server.fixtures[results[row].id][field] = results[row][field]
                }
            }
            assets.register('fixtures');
        });
        
        mysql.query('USE ' + config.db.database);
        mysql.query('SELECT * FROM world_fixtures ORDER BY id',function(err, results, fields) {	if (err) { throw err; }
            for(var row=0;row<results.length;row++) {
                server.world_fixtures[results[row].id] = {}
                for(var field in results[row]) {
                    server.world_fixtures[results[row].id][field] = results[row][field]
                }
            }
            assets.register('world_fixtures');
        });
        
        mysql.query('USE ' + config.db.database);
        mysql.query('SELECT * FROM items ORDER BY id',function(err, results, fields) {	if (err) { throw err; }
            for(var row=0;row<results.length;row++) {
                server.items[results[row].id] = {}
                for(var field in results[row]) {
                    server.items[results[row].id][field] = results[row][field]
                }
            }
            assets.register('items');
        });
        
        mysql.query('USE ' + config.db.database);
        mysql.query('SELECT * FROM world_items ORDER BY id',function(err, results, fields) {	if (err) { throw err; }
        for(var row=0;row<results.length;row++) {
                server.world_items[results[row].id] = {}
                for(var field in results[row]) {
                    server.world_items[results[row].id][field] = results[row][field]
                }
            }
            assets.register('world_items');
        });
        
        mysql.query('USE ' + config.db.database);
        mysql.query('SELECT * FROM inventory_items ORDER BY id',function(err, results, fields) {	if (err) { throw err; }
            for(var row=0;row<results.length;row++) {
                server.inventory_items[results[row].id] = {};
                for(var field in results[row]) {
                    server.inventory_items[results[row].id][field] = results[row][field]
                }
            }
            assets.register('inventory_items');
        });
        
        mysql.query('USE ' + config.db.database);
        mysql.query('SELECT * FROM bank_items ORDER BY id',function(err, results, fields) {	if (err) { throw err; }
            for(var row=0;row<results.length;row++) {
                server.inventory_items[results[row].id] = {};
                for(var field in results[row]) {
                    server.inventory_items[results[row].id][field] = results[row][field]
                }
            }
            assets.register('inventory_items');
        });
        
        mysql.query('USE ' + config.db.database);
        mysql.query('SELECT * FROM npcs ORDER BY id',function(err, results, fields) {	if (err) { throw err; }
            for(var row=0;row<results.length;row++) {
                server.npcs[results[row].id] = {};
                for(var field in results[row]) {
                    server.npcs[results[row].id][field] = results[row][field]
                }
                server.npcs[results[row].id].drops = {};
                mysql.query('USE ' + config.db.database);
                mysql.query('SELECT * FROM npcs_drops WHERE npc = ' + results[row].id + ' ORDER BY id',function(err, results, fields) {	if (err) { throw err; }
                    if(results.length>0) {
                        for(var row=0;row<results.length;row++) {
                            server.npcs[results[row].npc].drops[results[row].id] = {}
                            for(var field in results[row]) {
                                server.npcs[results[row].npc].drops[results[row].id][field] = results[row][field]
                            }
                        }
                    }
                });	
            }
            assets.register('npcs');
        });
        
        mysql.query('USE ' + config.db.database);
        mysql.query('SELECT * FROM world_shops ORDER BY id',function(err, results, fields) {	if (err) { throw err; }
            for(var row=0;row<results.length;row++) {
                server.world_shops[results[row].id] = {};	
                for(var field in results[row]) {
                    server.world_shops[results[row].id][field] = results[row][field]
                }
                var thisShop = results[row].id;
                mysql.query('USE ' + config.db.database);
                mysql.query('SELECT * FROM shops_items WHERE shop = ' + thisShop + ' ORDER BY id',function(err, results, fields) {	if (err) { throw err; }
                    server.world_shops[results[0].shop].items = {};
                    for(var row=0;row<results.length;row++) {
                        server.world_shops[results[row].shop].items[results[row].id] = {}
                        for(var field in results[row]) {
                            server.world_shops[results[row].shop].items[results[row].id][field] = results[row][field]
                        }
                    }
                });
            }
            assets.register('world_shops');
        });
        
        mysql.query('USE ' + config.db.database);
        mysql.query('SELECT * FROM world_npcs ORDER BY id',function(err, results, fields) {	if (err) { throw err; }
            for(var row=0;row<results.length;row++) {
                server.world_npcs[results[row].id] = {};
                for(var field in results[row]) {
                    server.world_npcs[results[row].id][field] = results[row][field]
                }
                npcs.spawn(results[row].id,results[row].npc,results[row].spawnX,results[row].spawnY,0);
                if(results[row].onTalk>'') {
                    server.world_npcs[results[row].id].onTalk = results[row].onTalk;
                }
            }
            assets.register('world_npcs');
        });
        
        mysql.query('USE ' + config.db.database);
        mysql.query('SELECT * FROM encounters WHERE active = 1 ORDER BY id',function(err, results, fields) {	if (err) { throw err; }
            for(var row=0;row<results.length;row++) {
                server.encounters[results[row].id] = {};
                for(var field in results[row]) {
                    server.encounters[results[row].id][field] = results[row][field]
                }
                server.encounters[results[row].id].spawnTime = server.encounters[results[row].id].interval*-1;
                var thisEncounter = results[row].id;
                mysql.query('USE ' + config.db.database);
                mysql.query('SELECT * FROM encounters_spawns WHERE encounter = ' + thisEncounter + ' ORDER BY id',function(err, results, fields) {	if (err) { throw err; }
                    server.encounters[results[0].encounter].spawns = {};
                    for(var row=0;row<results.length;row++) {
                        server.encounters[results[row].encounter].spawns[results[row].id] = {}
                        for(var field in results[row]) {
                            server.encounters[results[row].encounter].spawns[results[row].id][field] = results[row][field]
                        }
                    }
                    server.encounters[thisEncounter].living = 0;
                });
            }
            assets.register('encounters');
        });
    }
}
exports.assets = assets;