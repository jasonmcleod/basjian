var player = {
    hp:function(id) {
        return 100 // faked
    },
    findBySession:function(session) {
        for(var player in server.players) {
            if(server.players[player].sessionId==session) {
                return player;
            }
        }
        return false;
    },
    authenticate:function(username,password,success,failure) {
        mysql.query('USE ' + config.db.database + ';');
        mysql.query('SELECT * FROM accounts WHERE name = "' + username + '" AND password = "' + sha1.hex(password) + '"', function selectCb(err, results, fields) { if (err) { throw err; }
            if(results.length==1) {
                mysql.query('USE ' + config.db.database + ';');
                mysql.query('SELECT * FROM characters WHERE id = ' + results[0].character, function selectCb(err, results, fields) { if (err) { throw err; }
                    if(results.length==1) {
                        var record = results[0];
                        success(record.id);
                    }
                });
            } else {
                failure();
            }
        });
    },
    createToken:function(userID) {
         var token = sha1.hex(userID + (new Date().getTime()))
         mysql.query('USE ' + config.db.database + ';');
         mysql.query('UPDATE accounts SET token = "' + token + '" WHERE id = ' + userID, function selectCb(err, results, fields) { if (err) { throw err; }
            console.log("token set " + token)
         });
         return token;
    },
    register:function(token,client) {
         //query for a token
         mysql.query('SELECT * FROM accounts WHERE token = "' + token + '"', function selectCb(err, results, fields) { if (err) { throw err; }
            if(results.length==1) {
                
                var record = results[0];
                server.players[record.id] = {
                    //client:             client,
                    authtime:           new Date(),
                    connected:          true,
                    clicks:             0, //used for testing only
                    sessionId:          client.id,
                    id:                 record.id,
                    level:              levels.whatLevel(record.xp),
                    str:                record.str,
                    dex:                record.dex,
                    con:                record.con,
                    int:                record.int,
                    xp:                 record.xp,
                    name:               record.name,
                    status:             record.status,
                    criminal:           record.criminal,
                    x:                  record.x,
                    y:                  record.y,
                    hp:                 record.hp,
                    maxhp:              player.hp(record.id),
                    lastRegen:          0,
                    lastAttack:         0,
                    target:             0,
                    attributePoints:    record.attributePoints,
                    lastSave:           SAVE_INTERVAL,
                    loginTime:          (new Date()).getTime(),
                    lastTeleportCheck:  {x:0,y:0,interval:0,teleport:0},
                }
                //connections[record.id] = new connection();
                connections[record.id] = {
                    client:client
                }
                
                console.log(server.players)
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
                
                var youare = server.players[record.id];
                mysql.query("USE basjian;");
                mysql.query("SELECT * FROM inventory_items WHERE `character` = " + record.id, function selectCb(err, results, fields) {	if (err) { throw err; }
                    server.players[record.id].inventory = {};
                    for(var r=0;r<results.length;r++) {
                        server.players[record.id].inventory[results[r].id] =  {}
                        for(var field in results[r]) {
                            server.players[record.id].inventory[results[r].id][field] = results[r][field]
                        }
                    }
                    mysql.query("USE basjian;");
                    mysql.query("SELECT * FROM bank_items WHERE `character` = " + record.id, function selectCb(err, results, fields) {	if (err) { throw err; }
                        server.players[record.id].bank = {};
                        for(var r=0;r<results.length;r++) {
                            server.players[results[0].character].bank[results[r].id] = {}
                            for(var field in results[r]) {
                                server.players[results[0].character].bank[results[r].id][field] = results[r][field]
                            }
                        }
                    });                
                });
            }
        });
     },
     sendVitals:function(client) {        
        client.send({
            youare:youare,
            inventory:{items:server.players[record.id].inventory},
            bank:{items:server.players[record.id].bank},
            world_gameitems:{items:server.world_items}
//            io.broadcast({joined:{user:record.name,total:require("./functions").players_total()}});			
//            console.log("User logged in: " + record.name);
        });
    }
}
exports.player = player;