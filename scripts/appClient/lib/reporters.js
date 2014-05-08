var _ = require('underscore');

exports.eventQueueReporter = function(eventList) {
	console.log('current synch event queue');
	_.each(eventList.models, function(event){
		exports.eventReporter(event);
	});
};

exports.eventReporter = function(event) {
	console.log(
		'id: ' + event.get("id") + 
		'  synch_status: ' + event.get("synch_status") +
		'  ' + event.get("request_type") +
		'  ' + event.get("event_data") +
		'  ' + ((event.get("result_message") != null) ? event.get("result_message") : '')
		);
};

exports.todoListReporter = function(todoList) {
	console.log('current todo list');
	_.each(todoList.models, function(todoItem){
		exports.todoReporter(todoItem);
	});
};

exports.todoReporter = function(todoItem){
	console.log(todoItem.attributes);
};


exports.jsonReporter = function (res) {
	var response = res;
	
	return function (result) {
		response.send(result);
	};
};


exports.consoleReporter = function (res) {
	var response = res;
	
	return function (result) {
		console.log('Reporting');
		  _.each(result.models, function(model){
			console.log(model.attributes);
		  });
	};
};


exports.reportBookshelfModels = function (collection) {
		console.log('Reporting');
		
		  _.each(collection.models, function(model){
			console.log(model.attributes);
		  });
};