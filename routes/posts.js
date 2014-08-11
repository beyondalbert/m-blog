var express = require('express');
var router = express.Router();
var beforeFilters = require('./before_filters');
var Post = require('../models/post');

router.get('/new', beforeFilters.checkLogin, function(req, res) {
  res.render('posts/new', {
    title: '发表',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});

router.post('/create', beforeFilters.checkLogin, function(req, res) {
  var currentUser = req.session.user;
  var date = new Date();
  var time = {
    date: date,
    year: date.getFullYear(),
    month: date.getFullYear + "-" + (date.getMonth() + 1),
    day: date.getFullYear + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
    minute: date.getFullYear + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
  };
  var post = new Post({author: currentUser.name, title: req.body.title, content: req.body.content, time: time});
  post.save(function (err) {
    if (err) {
      req.flash('error', err); 
      return res.redirect('/');
    }
    req.flash('success', '发布成功!');
    res.redirect('/');//发表成功跳转到主页
  });
});

router.get('/show/:_id', function (req, res) {
  Post.findOne({_id: req.params._id}, function (err, post) {
    if (err) {
      req.flash('error', err); 
      return res.redirect('/');
    }
    if (post.content) {
      post.content = markdown.toHTML(post.content);
    }
    res.render('posts/show', {
      title: post.title,
      post: post,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

router.get('/edit/:_id', beforeFilters.checkLogin, function (req, res) {
  Post.findOne({_id: req.params._id}, function (err, post) {
    if (err) {
      req.flash('error', err); 
      return res.redirect('back');
    }
    res.render('posts/edit', {
      title: '编辑',
      post: post,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

router.post('/update/:_id', beforeFilters.checkLogin, function (req, res) {
  var currentUser = req.session.user;
  Post.findOneAndUpdate({_id: req.params._id}, { $set: {content: req.body.content, title: req.body.title}}, function (err, post) {
    var url = '/posts/show/' + req.params._id;
    if (err) {
      req.flash('error', err); 
      return res.redirect(url);//出错！返回文章页
    }
    req.flash('success', '修改成功!');
    res.redirect(url);//成功！返回文章页
  });
});

router.get('/destroy/:_id', function (req, res) {
  var currentUser = req.session.user;
  Post.findById(req.params._id, function (err, post) {
    if (err) {
      req.flash('error', err);
      return res.redirect('back');
    }
    post.remove(function (err) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('back');
      }
      req.flash('success', '删除成功!');
      res.redirect('/');
    });
  });
});

module.exports = router;
