var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var eventSchema = new Schema({
	eventId: {type:Number, index:1, required:true, unique:true},
    eventName: {type: String, required:true, unique:true},
	playerCounter: {type:Number, required:true}, 
	location: {type: String, required:true},
	eventImg: {type: String, required:true},
    description: {type: String, required:true},
    players: [String],
    hide: {type: Boolean, required:true},
    started: {type: Boolean, required:true}
}, {collection: 'event'});

var Event = mongoose.model('Event', eventSchema);
module.exports = Event;