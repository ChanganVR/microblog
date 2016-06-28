var express = require('express');
var crypto = require('crypto');
var User =require('../models/user')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
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
    debugger;
    if(user)
      err = 'Username already exists';
    if(err){
      req.flash('error',err);
      return res.redirect('/reg');
    }
    newUser.save(function(err){
      debugger;
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
  debugger;
  if(!req.session.user) {
    req.flash('error', 'not logged in');
    return res.redirect('/');
  }
  next();
}

function checkNotLogin(req,res,next){
  debugger;
  if(req.session.user){
    req.flash('error', 'alread logged in');
    return res.redirect('/');
  }
  next();
}

module.exports = router;
