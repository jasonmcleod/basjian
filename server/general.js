var general = {
    distance:function(x1,y1,x2,y2) {
        return Math.sqrt(Math.abs(x1-x2)*Math.abs(x1-x2)+(Math.abs(y1-y2)*Math.abs(y1-y2)));
    },
    walkable:function(x,y) {
        // check for terrain blocks..
        if(server.maptiles[map[x][y]].block_walk) return false

        // check for players
        //...

        // check for npcs
        for(var n in server.world_npcs) {
            if(server.world_npcs[n].x == x && server.world_npcs[n].y == y) {

                console.log("no, npc in the way")
                return false;
            }
        }

        // check for fixtures
        for(var n in server.world_fixtures) {
            if(server.world_fixtures[n].x == x && server.world_fixtures[n].y == y && server.fixtures[server.world_fixtures[n].fixture].block_walk == 1) {

                console.log("no, fixture in the way " + server.fixtures[server.world_fixtures[n].fixture].block_walk)
                return false;
            }
        }

        return true;
    },
    identify:function(x,y) {
        // check for npcs
        for(var n in server.world_npcs) {
            if(server.world_npcs[n].x == x && server.world_npcs[n].y == y) {
                console.log('found npc')
                console.log(server.npcs[server.world_npcs[n].npc].name);
                return;
            }
        }

        // check for fixtures
        for(var n in server.world_fixtures) {
            if(server.world_fixtures[n].x == x && server.world_fixtures[n].y == y && server.fixtures[server.world_fixtures[n].fixture].block_walk) {
                console.log(server.fixtures[server.world_fixtures[n].fixture].name);
                return
            }
        }
    },
    useOnMap:function(x,y,player) {
        console.log('clicked on ' + x + ', ' + y)
        for(var fixture in server.world_fixtures) {
            if(server.world_fixtures[fixture].x == x && server.world_fixtures[fixture].y == y) {
                if(general.distance(server.world_fixtures[fixture].x,
                    server.world_fixtures[fixture].y,
                    server.players[player].x,
                    server.players[player].y) < 2) {
                    eval("var useCode = function(x,y,i,c) { " + server.fixtures[server.world_fixtures[fixture].fixture].onuse + "}");
                    useCode(x,y,fixture,player);
                }
            }
        }
    }
}
exports.general = general;