const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema is a representation of the data of how we want to store the data
const petSchema = new Schema({
	name: String,
	photo: String,
	description: {
		type: String,
		default: ""
	},
	score: {
		type: Number,
		default: 0
	}
});

module.exports = mongoose.model('Pet', petSchema);