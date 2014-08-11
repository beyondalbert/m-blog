var mongoose = require('./db');

var userSchema = new mongoose.Schema({
  name: String,
  password: String,
  email: String
}, {
  collection: "users"
});

var User = mongoose.model('User', userSchema);

module.exports = User;
