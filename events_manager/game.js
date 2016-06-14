var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var gameSchema = new Schema({
	eventId: {type:Number, unique:true, index:1, required:true, dropDups: true},
    winScore: {type: Number, required:true},
	loseScore: {type: Number, required:true}, 
    winTeam: [String],
    loseTeam: [String],
}, {collection: 'games'});

var Game = mongoose.model('Game', gameSchema);
module.exports = Game;
