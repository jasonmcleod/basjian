game.render = {
    terrain:function() {
        if(game.players[game.me]) {
            game.camera.x = game.players[game.me].x - Math.round((game.camera.w-1)/2);
            game.camera.y = game.players[game.me].y - Math.round((game.camera.h-1)/2);
        }
        for(var y=0; y<game.camera.h; y++) {
            for(var x=0; x<game.camera.w; x++) {
                var mapX = game.camera.x+x > 0 ? game.camera.x+x : 0;
                var mapY = game.camera.y+y > 0 ? game.camera.y+y : 0;
                if(typeof game.map[mapX]=="undefined" || game.map[mapX][mapY]<=1) {
                    game.dom.ctx.clearRect(x*game.sprites.w,y*game.sprites.h,game.sprites.w,game.sprites.h);
                } else {
                    if(game.map[mapX][mapY]>=20 && game.map[mapX][mapY]<=27) {
                        game.dom.ctx.clearRect(x*game.sprites.w,y*game.sprites.h,game.sprites.w,game.sprites.h);
                    }
                    if(typeof game.maptiles[map[mapX][mapY]] != "undefined") {
                        var tile = game.maptiles[map[mapX][mapY]].img;
                        game.dom.ctx.drawImage(tile,x*game.sprites.w,y*game.sprites.h,game.sprites.w,game.sprites.h);
                    }
                }
            }
        }
    },
    minimap:function() {
        //$("#minimap_img").css({left:((camera.x*-1)+81),top:((camera.y*-1)+76)})
    },
    fixtures:function() {
        for(var fixture in game.world_fixtures) {
            if(!game.editing && typeof game.world_fixtures[fixture] != "undefined" && typeof game.players[game.me] != "undefined" && game.world_fixtures[fixture].x == game.players[game.me].x && game.world_fixtures[fixture].y == game.players[game.me].y) {
                if(game.world_fixtures[fixture].onStand>"") {
                    socket.send({putme:{x:game.players[game.me].x,y:game.players[game.me].y}});
                    socket.send({standtrigger:{fixture:fixture}})
                }
            }
            var x = ((game.world_fixtures[fixture].x-game.camera.x)*game.sprites.w)+VIEWPORT_OFFSET_X;
            var y = ((game.world_fixtures[fixture].y-game.camera.y)*game.sprites.h)+VIEWPORT_OFFSET_Y;
            frame = game.fixtures[game.world_fixtures[fixture].fixture].animationType == "random" ? Math.floor(Math.random()*4) : 0
            game.dom.ctx.drawImage(game.fixtures[game.world_fixtures[fixture].fixture].img,frame*game.sprites.w,0,game.sprites.w,game.sprites.h,x,y,game.sprites.w,game.sprites.h)
        }
    },
    players:function() {
        if(typeof game.players != "undefined" && game.me!=0) {
            for(var player in game.players) {
                if(player!=game.me) {

                    var x = ((game.players[player].x - game.camera.x) * game.sprites.w) + VIEWPORT_OFFSET_X;
                    var y = ((game.players[player].y - game.camera.y) * game.sprites.h) + VIEWPORT_OFFSET_Y;

                    if((x>-1 && x < game.camera.w*game.sprites.w)  && (y>-1 && y < game.camera.h*game.sprites.h)) {
                        if($("#player_" + game.players[player].id).length!=1) {
                            $(game.dom.players).append("<div id='player_" + game.players[player].id + "' class='sprite player'><p class='nametag' style='color:" + game.player.nameColor(game.players[player].status) + "'>" + game.players[player].name + "</p>&nbsp;</div>");
                        }
                        var playerColor = game.player.nameColor(game.players[player].status);
                        if(game.players[player].status=="grey") {
                            $("#player_" + game.players[player].id).addClass("criminal");
                        } else {
                            $("#player_" + game.players[player].id).removeClass("criminal");
                        }
                        $("#player_" + game.players[player].id).find(".nametag").html(game.players[player].name).css({color:playerColor});

                        if($("#player_" + game.players[player].id).is(".targeted")) {
                            render.target();
                        }
                        $("#player_" + game.players[player].id).css({left:x,top:y});
                    } else {
                        if($("#player_" + game.players[player].id).length>0) {
                            $("#player_" + game.players[player].id).remove();
                        }
                    }
                }
            }
        }
    },
    npcs:function() {
        if (typeof game.world_npcs != 'undefined') {
            for(var npc in game.world_npcs) {
                var x = ((game.world_npcs[npc].x - game.camera.x) * game.sprites.w);//+$(elements.container).position().left-viewportOffsetX;
                var y = ((game.world_npcs[npc].y - game.camera.y) * game.sprites.h);//+$(elements.container).position().top-viewportOffsetY;
                if((x>-1 && x < game.camera.w * game.sprites.w)  && (y > -1 && y < game.camera.h * game.sprites.h)) {

                    if($("#npc_" + game.world_npcs[npc].id).length<1) {
                        $(game.dom.npcs).append("<div id='npc_" + game.world_npcs[npc].id + "' class='sprite npc " + game.npcs[game.world_npcs[npc].npc].animationType + " " + (game.npcs[game.world_npcs[npc].npc].hostile==1?"hostile":"friendly") + "' style='width:" + ((game.npcs[game.world_npcs[npc].npc].width*game.sprites.w)) + "px; height:" + (game.npcs[game.world_npcs[npc].npc].height*game.sprites.h) + "px; background-image:url(" + game.paths.npcs + game.npcs[game.world_npcs[npc].npc].sprite + ");'></div>");
                        if(game.npcs[game.world_npcs[npc].npc].height>1) {
                            $("#npc_" + game.world_npcs[npc].id).css({marginLeft:-game.sprites.w/2,marginTop:-game.sprites.h/2})
                        }
                        $("#npc_" + game.world_npcs[npc].id).data("frame",Math.round(Math.random()*3));
                    }

                    if($("#npc_" + game.world_npcs[npc].id).is(".targeted")) {
                        render.target();
                    }
                    $("#npc_" + game.world_npcs[npc].id).css({left:x,top:y});

                    //elements.ctx.drawImage(game.npcs[game.world_npcs[npc].npc].img,0,0,sprites.w,sprites.h,x*sprites.w,y*sprites.h,sprites.w,sprites.h);


                } else {
                    if($("#npc_" + game.world_npcs[npc].id).length>0) {
                        $("#npc_" + game.world_npcs[npc].id).remove();
                    }
                }
            }
        }
        $(".npc").each(function() {
            var thisID = $(this).attr("id").split("_")[1];
            if(typeof game.world_npcs[thisID] == "undefined") {
                $(this).remove();
            }
        })
    },
    items:function() {
        var drawnTotal = 0;
        if(!game.players[game.me]) return;

        for(gameitem in game.world_items) {
            if(game.world_items[gameitem]) {
                var x = ((game.world_items[gameitem].x-game.camera.x))//+$(elements.viewport).position().left-viewportOffsetX;
                var y = ((game.world_items[gameitem].y-game.camera.y))//+$(elements.container).position().top-viewportOffsetY;
                if((x>-1 && x < game.camera.w*game.sprites.w) && (y>-1 && y < game.camera.h*game.sprites.h)) {
                    if((game.world_items[gameitem].x==game.players[game.me].x-1 || game.world_items[gameitem].x==game.players[game.me].x+1 || game.world_items[gameitem].x==game.players[game.me].x) && (game.world_items[gameitem].y==game.players[game.me].y-1 || game.world_items[gameitem].y==game.players[game.me].y+1 || game.world_items[gameitem].y==game.players[game.me].y)) {
                        if($("#gameitem_" + gameitem).length!=1) {
                            $(game.dom.items).append("<div id='gameitem_" + gameitem + "' class='sprite " + (game.items[game.world_items[gameitem].item].illuminates>0?"liminant":"not-luminant") + " item item-" + game.world_items[gameitem].item + "' rel='"+x+"_"+y+"' style='background-image:url(" + game.paths.items + game.items[game.world_items[gameitem].item].sprite + ")'>&nbsp;</div>");
                        }
                        $("#gameitem_" + gameitem + ":not('.ui-draggable-dragging')").css({left:x*game.sprites.w,top:y*game.sprites.h}).attr("rel",x+"_"+y);
                        console.log('drew item on dom')
                    } else {
                        //            elements.ctx.drawImage(game.gameitems[game.world_items[gameitem].item].img,x*sprites.w,y*sprites.h,sprites.w,sprites.h);
                        game.dom.ctx.drawImage(game.items[game.world_items[gameitem].item].img,0,0,game.sprites.w,game.sprites.h,x*game.sprites.w,y*game.sprites.h,game.sprites.w,game.sprites.h);
                        //console.log('drew item on canvas')
                        $("#gameitem_" + gameitem).remove();
                    }
                } else {
                    $("#gameitem_" + gameitem).remove();
                }
            }
        }
    },
    water:function() {

    },
    viewport:function() {
        game.render.terrain();
        game.render.fixtures();
        game.render.items();
        game.render.npcs();
        game.render.players()
    }
}