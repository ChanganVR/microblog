// Retrieve
var MongoClient = require('mongodb').MongoClient;

function User(user){
  this.name  = user.name;
  this.password  = user.password;
}
module.exports = User;

User.prototype.save = function save(callback){
  var user ={
    name:this.name,
    password:this.password
  }
// Connect to the db
  MongoClient.connect("mongodb://localhost/microblog", function(err, db) {
    if(err) { return callback(err)}
    db.collection('users', function(err, collection){
      if(err) {
        db.close();
        return callback(err);
      }
      collection.ensureIndex('name', {unique:true});
      collection.insert(user,{safe:true}, function(err, user){
        db.close();
        callback(err, user);
      })
    });
  });
};

User.get = function get(username, callback) {
  MongoClient.connect("mongodb://localhost/microblog", function(err, db) {
    debugger;
    if(err) { return callback(err)}
    db.collection('users', function(err, collection){
      debugger;
      if(err){
        db.close();
        return callback(err, null);
      }
      collection.find({name:username}).toArray(function(err, doc){
        debugger;
        db.close();
        if(doc[0]){
          var user = new User(doc[0]);
          callback(err, user);
        }else{
          callback(err, null);
        }
      })
    })
  });
};
