var express = require('express');
var io = require('socket.io');
var app = module.exports = express.createServer();
var server = require('./server/server').server;
var player = require('./server/player').player;
var packets = require("./server/packets").packets;

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

app.listen(3000);
var sio = io.listen(app);
sio.sockets.on('connection', function (client) {
    packets.handle(client);
    client.on('disconnect',function(){
       //console.log('dropped')
    });
});

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);