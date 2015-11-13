// wait for DOM to load before running JS
$(document).ready (function () {

  // check to make sure JS is loaded
  console.log('JS is loaded!');

  // Compile the template
  var source   = $('#template').html();
	var template = Handlebars.compile(source);

	// Set variables
	var todoResults = [],
			baseUrl = '/',
			apiUrl = baseUrl + 'api/todos/',
			$todolist = $('#todo-list'),
			$newTodo = $('#newTodo');

  // Use AJAX to get data and append it to the page
  $.get(apiUrl, function(data) {
  	console.log(data.todos);
  	todoResults = data.todos;

	 	// Render the data
	  var todoHTML = template({todos: todoResults});
	  $todolist.append(todoHTML);
  });

  // Refresh function
	function refresh (data) {
		console.log('refreshing');
		$todolist.empty();
		$('input.formdata').val('');
		// Rerender the data
	  var todoHTML = template({todos: todoResults});
	  $todolist.append(todoHTML);
	}

	// Add todo function called by submit button handler
	function addTodo(data) {
		event.preventDefault();
		var newTodo = $(this).serialize();
		$.post(apiUrl, newTodo, function(data) {
			todoResults.push(data);
			refresh();
		});
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
					var index = todoResults.indexOf(updatedTodo);
					for (var i=0; i<todoResults.length; i++) {
						if (todoResults[i]._id === id) {
							index = i;
						}
					}
					todoResults.splice(index, 1, data);
					refresh();
				}
			});
		});
	}

	// Delete todo function called by glyphicon trash handler
	function deleteTodo() {
		console.log('deleting');
		event.preventDefault();
		var id = $(this).attr('id');
		$.ajax({
			type: 'DELETE',
			url: apiUrl + id,
			success: function (data) {
				var index;
				for (var i=0; i<todoResults.length; i++) {
					if (todoResults[i]._id === id) {
						index = i;
					}
				}
				todoResults.splice(index, 1);
				refresh();
				console.log('deleted');
			}
		});
	}

	// Strikeout text when glyphicon is clicked
	function strikeout() {
		event.preventDefault();
		var id = $(this).attr('id');
		$('#task' + id).css('text-decoration', 'line-through');
	}

	// Click handler for Submit button to add a todo
  $newTodo.on('submit', addTodo);

  // Click handlers for glyphicons
  $todolist.on('click', '.glyphicon-pencil', putTodo);

  $todolist.on('click', '.glyphicon-trash', deleteTodo);

  $todolist.on('click', '.glyphicon-ok', strikeout);

});