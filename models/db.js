var settings = require('../settings'),
    mongoose = require('mongoose');
mongoose.connect('mongodb://' + settings.host + '/' + settings.db);
var db = mongoose.connection;
db.on('error', console.error.bind(console, "链接错误："));
db.once('open', function() {

});
module.exports = mongoose; 
