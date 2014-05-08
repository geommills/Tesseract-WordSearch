var todo = require('./../src/todoClient.js');
var when = require('when');
var _ = require('underscore');
var reporters = require('./../lib/reporters.js');


when(todo.getCurrentTodoList())
.then(function(result){
	return reporters.todoListReporter(result);
})
.ensure(process.exit);
// .then(function(){
	// return todo.saveTodoListItem({
		// id: 3,
		// status: 'Complete'
	// });
// })
// .then(function(){
	// return todo.getCurrentTodoList();
// })
// .then(function(result){
	// return reporters.todoListReporter(result);
// })
// .then(function(){
	// return todo.saveTodoListItem({
		// description: 'New Item',
		// status: 'Incomplete'}
	// );
// })
// .then(function(result){
	// return todo.getCurrentTodoList();
// })
// .then(function(result){
	// return reporters.todoListReporter(result);
// })
// .otherwise(function(error){
	// console.log(error);
// })
// .ensure(process.exit);
