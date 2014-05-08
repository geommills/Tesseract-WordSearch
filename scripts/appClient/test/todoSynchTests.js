var geoSynchQueue = require('./../lib/geoSynchQueue.js');
var todoSynch = require('./../src/todoSynchClient.js');
var todo = require('./../src/todoClient.js');
var when = require('when');
var _ = require('underscore');
var reporters = require('./../lib/reporters.js');


when(todo.getCurrentTodoList())
.then(function(result){
	return reporters.todoListReporter(result);
})
.then(function() {
	return when(geoSynchQueue.getQueuedEvents());
})
.then(function(result){
	return reporters.eventQueueReporter(result);
})
.then(function(){
	return todoSynch.processQueuedEvents();
})
.then(function(){
	return todo.getCurrentTodoList();
})
.then(function(result){
	return reporters.todoListReporter(result);
})
.then(function() {
	return when(geoSynchQueue.getQueuedEvents());
})
.then(function(result){
	return reporters.eventQueueReporter(result);
})
.otherwise(function(error){
	console.log(error);
})
.ensure(process.exit);

