var bookshelf = require('bookshelf');
var _ = require('underscore');
var when = require('when');

bookshelf.pg = bookshelf.initialize({
	client: 'sqlite3',
	connection: {
		filename: "./../database/todo.sqlt"
	}
});

var TodoItem = bookshelf.pg.Model.extend({
	tableName: 'todo_item'
});

var TodoItems = bookshelf.pg.Collection.extend({
	model: TodoItem
});

exports.getCurrentTodoList = function(){
	return new TodoItems().fetch();
};

exports.getTodoListItem = function(itemId){
	return new TodoItem({id: itemId}).fetch();
};

exports.saveTodoListItem = function(itemAttributes){
	var d = when.defer();
	
	exports.getTodoListItem(itemAttributes.id)
	.then(function(existingItem){
		if (existingItem != undefined){
			_.each(itemAttributes, function(val, key){
				existingItem.set(key, val);
			})
		} else {
			existingItem = new TodoItem(itemAttributes);
		}
		return existingItem.save();
	})
	.then(function(result){
			d.resolve(result);
	})
	.otherwise(function(result){
			d.reject(result);
	});
	
	return d.promise;
};
