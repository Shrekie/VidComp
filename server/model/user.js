var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    profileID: String,
    name: String,
    accessToken: String,
});

module.exports = mongoose.model('User', User);