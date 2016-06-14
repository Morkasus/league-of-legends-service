var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var keySchema = new Schema({
	key: {type:String, index:1, required:true, unique:true},
}, {collection: 'keys'});

var Key = mongoose.model('Keys', keySchema);
module.exports = Key;