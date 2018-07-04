var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    name: String
});

module.exports = mongoose.model('User', User);