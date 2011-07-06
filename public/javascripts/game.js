var game = {
    authtoken:undefined,
    me:undefined,
    socket:undefined,
    map:undefined,
    settings:{
        host:'localhost',
        port:8001,
        renderer:'canvas',
        interval:300
    },
    sprites:{
        w:16,
        h:16,
    },    
    camera:{
        x:0,
        y:0,
        w:25,
        h:21
    },
    dom:{
        ctx:undefined,
        canvas:undefined
    },
    environment:{
        rain:false,
        brightness:1
    },    
    begin:function() {
        game.ready = true;
        game.ui.bind();
        setInterval(game.mainloop,game.settings.interval)
    },
    paths:{
        maptiles:"assets/tiles/"
    },
    assets:{
        register:function(data) {
            game.players=           data.players;
            game.npcs=              data.npcs;
            game.world_npcs=        data.world_npcs;
            game.items=             data.items;
            game.world_items=       data.world_items;
            game.fixtures=          data.fixtures;
            game.world_fixtures=    data.world_fixtures;
            game.maptiles=          data.maptiles;
            game.assets.preload();
        },
        preload:function() {
            for(var img in game.maptiles) {
                game.maptiles[img].img = new Image();
                game.maptiles[img].img.src = game.paths.maptiles + game.maptiles[img].sprite;
                game.maptiles[img].img.onload = game.assets.preloadComplete;
                
                console.log(game.maptiles[img])
            }
            game.assets.prelaodedNeeded++;
            
        },
        preloadDone:0,
        preloadNeeded:0,
        preloadComplete:function() {
            console.log("image loaded: " + this.src)
            game.assets.preloadedDone++;
            if(game.assets.preloadDone == game.assets.preloadNeeded) {
                game.assets.ready();
            }
        },
        registerMap:function(map) {
            game.map = map;
            game.assets.ready();
        },
        ready:function() {
            if(typeof game.maptiles != "undefined" && typeof game.map != "undefined") {
                game.begin();
            }
        }
    },
    init:function() {
        // store the context
        game.dom.ctx = document.getElementById('viewport-canvas').getContext('2d');
        
        // store the canvas element
        game.dom.canvas = $('#viewport-canvas');
        
        // store the players,npcs, and items elements
        game.dom.players = $('#viewport-players');
        game.dom.npcs = $('#viewport-npcs');
        game.dom.items = $('#viewport-items');
        
        // set the width of all dom elements 
        game.dom.canvas.attr('width',game.sprites.w * game.camera.w);
        game.dom.canvas.attr('height',game.sprites.h * game.camera.h);
        game.dom.players.css({width:game.dom.canvas.width,height:game.dom.canvas.height});
        game.dom.npcs.css({width:game.dom.canvas.width,height:game.dom.canvas.height});
        game.dom.items.css({width:game.dom.canvas.width,height:game.dom.canvas.height});
        
        game.socket = io.connect("http://" + window.location.hostname);
        game.socket.emit('register',game.authtoken)
        game.socket.on('disconnect', function () {
            console.log("lost it");
        });      
        
        game.handle_packets();   
    }
}


$(function() {
    game.init();
})