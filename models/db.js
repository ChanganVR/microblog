/*var settings = require('../settings');
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
module.exports = new Db(settings.db, new Server(settings.host, 2000,{}));
*/
// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost/microblog", function(err, db) {
    if(err) { return console.dir(err); }
    module.exports =db;
    db.collection('test', function(err, collection) {});
    db.collection('test', {w:1}, function(err, collection) {});
    db.createCollection('test', function(err, collection) {});
    db.createCollection('test', {w:1}, function(err, collection) {});

});
