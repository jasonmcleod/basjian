var npcs = {
    spawn:function(id,npc,x,y,encounter) {
        console.log('spawning NPC \t id:' + id + "\t npc:" + npc + "\t x:" + x + "\t y:" + y + "\t encounter:" + encounter)
        server.world_npcs[id] = {}
        server.world_npcs[id].wanderRange = 5;
        server.world_npcs[id].id = id;
        server.world_npcs[id].npc = npc;
        server.world_npcs[id].target = 0;
        server.world_npcs[id].lastMove = 0;
        server.world_npcs[id].lastAttack = 0;
        server.world_npcs[id].hp = general.randomRange(server.npcs[npc].minHealth,server.npcs[npc].maxHealth);
        server.world_npcs[id].maxhp = server.world_npcs[id].hp;
        server.world_npcs[id].encounter = encounter;
        server.world_npcs[id].x = x;
        server.world_npcs[id].y = y;
        server.world_npcs[id].spawnX = x;
        server.world_npcs[id].spawnY = y;
        server.world_npcs[id].stunned = false;
    },
    findTarget:function(n) {
        if(server.npcs[server.world_npcs[n].npc].hostile==1) {
            var found = general.findNearestPlayer(server.world_npcs[n].x,server.world_npcs[n].y);
            if(found>0) {
                console.log('set target to ' + found)
                server.world_npcs[n].target = found
                server.world_npcs[n].targetType = server.TYPE_PLAYER;
            }
        }
        if(server.npcs[server.world_npcs[n].npc].guard==1) {
            var foundNpc = general.findNearestNpc(server.world_npcs[n].x,server.world_npcs[n].y);
            var foundCrim = general.findNearestCriminal(server.world_npcs[n].x,server.world_npcs[n].y);
            server.world_npcs[n].target = 0;
            if(foundNpc>0) {
                server.world_npcs[n].target = foundNpc
                server.world_npcs[n].targetType = server.TYPE_NPC;
            }
            if(foundCrim>0) {
                server.world_npcs[n].target = foundCrim
                server.world_npcs[n].targetType = server.TYPE_PLAYER;
            }
        }
    },
    seekTarget:function(n) {
        if(typeof server.world_npcs[n] == "undefined") { return false; }
        var theTarget = server.world_npcs[n].targetType == server.TYPE_PLAYER ? server.players[server.world_npcs[n].target] : server.world_npcs[server.world_npcs[n].target]
        if(typeof theTarget == "undefined") return false;
        var targetX = server.world_npcs[n].x;
        var targetY = server.world_npcs[n].y;
        if(theTarget.x<server.world_npcs[n].x) { targetX = server.world_npcs[n].x - 1; }
        if(theTarget.x>server.world_npcs[n].x) { targetX = server.world_npcs[n].x + 1; }
        if(theTarget.y<server.world_npcs[n].y) { targetY = server.world_npcs[n].y - 1; }
        if(theTarget.y>server.world_npcs[n].y) { targetY = server.world_npcs[n].y + 1; }
        if(!server.world_npcs[n].stunned) {
            if(!general.walkable(targetX,targetY)) {
                if(server.world_npcs[n].x-theTarget.x>1 || server.world_npcs[n].x-theTarget.x <-1) {
                    targetY = server.world_npcs[n].y + general.randomRange(-1,1);
                }
                if(server.world_npcs[n].y-theTarget.y>1 || server.world_npcs[n].y-theTarget.y <-1) {
                    targetX = server.world_npcs[n].x + general.randomRange(-1,1);
                }
            }
            if(general.walkable(targetX,server.world_npcs[n].y)) {
                server.world_npcs[n].x = targetX;
                server.world_npcs[n].lastMove = general.now();
            }
            if(general.walkable(server.world_npcs[n].x,targetY)) {
                server.world_npcs[n].y = targetY;
                server.world_npcs[n].lastMove = general.now();
            }
        }
    },
    attackTarget:function(n) {
        console.log('attack')
        if(server.world_npcs[n].lastAttack < general.now() - server.npcs[server.world_npcs[n].npc].attackSpeed) {
            var damage = general.randomRange(server.npcs[server.world_npcs[n].npc].minDamage,server.npcs[server.world_npcs[n].npc].maxDamage);

            if(general.randomRange(0,100) < server.npcs[server.world_npcs[n].npc].hitChance) {
                if(server.world_npcs[n].targetType == server.TYPE_PLAYER) {
                    var rawDamage = damage;
                    damage = Math.ceil(damage - (damage * player.blockPercent(server.world_npcs[n].target)));
                    console.log("Damage delt: " + rawDamage + " / " + damage);
                    server.players[server.world_npcs[n].target].hp-=damage;
                    server.world_npcs[n].lastAttack = general.now();
                    if(server.players[server.world_npcs[n].target].hp<=0) {
                        player.die(server.world_npcs[n].target);
                        if(server.world_npcs[n].encounter==0) {
                            setTimeout(function(target) {
                                for(var n in world_npcs) {
                                    if(server.world_npcs[n].target<=0) {
                                        server.world_npcs[n].target = 0;
                                        server.world_npcs[n].x = server.world_npcs[n].spawnX;
                                        server.world_npcs[n].y = server.world_npcs[n].spawnY;
                                    }
                                }
                            },1000,server.world_npcs[n].target);
                        }
                        server.world_npcs[n].target = npc.findTarget(n);
                        sio.sockets.emit('showdamage', {targetType:server.TYPE_PLAYER, damage:damage, attacker:n, target:server.world_npcs[n].target, attackerType:server.TYPE_NPC});
                    } else {
                        sio.sockets.emit('showdamage', {targetType:server.TYPE_PLAYER, damage:damage, attacker:n, target:server.world_npcs[n].target, attackerType:server.TYPE_NPC});
                    }
                }
                if(server.world_npcs[n].targetType == server.TYPE_NPC) {
                    console.log(damage)
                    if(typeof server.world_npcs[server.world_npcs[n].target] != "undefined") {
                        server.world_npcs[server.world_npcs[n].target].target = n;
                        server.world_npcs[server.world_npcs[n].target].targetType = server.TYPE_NPC;
                        server.world_npcs[server.world_npcs[n].target].hp-=damage;
                        server.world_npcs[n].lastAttack = general.now();
                        if(server.world_npcs[server.world_npcs[n].target].hp<=0) {
                            npcs.die(server.world_npcs[n].target);
                            setTimeout(function(target) {
                                for(var n in server.world_npcs) {
                                    if(server.world_npcs[n].target<=0) {
                                        server.world_npcs[n].target = 0;
                                        server.world_npcs[n].x = server.world_npcs[n].spawnX;
                                        server.world_npcs[n].y = server.world_npcs[n].spawnY;
                                    }
                                }
                            },1000,server.world_npcs[n].target);
                            sio.sockets.emit('showdamage', {targetType:server.TYPE_NPC, target:server.world_npcs[n].target, damage:damage, attacker:n, attackerType:server.TYPE_NPC});
                        } else {
                            sio.sockets.emit('showdamag', {targetType:server.TYPE_NPC, target:server.world_npcs[n].target, damage:damage, attacker:n, attackerType:server.TYPE_NPC});
                        }
                    }
                }
            }
        }
    },
    move:function() {
        var now = general.now();
        for(var n in server.world_npcs) {
            //console.log(n)
            if(server.world_npcs[n].target>0) {
                //console.log(n + ' has a target')
                if(server.world_npcs[n].targetType==server.TYPE_NPC) {
                    if(typeof server.world_npcs[server.world_npcs[n].target] != "undefined") {
                        if(general.distance(server.world_npcs[n].x,server.world_npcs[n].y,server.world_npcs[server.world_npcs[n].target].x,server.world_npcs[server.world_npcs[n].target].y) < server.VIEW_DISTANCE) {
                            if(general.isTouching(server.world_npcs[n].x,server.world_npcs[n].y,server.world_npcs[server.world_npcs[n].target].x,server.world_npcs[server.world_npcs[n].target].y)) {
                                console.log('touching npc')
                                if(server.world_npcs[n].lastAttack < now - server.npcs[server.world_npcs[n].npc].attackSpeed) {
                                    npcs.attackTarget(n);
                                }
                            } else {
                                npcs.findTarget(n);
                                npcs.seekTarget(n);
                            }
                        } else {
                            npcs.findTarget(n);
                        }
                    } else {
                        npcs.findTarget(n);
                    }
                }
                if(server.world_npcs[n].targetType==server.TYPE_PLAYER) {
                    if(typeof server.players[server.world_npcs[n].target]  != "undefined") {
                        if(general.distance(server.world_npcs[n].x,server.world_npcs[n].y,server.players[server.world_npcs[n].target].x,server.players[server.world_npcs[n].target].y) < server.VIEW_DISTANCE) {
                            if(general.isTouching(server.world_npcs[n].x,server.world_npcs[n].y,server.players[server.world_npcs[n].target].x,server.players[server.world_npcs[n].target].y)) {
                                console.log('touching player')

                                npcs.attackTarget(n);
                            } else {
                                if(server.world_npcs[n].lastMove < now - server.npcs[server.world_npcs[n].npc].walkSpeed) {
                                    npcs.seekTarget(n);
                                }
                            }
                        } else {
                            npcs.findTarget(n);
                        }
                    } else {
                        npcs.findTarget(n);
                    }
                }
            } else {
                if(server.npcs[server.world_npcs[n].npc].hostile==1 || server.npcs[server.world_npcs[n].npc].guard==1) {
                    npcs.findTarget(n);
                }
            }
        }
    },
    die:function(n) {
        if(server.world_npcs[n].encounter==0) { // permenent npc
            setTimeout(function(i,n,x,y,e) {
                npc.spawn(i,n,x,y,e);
            }, 1000, n, server.world_npcs[n].npc, server.world_npcs[n].spawnX, server.world_npcs[n].spawnY, 0)
        }
        if(server.world_npcs[n].targetType==server.TYPE_PLAYER){
            for(var drop in server.npcs[world_npcs[n].npc].drops) {
                if(general.randomRange(0,100) < server.npcs[server.world_npcs[n].npc].drops[drop].chance) {
                    var count = general.randomRange(server.npcs[server.world_npcs[n].npc].drops[drop].valueMin, server.npcs[server.world_npcs[n].npc].drops[drop].valueMax);
                    general.insertWorldItem(server.npcs[server.world_npcs[n].npc].drops[drop].item, count, server.world_npcs[n].x, server.world_npcs[n].y);
                }
            }
        }
        for(var p in server.players) {
            if(server.players[p].target==n) {
                server.players[p].target=0;
                //connections[p].client.send({target:{type:1,target:0}});
            }
        }
        sio.sockets.emit('dropnpc',{npc:n})
        delete server.world_npcs[n]
    }
}

exports.npcs = npcs;