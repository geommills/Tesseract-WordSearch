var geoSynchQueue = require('./../lib/geoSynchQueue.js');
var todo = require('./todoClient.js');
var when = require('when');
var reporters = require('./../lib/reporters.js');

var synchEventProcessor = function(synchEvent) {
	var d = when.defer();
	console.log('processing todo synch event');
	reporters.eventReporter(synchEvent);
	switch(synchEvent.get('request_type')){
		case 'NewTodoItem':
		case 'UpdateTodoItem':
			todo.saveTodoListItem(JSON.parse(synchEvent.get('event_data'))).then(d.resolve).otherwise(d.reject);
			break;
		case 'NewTodoItemSynch':
			// this is where we process the event by posting it to the rest api so the server can synch
			// this event is nearly identical to 'NewTodoItem', just with a different name
			break;
		default:
			d.reject('Request_type not supported: ' + synchEvent.get('request_type'));
	};
	return d.promise;
};

exports.processQueuedEvents = function () {
	return geoSynchQueue.processQueuedEvents(synchEventProcessor);
};

exports.addEventToQueue = function (synchEvent) {
	
};