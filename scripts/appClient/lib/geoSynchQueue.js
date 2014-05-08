var bookshelf = require('bookshelf');
var moment = require('moment');
var when = require('when');
var _ = require('underscore');

bookshelf.workflow = bookshelf.initialize({
	client: 'sqlite3',
	connection: {
		filename: "./../database/todo.sqlt"
	}
});

// synch status = Queued, Processing, Complete, Error

var SynchEvent = bookshelf.workflow.Model.extend({
	tableName: 'geo_synch_event'
});

var SynchEvents = bookshelf.workflow.Collection.extend({
	model: SynchEvent
});

exports.getQueuedEvents = function() {
	return new SynchEvents().fetch();
};

exports.processQueuedEvents = function(processor) {  // processor should return a promise
	var d = when.defer();
	
	exports.processNextEvent(processor)
	.then (function(result){
		return exports.processQueuedEvents(processor).then(d.resolve);
	})
	.otherwise(function (error) {
		console.log(error);
		if (error === 'No Queued Events'){
			d.resolve();
		}
		else {
			d.reject(error);
		}
	});
	
	return d.promise;
};

exports.processNextEvent = function(processor) { // processor should return a promise
	var d = when.defer();
	
	exports.findNextQueuedEvent()
	.then(function(event) {
		if (event === undefined){
			d.reject('No Queued Events');
		} else {
			event.set('synch_status', 'Processing');
			event.set('begin_process_timestamp', moment().format());
			event.save()
			.then(function(){
				return processor(event);
			})
			.then(function(){
				event.set('synch_status', 'Complete');
				event.set('end_process_timestamp', moment().format())
				event.save().then(d.resolve).otherwise(d.reject);
			})
			.otherwise(function(error){
				console.log(error);
				event.set('synch_status', 'Error');
				event.set('end_process_timestamp', moment().format())
				event.set('result_message', error);
				event.save().then(d.resolve).otherwise(d.reject);
			});
		}
	});
	return d.promise;
};

exports.findEvent = function(eventId) {
	return exports.getQueuedEvents()
		.then(function(result){
			sortedModels = _.sortBy(result.models, function(model) {
				return model.queued_timestamp;
			});
			return _.find(sortedModels, function(model){
				return model.attributes.id === eventId;
			});
		});
};

exports.findNextQueuedEvent = function() {
	var d = when.defer();
	exports.getQueuedEvents()
		.then(function(result){
			sortedModels = _.sortBy(result.models, function(model) {
				return model.queued_timestamp;
			});
			d.resolve(_.find(sortedModels, function(model){
				return model.attributes.synch_status === 'Queued';
			}));
		});
	return d.promise;
};










