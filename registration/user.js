var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
	userName: {type:String, index:1, required:true, unique:true},
    password: {type: String, required:true},
	email: {type:String, required:true, unique:true}, 
	firstName: {type: String, required:true},
	lastName: {type: String, required:true},
    img: {type: String, required:true},
    gamesCounter: {type: Number, required:true},
    wins: {type: Number, required:true},
    loses: {type: Number, required:true},
    teamImg: {type: String, required:true},
    isAdmin: {type: Boolean, required:true},
    games: [{type: Number, unique:true}]
}, {collection: 'user'});

var User = mongoose.model('User', userSchema);
module.exports = User;