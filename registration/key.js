var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var keySchema = new Schema({
	key: {type:String, index:1, required:true, unique:true},
}, {collection: 'key'});

var Key = mongoose.model('Key', keySchema);
module.exports = Key;