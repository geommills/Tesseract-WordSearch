var _ = require('lodash');
var GeoJSON = require('geojson');

// these should maybe go away, but may currently be used in some places.
// or maybe they are awesome
// either way, they need to be considered for refactor
// for sure, the todo stuff needs to be moved

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

exports.geoJsonReporter = function (res) {
	var response = res;
	return function (result) {
		if(result.rows.length > 0){
			GeoJSON.parse(result.rows, { Point: ['h', 'g'] }, function (geojson) {
				res.send(geojson);
			});
		}else{
			//if no results found, empty geoJSON
			res.send({"type":"FeatureCollection","features":[]});
		}
	};
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