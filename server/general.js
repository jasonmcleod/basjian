var general = {
    walkable:function(x,y) {
        // check for terrain blocks..
        if(server.maptiles[map[x][y]].block_walk) return false

        // check for players
        //...

        // check for fixtures
        for(var n in server.world_fixtures) {
            if(server.world_fixtures[n].x == x && server.world_fixtures[n].y == y && server.fixtures[server.world_fixtures[n].fixture].block_walk) {

                console.log("no, fixture in the way")
                return false;
            }
        }

        return true;
    }
}
exports.general = general;