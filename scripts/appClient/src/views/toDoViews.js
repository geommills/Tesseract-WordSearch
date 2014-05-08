var TodoItemsView = Backbone.Marionette.ItemView.extend({
	template: function (serialized_model) {
		return Handlebars.buildTemplate(serialized_model, MainApplication.Templates.ToDoItemTemplate);
	},
	templateHelpers: function(){
		this.todos.each(function(todoItem){
			var chkStatus = todoItem.get("Status")==="Complete" ? true : false;
			todoItem.completed = chkStatus;
		});
		return {
			todoObject: this.todos.models
		};
	},
	events: {
		'change .completed-chk': 'completedChanged',
		'mouseover .todoItem': 'highlightTodo',
		'mouseout .todoItem': 'clearTodo'
	},
	initialize: function(options) {
		this.todos = options.todos;
	},
	clearTodo: function(ev){
		$(ev.currentTarget).css({
			"background-color":"#FFFFFF",
			"color": "#000000"
		});		
		var id = $(ev.currentTarget).attr("id").replace("todoItem-","");
		var todo = this.todos.get(id);
		todo.marker.setIcon(todo.getTodoLeafletMarker("teal"));
	},
	completedChanged: function(ev) {
		var id = ev.currentTarget.id.replace("todo-","");
		var currentTodo = this.todos.get(id);
		var newStatus = currentTodo.get("Status") === "Incomplete" ? "Complete" : "Incomplete";
		currentTodo.save({		
			newTodoListItem: {
				Id: currentTodo.get("Id"),
				Description: currentTodo.get("Description"),
				Status: newStatus,
				Latitude: currentTodo.marker._latlng.lat,
				Longitude: currentTodo.marker._latlng.lng
			}			
		});
		currentTodo.marker.openPopup();
	},
	highlightTodo: function(ev){
		$(ev.currentTarget).css({
			"background-color":"#FF4422",
			"color": "#FFFFFF"
		});
		var id = $(ev.currentTarget).attr("id").replace("todoItem-","");
		var todo = this.todos.get(id);
		todo.marker.setIcon(todo.getTodoLeafletMarker("red"));
	}	
});

var TodoAppView = Backbone.Marionette.Layout.extend({
    template: function (serialized_model) {
        return Handlebars.buildTemplate(serialized_model, MainApplication.Templates.ToDoAppTemplate);
    },
    initialize: function (options) {
		//nada
    },
	regions: function(options){
		return {
			todoItems: "#todos"
		};
	},	
	events: {
		'click #add-btn': 'addTodo',
		'click #remove-completed-btn': 'removeCompleted'
	},
	initialize: function(options) {
		this.todos = options.todos;
		this.todos.bind('reset', this.showTodos, this);
		this.todos.bind('add', this.renderOneTodo, this);
		this.todos.bind('remove', this.showTodos, this);
		this.todos.bind('change', this.showTodos, this);
	},
	onShow: function() {
		this.todoItemsView = new TodoItemsView({ todos: this.todos });
		this.showTodos();	
		if (this.todos.length) {
			this.$('#empty').hide();
		} else {
			this.$('#empty').show();
		}
		return false;
	},	
	addTodo: function() {
		MainApplication.views.mapFooterView.addTodos();
	},
	removeCompleted: function() {
		var dc =this;
		var view = this;
		//each doens't work here
		for (var i = this.todos.length - 1; i >= 0; i--){
			if (this.todos.models[i].get('Status') === "Complete") {
				dc.removeCompletedItem(this.todos.models[i]);
			}
		};
		return false;
	},
	removeCompletedItem: function(t){
		t.marker !== undefined ? MainApplication.Map.removeLayer(t.marker) : false;
		$("#todoItem-"+t.cid).remove();
		t.destroy({
			success: function(model, response) {
				//console.log(model);
				//console.log(response);
			}
		});
		return false;
	},	
	renderOneTodo: function(todo) {
		todo.marker = this.todoMarker;
		this.showTodos();
	},
	showTodos: function() {
		this.todoItems.show(this.todoItemsView);
	}
});

