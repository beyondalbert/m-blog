var express = require('express');
var router = express.Router();
var crypto = require('crypto'),
    User = require('../models/user.js');
var Post = require('../models/post')

router.get('/new', function(req, res) {
  res.render('users/new', {
    title: '注册',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});

router.post('/create', function(req, res) {
  var name = req.body.name,
      password = req.body.password,
      password_re = req.body['password-repeat'];

  if (password_re != password) {
    req.flash('error', '两次输入的密码不一致');
    return res.redirect('/users/new');
  }

  var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
  
  User.findOne({name: name}, function (err, user) {
    if (user) {
      req.flash('error', '用户已存在！');
      return res.redirect('/users/new');
    }

    var user = new User({
      name: name,
      password: password,
      email: req.body.email
    });
    
    user.save(function (err, user) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/users/new');
      }
      req.session.user = user;
      req.flash('success', '注册成功！');
      res.redirect('/');
    });
  });
});

router.get('/:name', function (req, res) {
  User.findOne({name: req.params.name}, function (err, user) {
    if (!user) {
      req.flash('error', '用户不存在!'); 
      return res.redirect('/');//用户不存在则跳转到主页
    }

    Post.find({author: user.name}, function (err, posts) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/');
      }
      res.render('users/index', {
        title: user.name,
        posts: posts,
        user : req.session.user,
        success : req.flash('success').toString(),
        error : req.flash('error').toString()
      });
    });
  });
});

module.exports = router;
