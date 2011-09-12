game.player = {
    stunned:false,
    dead:false,
    criminal:false,
    handleInitialData:function(data) {
        console.log(data)
        game.me = data.id;
    },
    location:function(p,x,y) {
        game.players[p].x = x;
        game.players[p].y = y;
        if(p==game.me) {
            //game.render.terrain();
        }
    },
    checkMovement:function() {
        if(typeof game.players[game.me] == "undefined" || !game.connected || game.player.stunned) { console.log('cant move'); return false; }
        var moved = false;
        var wasd = false;
        var requestX = game.players[game.me].x;
        var requestY = game.players[game.me].y;
        // arrow keys
        if(input.keyboard[38]) { if(game.tileWalkable(game.players[game.me].x,game.players[game.me].y-1)) { requestY = game.players[game.me].y-1; moved = "up"; } }; // up
        if(input.keyboard[40]) { if(game.tileWalkable(game.players[game.me].x,game.players[game.me].y+1)) { requestY = game.players[game.me].y+1; moved = "down"; } }; // down
        if(input.keyboard[37]) { if(game.tileWalkable(game.players[game.me].x-1,game.players[game.me].y)) { requestX = game.players[game.me].x-1; moved = "left"; } }; // left
        if(input.keyboard[39]) { if(game.tileWalkable(game.players[game.me].x+1,game.players[game.me].y)) { requestX = game.players[game.me].x+1; moved = "right"; } }; // right
        // wasd
        if(input.keyboard[87]) { if(game.tileWalkable(game.players[game.me].x,game.players[game.me].y-1)) { requestY = game.players[game.me].y-1; moved = "up"; wasd = true;} };
        if(input.keyboard[83]) { if(game.tileWalkable(game.players[game.me].x,game.players[game.me].y+1)) { requestY = game.players[game.me].y+1; moved = "down"; wasd = true;} };
        if(input.keyboard[65]) { if(game.tileWalkable(game.players[game.me].x-1,game.players[game.me].y)) { requestX = game.players[game.me].x-1; moved = "left"; wasd = true;} };
        if(input.keyboard[68]) { if(game.tileWalkable(game.players[game.me].x+1,game.players[game.me].y)) { requestX = game.players[game.me].x+1; moved = "right"; wasd = true;} };

        if(moved) {
            //game.bank.close();
            //game.shop.close();
            if($(".ui-draggable-dragging").length==0) {
                if((wasd&&$("input:focus").length==0) || !wasd) { // arrow keys, or wasd (without being focused on the input field)
                    //$(".ui-draggable").draggable("revert");
                    //game.render.viewport();
                    game.socket.emit("player.putme",{x:requestX,y:requestY,input:true})
                }
            }
        }
    },
    nameColor:function(status) {
        return 'green'
    }
}