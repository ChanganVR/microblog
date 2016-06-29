var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User =require('../models/user')
var Post = require('../models/post');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(res.user) {
    res.render('index');
  }else{
    res.locals.posts=null;
    res.render('user');
  }
});
//TODO:{title:'index'}

router.get('/login', checkNotLogin);
router.get('/login', function(req,res, next){
  res.render('login');
})

router.post('/login', checkNotLogin);
router.post('/login', function(req,res,next){
  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body.password).digest('base64');
  User.get(req.body.username, function(err, user){
    if(!user){
      req.flash('error', "User doesn't exists');");
      return res.redirect('/');
    }
    if(user.password !=password){
      req.flash('error','Password is incorrect');
      return res.redirect('/login');
    }
    req.session.user = user;
    req.flash('success', 'Login success');
    res.redirect('/');
  })
})

router.get('/reg',checkNotLogin);
router.get('/reg', function(req, res, next) {
  res.render('reg');
});
router.get('/reg',checkNotLogin);
router.post('/reg', function(req,res){
  //check whether the two passwords are the same
  if(req.body['password-repeat']!=req.body['password']){
    req.flash('error','two passwords are different!');
    return res.redirect('/reg');
  }
  //generate hash value for password
  var md5 = crypto.createHash('md5');
  var password=md5.update(req.body.password).digest('base64');
  var newUser = new User({
    name:req.body['username'],
    password:password
  })
  //check whether account exist
  User.get(newUser.name,function(err,user){
    if(user)
      err = 'Username already exists';
    if(err){
      req.flash('error',err);
      return res.redirect('/reg');
    }
    newUser.save(function(err){
      if(err){
        req.flash('error',error);
        return res.redirect('/reg');
      }
      req.session.user = newUser;
      req.flash('success', 'login success');
      res.redirect('/');
    });
  });
});

router.get('/logout', checkLogin);
router.get('/logout',function(req,res,next){
  req.session.user=null;
  req.flash('success','log out success');
  res.redirect('/');
})

function checkLogin(req,res,next){
  if(!req.session.user) {
    req.flash('error', 'not logged in');
    return res.redirect('/');
  }
  next();
}

function checkNotLogin(req,res,next){
  if(req.session.user){
    req.flash('error', 'already logged in');
    return res.redirect('/');
  }
  next();
}

router.get('/u/:user', function(req, res, next){
  User.get(req.params.user, function(err, user){
    if(!user){
      req.flash('error', "User doesn't exist");
      return res.redirect('/');
    }
    Post.get(user.name, function(err, posts){
      if(err){
        req.flash('error',err);
        return res.redirect('/');
      }
      res.render('user',{
        title:user.name,
        posts:posts
      })
    })
  })
})

router.post('/post',checkLogin);
router.post('/post',function(req,res,next){
  var currentUser=req.session.user;
  var post = new Post(currentUser.name, req.body.post);
  post.save(function(err){
    if(err){
      req.flash('error', err);
      return res.redirect('/');
    }
    req.flash('success', 'post success');
    res.redirect('/u/'+currentUser.name);
  })
})

module.exports = router;
