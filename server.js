// SERVER SIDE JAVASCRIPT

var express = require('express');
var bodyParser = require('body-parser');
var hbs = require('hbs');
var mongoose = require('mongoose');
var app = express();

// Require the Todo model
var Todo = require('./models/todo');

// Set up static public file
app.use(express.static('public'));

// Set view engine to hbs
app.set('view engine', 'hbs');

// Set up body-parser and connect to the local database
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect('mongodb://localhost/todo-app');

// Set up route for index.html
app.get('/', function(req, res) {
	res.render('index');
});

// Set up route for get
app.get('/api/todos', function(req, res) {
	// find will either return err or allTodos
	Todo.find(function(err, allTodos) {
		// Return an object which includes the allTodos array
		res.json({ todos: allTodos });
	});
});

// Set up route for getting a single todo
app.get('/api/todos/:id', function(req, res) {
	// Find url from id parameters
	var todoId = req.params.id; // Doesn't need to be converted to an integer

	// Find todo in db by id
	Todo.findOne({ _id: todoId }, function(err, foundTodo) {
		res.json(foundTodo);
	});
});

// Set up route to post todos
app.post('/api/todos', function(req, res) {
	// Create a new todo using form data
	var newTodo = new Todo(req.body);

	// Save new Todo in db
	newTodo.save(function(err, savedTodo) {
		res.json(savedTodo);
	});

});

// Set up route for updates
app.put('/api/todos/:id', function(req, res) {
	// Find url from id parameters
	var todoId = req.params.id; // Doesn't need to be converted to an integer

	// Find todo in db by id
	Todo.findOne({ _id: todoId }, function(err, foundTodo) {
		// Update the todo's attributes
		foundTodo.task = req.body.task;
		foundTodo.description = req.body.description;

		// Save updated todo
		foundTodo.save(function(err, savedTodo) {
			res.json(foundTodo);
		});
	});
});

// Set up route for deletes
app.delete('/api/todos/:id', function(req, res) {
	// Find url from id parameters
	var todoId = req.params.id; // Doesn't need to be converted to an integer

	// Find todo in db by id
	Todo.findOneAndRemove({ _id: todoId }, function(err, deletedTodo) {
		res.json(deletedTodo);
	});
});

var server = app.listen(process.env.PORT || 5000, function() {
	console.log('listening...');
});