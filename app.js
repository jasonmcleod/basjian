// vars
var express = require('express');
var io = require('socket.io');
var app = module.exports = express.createServer();

// globals
global.config = require('./server/config').config;
global.server = require('./server/server').server;
global.player = require('./server/player').player;
global.packets = require('./server/packets').packets;
global.assets = require('./server/assets').assets;
global.levels = require('./server/levels').levels;
global.npcs = require('./server/npcs').npcs;
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
    // db call
    if(req.body.username > '' && req.body.password > '') {
        player.authenticate(
            req.body.username,
            req.body.password,
            function(userID) { // success
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
console.log('loading assets');
assets.fetch();
app.listen(3000);
var sio = io.listen(app);
sio.sockets.on('connection', function (client) {
    packets.handle(client);
    client.on('disconnect',function(){
       //console.log('dropped')
    });
});