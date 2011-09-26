var encounters = {
    spawnAll:function () {
        var now = (new Date()).getTime();

        console.log('spawing all initial npcs')
        for(var e in server.encounters) {

        }
    },
    spawn:function(e) {
        var now = (new Date()).getTime();

        if(server.encounters[e].spawnTime < now - server.encounters[e].interval && encounters.living(e) < server.encounters[e].maxNpcs) {
            server.encounters[e].spawnTime = now;
            console.log('encounter ' + e + ' spawns: ' + server.encounters[e].spawns)
            for(var n in server.encounters[e].spawns) {
                for(var c=0;c<general.randomRange(server.encounters[e].spawns[n].countMin,server.encounters[e].spawns[n].countMax);c++) {
                    var spawned = false;
                    var spawnX = general.randomRange(server.encounters[e].x,server.encounters[e].x+server.encounters[e].width);
                    var spawnY = general.randomRange(server.encounters[e].y,server.encounters[e].y+server.encounters[e].height);
                    if(general.walkable(spawnX,spawnY)) {
                        npcs.spawn(now+c,server.encounters[e].spawns[n].npc,spawnX,spawnY,e);
                        spawned = true
                        if(spawned) {
                            console.log('spawned npc')
                            server.encounters[e].living++;
                        }
                    } else {
                        //console.log("blocked from spawn");
                    }
                }
            }
        }
    },
    living:function(e) {
        var total = 0;
        for(var n in server.world_npcs) {
            if(server.world_npcs[n].hp>0 && server.world_npcs[n].encounter==e) {
                total++
            }
        }
        return total;
    }
}
exports.encounters = encounters;