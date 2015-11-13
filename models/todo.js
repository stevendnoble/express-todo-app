var mongoose = require('mongoose'),
		Schema = mongoose.Schema;

// Provide the schema for the Todo model
var TodoSchema = new Schema({
	task: String,
	description: String,
	// done: Boolean
});

// Define the model using the schema we provided
var Todo = mongoose.model('Todo', TodoSchema);

// We export the Todo model to use in other files
module.exports = Todo;