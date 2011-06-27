var game = {
    authtoken:undefined,
    me:undefined,
    settings:{
        host:'localhost',
        port:8001,
        sprite:{
            width:16,
            height:16,
        },
        camera:{
            width:25,
            height:21
        },
        renderer:'canvas'
    },
    camera:{
        x:0,
        y:0
    },
    map:{},
    players:{},
    npcs:{},
    items:{},
    dom:{
        ctx:undefined,
        canvas:undefined
    },
    environment:{
        rain:false,
        brightness:1
    },    
    assets:{
        loaded:0,
        required:['map'],
        register:function(asset) {
            assets.loaded++
        }
    },
    socket:undefined,
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
        game.dom.canvas.attr('width',game.settings.sprite.width * game.settings.camera.width);
        game.dom.canvas.attr('height',game.settings.sprite.width * game.settings.camera.height);
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
    
    // test crap    
    $("canvas").live("click",function() {
      game.socket.emit("dom.click",2)
    })
})