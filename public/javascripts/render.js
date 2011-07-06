game.render = {
    terrain:function() {
        console.log("render terrain")
        for(var y=0; y<game.camera.h; y++) {	
            for(var x=0; x<game.camera.w; x++) {
                //console.log(x + ", " + y)
                var mapX = game.camera.x+x > 0 ? game.camera.x+x : 0;
                var mapY = game.camera.y+y > 0 ? game.camera.y+y : 0;
                if(typeof game.map[mapX]=="undefined" || game.map[mapX][mapY]<=1) {
                    if(game.settings.rendermode=="canvas") {
                        game.dom.ctx.clearRect(x*games.sprites.w,y*games.sprites.h,games.sprites.w,games.sprites.h);
                    }
                } else {
                    if(game.map[mapX][game.camera.y+y]>=20 && game.map[mapX][mapY]<=27) { game.dom.ctx.clearRect(x*game.sprites.w,y*game.sprites.h,game.sprites.w,game.sprites.h); } 
                    if(typeof game.maptiles[map[mapX][mapY]] != "undefined") {
                        var tile = game.maptiles[map[mapX][mapY]].img;
                        game.dom.ctx.drawImage(tile,x*game.sprites.w,y*game.sprites.h,game.sprites.w,game.sprites.h);
                    }
                }
            }
        }
    },
    fixtures:function() {
        
    },
    players:function() {
        
    },
    npcs:function() {
        
    },
    items:function() {
        
    },
    water:function() {
        
    }
}