var config = require('./config').config;
var sha1 = require('./lib/sha1/sha1')
var mysqlClient = require('mysql').Client; mysql = new mysqlClient(); mysql.host = config.db.host; mysql.user = config.db.user; mysql.password = config.db.password; mysql.connect(); mysql.query('USE ' + config.db.database);
    
var player = {
    authenticate:function(username,password,success,failure) {
        mysql.query('USE ' + config.db.database + ';');
        mysql.query('SELECT * FROM accounts WHERE name = "' + username + '" AND password = "' + sha1.hex(password) + '"', function selectCb(err, results, fields) { if (err) { throw err; }
            if(results.length==1) {
                mysql.query('USE ' + config.db.database + ';');
                mysql.query('SELECT * FROM characters WHERE id = ' + results[0].character, function selectCb(err, results, fields) { if (err) { throw err; }
                    if(results.length==1) {
                        var record = results[0];
                        success(record.id);
                    }
                });
            } else {
                failure();
            }
        });
    },
    createToken:function(userID) {
         var token = sha1.hex(userID + (new Date().getTime()))
         mysql.query('USE ' + config.db.database + ';');
         mysql.query('UPDATE accounts SET token = "' + token + '" WHERE id = ' + userID, function selectCb(err, results, fields) { if (err) { throw err; }
            console.log("token set " + token)
         });
         return token;
    },
    register:function(token,client) {
         //query for a token
         mysql.query('SELECT * FROM accounts WHERE token = "' + token + '"', function selectCb(err, results, fields) { if (err) { throw err; }
            if(results.length==1) {
                server.players[client.id] = {
                    userID:results[0].id,
                    client:client,
                    authtime:new Date(),
                    connected:true,
                    clicks:0
                }
                console.log(server.players);
            }
        });
     }
}
exports.player = player;