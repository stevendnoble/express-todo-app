// SERVER SIDE JAVASCRIPT

var express = require('express');
var bodyParser = require('body-parser');
var hbs = require('hbs');

var app = express();

// Set up static public file
app.use(express.static('public'));

// Set up body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Seed data
var todos = [{
							_id: 1,
							task: 'wake up',
							description: 'get up at 7:00am'
						},{
							_id: 2,
							task: 'make breakfast',
							description: 'cook some eggs and toast'
						},{
							_id: 3,
							task: 'eat breakfast',
							description: 'eat it'
						},{
							_id: 4,
							task: 'clean up',
							description: 'wash dishes'
						}];

// Set up route for index.html
app.get('/', function(req, res) {
	res.render('index');
});

// Set up route for get
app.get('/api/todos', function(req, res) {
	res.json(todos);
});

// Set up route for getting a single todo
app.get('/api/todos/:id', function(req, res) {
	// Get the id
	var todoId = parseInt(req.params.id);
	// Find the object by the id
	var todoToDisplay = todos.filter(function(todo) {
		return (todo._id === todoId);
	});
	// Respond with JSON data
	res.json(todoToDisplay);
});

// Set up route to post todos
app.post('/api/todos', function(req, res) {
	// Create a new todo with form data
	var newTodo = req.body;
	// Set a sequential id for todo data
	if (todos.length > 0) {
		newTodo._id = todos[todos.length - 1]._id + 1;
	} else {
		newTodo._id = 1;
	}
	// Add new todo to the todos array
	todos.push(newTodo);
	// Send new todo as JSON resonse
	res.json(newTodo);
});

// Set up route for updates
app.put('/api/todos/:id', function(req, res) {
	// Get todo id from url params
	var todoId = parseInt(req.params.id);
	// Find todo to update by its id
	var todoToUpdate = todos.filter(function(todo) {
		return (todo._id === todoId);
	})[0];
	// Update the todo's task
	req.body._id = todoId;
	todos.splice(todos.indexOf(todoToUpdate), 1, req.body);
		// We could update the task and the description as well
	// Send back JSON data
	res.json(req.body);
});

// Set up route for deletes
app.delete('/api/todos/:id', function(req, res) {
	// Get todo id from url params
	var todoId = parseInt(req.params.id);
	// Find todo to update by its id
	var todoToDelete = todos.filter(function(todo) {
		return (todo._id === todoId);
	})[0];
	// Delete the todo's task
	todos.splice(todos.indexOf(todoToDelete), 1);
	// Send back JSON data
	res.json(todoToDelete);
});

var server = app.listen(process.env.PORT || 5000, function() {
	console.log('listening...');
});