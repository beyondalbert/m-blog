var express = require('express');
var router = express.Router();
var crypto = require('crypto'),
    User = require('../models/user.js');

router.get('/new', function(req, res) {
  res.render('sessions/new', {
    title: '登陆',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});

router.post('/create', function(req, res) {
  var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
  User.findOne({name: req.body.name}, function (err, user) {
    if (!user) {
      req.flash('error', '用户不存在！');
      return res.redirect('/sessions/new');
    }

    if (user.password != password) {
      req.flash('error', '密码错误！');
      return res.redirect('/sessions/new');
    }

    req.session.user = user;
    req.flash('success', '登陆成功！');
    res.redirect('/');
  });
});

router.get('/destroy', function(req, res) {
  req.session.user = null;
  req.flash('success', '登出成功！');
  res.redirect('/');
});

module.exports = router;
