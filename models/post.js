var MongoClient = require('mongodb').MongoClient;

function Post(username, post, time){
    this.user =username;
    this.post =post;
    if(time){
        this.time=time;
    }else{
        this.time=new Date();
    }
}
module.exports = Post;

Post.prototype.save = function save(callback){
    var post ={
        user: this.user,
        post: this.post,
        time: this.time
    }
    MongoClient.connect("mongodb://localhost/microblog", function(err, db) {
        if(err) { return callback(err)}
        db.collection('posts', function(err, collection){
            if(err) {
                db.close();
                return callback(err);
            }
            collection.ensureIndex('user');
            collection.insert(post,{safe:true}, function(err, post){
                db.close();
                callback(err, post);
            })
        });
    });
}

Post.get = function get(username, callback){
    MongoClient.connect("mongodb://localhost/microblog", function(err, db) {
        if(err) { return callback(err)}
        db.collection('posts', function(err, collection){
            var query ={};
            if(username){//if username==null, then find all posts and list in the hot page
                query.user= username;
            }
            collection.find(query).sort({time:-1}).toArray(function(err,docs){
                debugger;
                db.close();
                if(err){
                    callback(err,null);
                }
                var posts=[];
                docs.forEach(function(doc,index){
                    var post = new Post(docs[index].user, docs[index].post, docs[index].time);
                    posts.push(post);
                })
                callback(null,posts);
            })
        })
    });
}
