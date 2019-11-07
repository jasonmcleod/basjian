var player = {
    hp:function(id) {
        return 100 // faked
    },
    armor:function(p) {
        var armor = 0;
        armor+=player.shield(p)>0 ? server.items[player.shield(p)].protection : 0;
        armor+=player.chest(p)>0 ? server.items[player.chest(p)].protection : 0;
        armor+=player.helmet(p)>0 ? server.items[player.helmet(p)].protection : 0;
        return armor;
    },
    weapon:function(p) {
        if(typeof server.players[p] != "undefined") {
            for(var i in server.players[p].inventory) {
                if(server.players[p].inventory[i].equipped==2) { return server.players[p].inventory[i].item; }
            }
        }
        return 9 // bare hands!
    },

    shield:function(p) {
        if(typeof server.players[p] != "undefined") {
            for(var i in server.players[p].inventory) {
                if(server.players[p].inventory[i].equipped==3) { return server.players[p].inventory[i].item; }
            }
        }
    },

    chest:function(p) {
        if(typeof server.players[p] != "undefined") {
            for(var i in server.players[p].inventory) {
                if(server.players[p].inventory[i].equipped==4) { return server.players[p].inventory[i].item; }
            }
        }
    },

    helmet:function(p) {
        if(typeof server.players[p] != "undefined") {
            for(var i in server.players[p].inventory) {
                if(server.players[p].inventory[i].equipped==5) { return server.players[p].inventory[i].item; }
            }
        }
    },
    blockPercent:function(p) {
        var armor = player.armor(p);
        return armor / (armor + 100);
    },
    findBySession:function(session) {
        for(var player in server.players) {
            if(server.players[player].sessionId==session) {
                return player;
            }
        }
        return false;
    },
    requestMove:function(p,x,y) {

        if(!server.players[p]) return false;

        var pos = {x:0, y:0}

        if(x > server.players[p].x) pos.x = 1;
        if(x < server.players[p].x) pos.x =-1;
        if(y > server.players[p].y) pos.y = 1;
        if(y < server.players[p].y) pos.y =-1;

        if(!general.walkable(server.players[p].x + pos.x,server.players[p].y + pos.y)) return false;

        // made it here, set them and tell them they can move!
        //server.players[p].x += pos.x;
        //server.players[p].y += pos.y;

        player.move(p,server.players[p].x += pos.x,server.players[p].y += pos.y);

    },
    move:function(p,x,y) {

        server.players[p].x = x;
        server.players[p].y = y;

        player.sendPosition(p);
    },
    sendPosition:function(p) {
        server.connections[p].client.emit('data',{
            put:{
                type:TYPE_PLAYER,
                id:p,
                x:server.players[p].x,
                y:server.players[p].y
            }
        })
    },
    authenticate:function(username,password,success,failure) {
        mysql.query('USE ' + config.db.database + ';');
        mysql.query('SELECT * FROM account WHERE name = "' + username + '" AND password = "' + sha1.hex(password) + '"', function selectCb(err, results, fields) { if (err) { throw err; }
            if(results.length==1) {
                //mysql.query('USE ' + config.db.database + ';');
                //mysql.query('SELECT * FROM characters WHERE id = ' + results[0].character, function selectCb(err, results, fields) { if (err) { throw err; }
                //    if(results.length==1) {
                        var record = results[0];
                        success(record.id);
                        console.log('login success for user ' + record.id)
                //    }
                //});
            } else {
                console.log('login failure')
                failure();
            }
        });
    },
    createToken:function(userID) {
         var token = Math.random()*10000;
         console.log('new token: ' + token + ' for user ' + userID)
         mysql.query('USE ' + config.db.database + ';');
         mysql.query('UPDATE account SET token = "' + token + '" WHERE id = ' + userID, function selectCb(err, results, fields) { if (err) { throw err; }
            console.log("token set " + token)
         });
         return token;
    },
    register:function(token,client) {
         //query for a token
         console.log('register ' + token)
         mysql.query('SELECT * FROM account WHERE token = "' + token + '"', function selectCb(err, results, fields) { if (err) { throw err; }
            if(results.length==1) {
                mysql.query('SELECT * FROM character WHERE id = ' + results[0].character, function selectCb(err, results, fields) { if (err) { throw err; }
                    console.log('\n\n\n\n\n\n\n\n')
                    console.warn(results[0]);
                    console.log('\n\n\n\n\n\n\n\n')
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
                        server.connections[record.id] = {
                            client:client
                        }

                        client.emit('assets',{
                            players:            server.players,
                            maptiles:           server.maptiles,
                            fixtures:           server.fixtures,
                            world_fixtures:     server.world_fixtures,
                            items:              server.items,
                            world_items:        server.world_items,
                            npcs:               server.npcs,
                            world_npcs:         server.world_npcs
                        });

                        var youare = server.players[record.id];
                        mysql.query("USE basjian;");
                        mysql.query("SELECT * FROM iteminstance WHERE `owner` = " + record.id, function selectCb(err, results, fields) {  if (err) { throw err; }
                            server.players[record.id].inventory = {};
                            for(var r=0;r<results.length;r++) {
                                server.players[record.id].inventory[results[r].id] =  {}
                                for(var field in results[r]) {
                                    server.players[record.id].inventory[results[r].id][field] = results[r][field]
                                }
                            }
                            // mysql.query("USE basjian;");
                            // mysql.query("SELECT * FROM bank_items WHERE `character` = " + record.id, function selectCb(err, results, fields) {  if (err) { throw err; }
                            //     server.players[record.id].bank = {};
                            //     for(var r=0;r<results.length;r++) {
                            //         server.players[results[0].character].bank[results[r].id] = {}
                            //         for(var field in results[r]) {
                            //             server.players[results[0].character].bank[results[r].id][field] = results[r][field]
                            //         }
                            //     }
                            // });
                            //console.log(youare)
                            client.emit('initialPlayerData',youare);
                        });

                        sio.sockets.emit('data',{
                            add:{
                                player: {
                                    id:record.id,
                                    x:record.x,
                                    y:record.y
                                }
                            }
                        })

                    }
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
    },
    useOnMap:function(x,y,p) {
        var thisPlayer = require("./functions").findPlayerBySession(client.sessionId);
        var data = msg.useonmap
        for(var fixture in world_fixtures) {
            if(world_fixtures[fixture].x == data.x && world_fixtures[fixture].y == data.y) {
                if(require("./functions").distance(world_fixtures[fixture].x,world_fixtures[fixture].y,players[thisPlayer].x,players[thisPlayer].y) < 2) {
                    eval("var useCode = function(x,y,i,c) { " + fixtures[world_fixtures[fixture].fixture].onuse + "}");
                    useCode(data.x,data.y,fixture,client);
                }
            }
        }
        for(var npc in world_npcs) {
            if(world_npcs[npc].x == data.x && world_npcs[npc].y == data.y && typeof players[thisPlayer] != "undefined") {
                if(require("./functions").distance(world_npcs[npc].x,world_npcs[npc].y,players[thisPlayer].x,players[thisPlayer].y) < 5) {
                    eval("var useCode = function(x,y,c) { " + world_npcs[npc].onTalk + "}");
                    useCode(data.x,data.y,client);
                    if(npcs[world_npcs[npc].npc].banker==1) {
                        client.send({openbank:{items:players[thisPlayer].bank}});
                    }
                    console.log(npcs[world_npcs[npc].npc])
                    if(npcs[world_npcs[npc].npc].merchant!=0) {
                        openShop(client,npcs[world_npcs[npc].npc].runsShop);
                    }
                }
            }
        }
    }

}
exports.player = player;