var TodoTitleModal = Backbone.Marionette.ItemView.extend({
    template: function(serialized_model) {
		return Handlebars.buildTemplate(serialized_model, MainApplication.Templates.TodoTitleTemplate);
    },
    templateHelpers: function(){
    	if(this.marker !== undefined && this.marker.markerToolTip !== undefined)
    	{
			return {
				todoId: this.marker.markerToolTip.Id,
				Description: this.marker.markerToolTip.Description
			};
		}
	},
    events: {
		"click #btnOK": "saveTodoItem",
		"click #btnCancelAbout": "closeAboutModal",
		"click #btnCancel": "closeAboutModal"
    },
	initialize: function(options){
		this.todos = options.todos;
		this.marker = options.marker;
	},
	onRender: function(){
		this.marker.dragging.enable();
	},
	closeAboutModal: function() {	
		if(this.marker !== undefined && this.marker.markerToolTip !== undefined && this.marker.markerToolTip.Id !== undefined && this.marker.markerToolTip.Id !== null){
			var todo = this.todos.get(this.marker.markerToolTip.Id);
			this.setupTodoDetails(todo);
		}else{
			MainApplication.Map.removeLayer(this.marker);
		}
		//MainApplication.modalRegion.hideModal();
		return false;
	},
	saveTodoItem: function(){
		var dc = this;
		var Id = $('#todoId').val();		
		var description =  $('#Description').val();
		var status = "Incomplete";

		if(Id !== "")
		{
			var thisId = Id.length > 10 ? Id : parseInt(Id);
			var todo = this.todos.get(thisId);
			todo.once("change",function(todo){
				if(GeoAppBase.connectionAvailable()===false){ dc.setupTodoDetails(data); }
			}, this);			
			todo.once("sync",function(data){
				if(GeoAppBase.connectionAvailable()){ dc.setupTodoDetails(data); }
			}, this);
			todo.set({
				Id: thisId,
				Description: description,
				Status: status,
				Latitude: this.marker._latlng.lat,
				Longitude: this.marker._latlng.lng
			});
			todo.save({
				newTodoListItem: {
					Id: thisId,
					Description: description,
					Status: status,
					Latitude: this.marker._latlng.lat,
					Longitude: this.marker._latlng.lng
				}
			});
		}
		else
		{
			this.todos.once("add",function(todo){
				if(GeoAppBase.connectionAvailable()===false){ dc.setupTodoDetails(todo); }
			}, this);
			this.todos.once("sync",function(todo){
				if(GeoAppBase.connectionAvailable()){ dc.setupTodoDetails(todo); }			
			}, this);
			this.todos.create(
				{
					Description: description,
					newTodoListItem: { 
						Description: description,
						Status: 'Incomplete',
						Latitude: this.marker._latlng.lat,
						Longitude: this.marker._latlng.lng
					}	
				}
			);
		}
		this.$('#todoTitle').val('');
	},
	setupTodoDetails: function(todo){
		var todoDetails ={};
		this.marker.todo = todo;
		if(todo.marker === undefined){
			todo.marker = this.marker;
		}
		todo.marker.dragging.disable();
		
		var latlng = [todo.get("Latitude"),todo.get("Longitude")];
		if(latlng[0] !== undefined && latlng[1] !== undefined){
			todo.marker.setLatLng(latlng);
		}

		if(todo.attributes.newTodoListItem !== undefined){
			todoDetails = todo.attributes.newTodoListItem;
		}else{
			todoDetails = todo.attributes;
		}

		todo.marker.markerToolTip = new NewMarkerToolTip({
			todos: this.todos,
			marker: todo.marker
		});
		todo.marker.markerToolTip.Id = todo.get("Id");
		todo.marker.markerToolTip.Description = todo.get("Description");
		todo.marker.markerToolTip.render();
		
		todo.marker.bindPopup(todo.marker.markerToolTip.$el[0], { closeButton:false, closeOnClick:false, minWidth: 200 });
		todo.marker.openPopup();
	}
});

