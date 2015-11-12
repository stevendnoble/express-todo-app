// wait for DOM to load before running JS
$(document).ready (function () {

  // check to make sure JS is loaded
  console.log('JS is loaded!');

  // Compile the template
  var source   = $('#template').html();
	var template = Handlebars.compile(source);
	var todoResults = [];
	var baseUrl = '/';
	var apiUrl = baseUrl + 'api/todos/';
	var $todolist = $('#todo-list');
	var $newTodo = $('#newTodo');

	// Handlebars list helper
	Handlebars.registerHelper('list', function(context, options) {
	  var ret = "<ul>";
	  for(var i=0, j=context.length; i<j; i++) {
	    ret = ret + "<li>" + options.fn(context[i]) + "</li>";
	  }
	  return ret + "</ul>";
	});

  // Use AJAX to get data and append it to the page
  $.get(apiUrl, function(data) {
  	console.log(data);
  	todoResults = data;

	 	// Render the data
	  var todoHTML = template({todos: todoResults});
	  $todolist.append(todoHTML);
  });

  // Refresh function
	function refresh (data) {
		console.log('refreshing');
		$todolist.empty();
		$('input').val('');
		// Rerender the data
	  var todoHTML = template({todos: todoResults});
	  $todolist.append(todoHTML);
	}

	// Add todo function called by submit button handler
	function addTodo(data) {
		todoResults.push(data);
		refresh();
	}

	// Put todo function called by glyphicon pencil handler
	function putTodo() {
		event.preventDefault();
		var id = $(this).attr('id');
		$('#form' + id).toggle();
		$('#form' + id).on('submit', function(event) {
			event.preventDefault();
			var updatedTodo = $(this).serialize();
			$.ajax({
				type: 'PUT',
				url: apiUrl + id,
				data: updatedTodo,
				success: function (data) {
					// Get the object to update
					var todoToUpdate = todos.filter(function(todo) {
						return (todo._id === id);
					})[0];
					// Remove the object and replace it with the updated object
					todoResults.splice(todoResults.indexOf(todoToUpdate), 1, data);
					// var index;
					// for (var i=0; i<todoResults.length; i++) {
					// 	if (todoResults[id] === id) {
					// 		index = i;
					// 	}
					// }
						// todoResults.splice(index, 1);
		 				// todoResults.push(data);
					refresh();
				}
			});
		});
	}

	// Delete todo function called by glyphicon trash handler
	function deleteTodo() {
		event.preventDefault();
		var id = $(this).attr('id');
		$.ajax({
			type: 'DELETE',
			url: apiUrl + id,
			success: function (data) {
				var index;
				for (var i=0; i<todoResults.length; i++) {
					if (todoResults[id] === id) {
						index = i;
					}
				}
				todoResults.splice(index, 1);
				refresh();
				console.log('deleted');
			}
		});
	}

	// Click handler for Submit button to add a todo
  $newTodo.on('submit', function(event) {
  	event.preventDefault();
		var newTodo = $(this).serialize();
		$.post(apiUrl, newTodo, addTodo);
  });

  // Click handler for glyphicon pencil
  $todolist.on('click', '.glyphicon-pencil', putTodo);

  // Click handler for glyphicon trash
  $todolist.on('click', '.glyphicon-trash', deleteTodo);

});