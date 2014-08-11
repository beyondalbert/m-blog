var mongoose = require('./db');
markdown = require('markdown').markdown;

var postSchema = new mongoose.Schema({
  author: String,
  title: String,
  content: String,
  time: {}
});

var Post = mongoose.model('Post', postSchema);

module.exports = Post;
