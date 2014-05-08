var todoListController = require('./../controllers/todoListController.js');
var when = require('when');
var reporters = require('./../lib/reporters.js');

var req = {
	returnAfterSend: true,
	params: {
		id: 2,
		newItem: { 
			description: 'new item',
			status: 'Incomplete'
		}
	}
};

var res = {
	send: function (message) {
		console.log(message);
	}
};


//todoListController.getCurrentTodoList(req, res, process.exit);
//todoListController.getTodoListItem(req, res, process.exit);


console.log(JSON.stringify({
					id: 1,
					status: 'Complete'
			}));
