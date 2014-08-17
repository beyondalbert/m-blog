var express = require('express');
var router = express.Router();
var crypto = require('crypto'),
    User = require('../models/user.js');
var Post = require('../models/post')
markdown = require('markdown').markdown;

/* GET home page. */
router.get('/', function(req, res) {
  Post.find({}, function (err, posts) {
    if (err) {
      posts = []
    }
    posts.forEach(function (post) {
      if (post.content) {
        post.content = markdown.toHTML(post.content);
      }
    });
    console.log(req.session.user);
    res.render('index', {
      title: '主页',
      user: req.session.user,
      posts: posts,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

module.exports = router;
