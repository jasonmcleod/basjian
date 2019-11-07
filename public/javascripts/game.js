// constants
var TYPE_PLAYER = 1;
var VIEWPORT_OFFSET_X = 0;
var VIEWPORT_OFFSET_Y = 0;

var game = {
    attackMode:false,
    editing:false,
    running:false,
    connected:false,
    authtoken:undefined,
    me:undefined,
    socket:undefined,
    map:undefined,
    settings:{
        host:'localhost',
        port:8001,
        renderer:'canvas'
    },
    intervals:{
        movement:{
            rate:200,
            loop:0
        },
        mainloop:{
            rate:50,
            loop:0
        }
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
        canvas:undefined,
        items:'#viewport-items',
        players:'#viewport-players'
    },
    environment:{
        rain:false,
        brightness:1
    },
    begin:function() {
        game.ready = true;
        game.ui.bind();
        game.intervals.mainloop.loop = setInterval(game.mainloop,game.intervals.mainloop.rate)
    },
    paths:{
        maptiles:'assets/tiles/',
        fixtures:'assets/fixtures/',
        items:'assets/items/',
        npcs:'assets/npcs/'
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
            console.log(game.fixtures)
            for(var img in game.maptiles) {
                game.maptiles[img].img = new Image();
                game.maptiles[img].img.src = game.paths.maptiles + game.maptiles[img].sprite;
                game.maptiles[img].img.onload = game.assets.preloadComplete;
            }
            game.assets.preloadedNeeded++;

            console.log(game.fixtures)
            for(var img in game.fixtures) {
                game.fixtures[img].img = new Image();
                game.fixtures[img].img.src = game.paths.fixtures + game.fixtures[img].sprite;
                game.fixtures[img].img.onload = game.assets.preloadComplete;
            }
            game.assets.preloadedNeeded++;

            for(var img in game.items) {
                game.items[img].img = new Image();
                game.items[img].img.src = game.paths.items + game.items[img].sprite;
                game.items[img].img.onload = game.assets.preloadComplete;
            }
            game.assets.preloadedNeeded++;

        },
        preloadDone:0,
        preloadNeeded:0,
        preloadComplete:function() {
            //console.log("image loaded: " + this.src)
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
            if(typeof game.maptiles != "undefined" && typeof game.map != "undefined" && !game.running) {
                game.running = true;
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
        game.dom.viewport = $('#viewport');
        game.dom.players = $('#viewport-players');
        game.dom.npcs = $('#viewport-npcs');
        game.dom.items = $('#viewport-items');

        // set the width of all dom elements
        game.dom.canvas.attr('width',game.sprites.w * game.camera.w);
        game.dom.canvas.attr('height',game.sprites.h * game.camera.h);
        game.dom.players.css({width:game.dom.canvas.width,height:game.dom.canvas.height});
        game.dom.npcs.css({width:game.dom.canvas.width,height:game.dom.canvas.height});
        game.dom.items.css({width:game.dom.canvas.width,height:game.dom.canvas.height});

        $('#viewport-me').css({
            left:((game.sprites.w/2) * game.camera.w) - game.sprites.w/2,
            top:((game.sprites.h/2) * game.camera.h) - game.sprites.h/2
        })

        game.socket = io.connect("http://localhost:3001");
        game.socket = io.connect("http://" + window.location.hostname);
        game.socket.emit('register',game.authtoken)
        game.socket.on('connect',function() {
           game.connected = true;
        });
        game.socket.on('disconnect', function () {
            console.log("lost it");
        });

        game.handle_packets();
    },
    tileWalkable:function() {
        return true;
    },

}


$(function() {
    game.init();
})