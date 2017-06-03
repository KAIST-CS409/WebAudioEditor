var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var workspaceSchema = new Schema({
	name: String,
	updated: { type: Date, default: Date.now },
	workspaceTrackAudios: {type:Array, default: []}
});

module.exports = mongoose.model('workspace', workspaceSchema);
