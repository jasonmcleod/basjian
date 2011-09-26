// vars
var express = require('express');
var io = require('socket.io');
var app = module.exports = express.createServer();

var fs = require('fs');
fs.readFile('public/assets/maps/main.js', function(err,data){
    if(err) {
        console.error("Could not open file: %s", err);
        process.exit(1);
    }
    var mapData = data.toString('ascii').replace('game.assets.registerMap(map);','')
    global.map = eval(mapData)
});

global.TYPE_PLAYER = 1;

// globals
global.config = require('./server/config').config;
global.player = require('./server/player').player;
global.packets = require('./server/packets').packets;
global.assets = require('./server/assets').assets;
global.levels = require('./server/levels').levels;
global.npcs = require('./server/npcs').npcs;
global.encounters = require('./server/encounters').encounters;
global.general = require('./server/general').general;
global.mainloop = require('./server/mainloop').mainloop;

global.sha1 = require('./server/lib/sha1/sha1');
global.mysqlClient = require('mysql').Client;
global.mysql = new mysqlClient();
    mysql.host = config.db.host;
    mysql.user = config.db.user;
    mysql.password = config.db.password;
    mysql.connect();
    mysql.query('USE ' + config.db.database);

global.SAVE_INTERVAL = 60000;
global.connections = {};

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Basjian',
    layout:false
  });
});

app.post('/logon',function(req,res) {
    if(req.body.username > '' && req.body.password > '') {
        player.authenticate(
            req.body.username,
            req.body.password,
            function(userID) { // success
                console.log(userID)
                res.render('client', {
                    authtoken:player.createToken(userID), // return the user's hash/session/token/whatever we identify them with
                    title:'Client',
                    layout:false
                });
            },
            function() { //fail
                res.render('error',{
                    title:'Error',
                    err:'Incorrect user info',
                    layout:false
                });
            }
        );
    } else {
        res.render('error',{
            title:'Error',
            err:'Enter a valid username and password',
            layout:false
        });
    }
});

app.get('/client',function(req,res) {
    res.render('client', {
        title:'Client',
        layout:false
    })
})


/////////////////////////////////////////////////////////////

server = {
    VIEW_DISTANCE:22,
    TYPE_NPC:1,
    TYPE_PLAYER:2,

    players:{},
    connections:{},
    maptiles:{},
    fixtures:{},
    world_fixtures:{},
    items:{},
    world_items:{},
    inventory_items:{},
    npcs:{},
    world_npcs:{},
    bank_items:{},
    encounters:{},
    world_shops:{},
    assets_ready:function() {
        // start of game
        //encounters.spawnAll();
        console.log('ready!')
    }
}

console.log('loading assets');
assets.fetch();
app.listen(3000);
global.sio = io.listen(app);
sio.set('log level',1)
//global.mainloop = require('./server/mainloop').mainloop;

sio.sockets.on('connection', function (client) {
    packets.handle(client);
    client.on('disconnect',function(){
       //console.log('dropped')
    });
});



setInterval(function() {
    mainloop()
},200);

//usecode middlware

callUseCode = function(player,func) {
    client = connections[player].client
    eval(func);
}

setFixture = function(id,fixture) {
    server.world_fixtures[id].fixture = fixture;
    console.log('fixture is ' + id)
    sio.sockets.emit('setFixture',{id:id,fixture:fixture});
}
