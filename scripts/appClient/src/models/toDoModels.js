var QueuedTodo = Backbone.Model.extend({
	idAttribute: "Id",
	urlRoot: MainApplication.hostURL + '/processClientSynchEvents'	
});

Backbone.SynchModel = Backbone.Model.extend({
	//disabled for now
	destroy : function(options) { 
		if(options !== undefined &&	options!== null && options.success !== undefined){
			var cb=options.success;
		}else{
			var cb=function(){};
		}
		var model = this;
		//delete model from local database
		GeoAppBase.localDatabaseModelDelete("todoItems",this.get("Id"));
		//offline check, cheap and easy, works with phonegap
		if(GeoAppBase.connectionAvailable()){
			return Backbone.Model.prototype.destroy.call(this, options);		
		}else{
			var guid = GeoAppBase.guid();
			//call it as collection.add to add it to the local collection
			//add change to the queue!  This is where the magic happens!  Awesome!
			var queueObject = { 
				"Uid": guid,			
				"RequestType": 'DeleteTodoItem',
				"EventData" : this.get("Id")
			};
			MainApplication.activeSynchQueue.push(queueObject);
			//add it to the queue
			GeoAppBase.localDatabaseModelSet("todoItemQueue",queueObject,null,"Uid");
			//store it locally
			this.collection.remove(this);
			cb(model);
			return false;
		}
	},
	save : function(options) { 
		if(options !== undefined &&	options!== null && options.success !== undefined){
			var cb=options.success;
		}else{
			var cb=function(){};
		}
		var model = this;
		if(GeoAppBase.connectionAvailable()){
			return Backbone.Model.prototype.save.call(this, options);		
		}else{
			var guid = GeoAppBase.guid();
			//call it as collection.add to add it to the local collection
			//add change to the queue!  This is where the magic happens!  Awesome!
			options.Id = this.get("Id");

			var queueObject = { 
				"Uid": guid,			
				"RequestType": 'UpdateTodoItem',
				"EventData": options.newTodoListItem
			};
			
			MainApplication.activeSynchQueue.push(queueObject);
			model.set(options);
			//add it to the queue
			GeoAppBase.localDatabaseModelSet("todoItemQueue",queueObject,null,"Uid");
			GeoAppBase.localDatabaseModelSet("todoItems",options,null,"Id");
			//store it locally
			cb !== false ? cb() : false;
			return false;
		}
	}
});


var Todo = Backbone.SynchModel.extend({
	idAttribute: "Id",
	urlRoot : MainApplication.hostURL + '/todos',
	defaults: {
		Description: '',
		Status: "Incomplete"
	},
	getTodoLeafletMarker : function(color){
		var thisIconName = GeoAppBase.testPhonegap() === true ? "marker-icon-large" : "marker-icon";
		var valX = GeoAppBase.testPhonegap() === true ? 35 : 25;
		var valY = GeoAppBase.testPhonegap() === true ? 57 : 15;
		var thisMarker = L.divIcon({ 
			iconSize: new L.Point(valX,valY),
			html: this.buildMarkerTemplate( thisIconName, color )
		});	
		return thisMarker;
	},
	buildMarkerTemplate: function(iconName, iconColor){
		var templateHTML = "<div class='markerIconCustom'>"+
			"<img src='content/images/"+iconName+"-{{iconColor}}.png' class='markerImage' />"+
		"</div>";
		var template = Handlebars.buildTemplate({ iconName: iconName, iconColor: iconColor }, templateHTML);
		return template;
	}	 
});


//////////////////////////Collections
var QueuedTodos = Backbone.Collection.extend({
	url: MainApplication.hostURL + '/processClientSynchEvents',
	model: QueuedTodo
});

Backbone.SynchCollection = Backbone.Collection.extend({
	create : function(data, options) {
		options !== undefined ? false : options={};
		var cb = options.success;
		var collection = this;
		//offline check, cheap and easy, works with phonegap
		if(GeoAppBase.connectionAvailable()){
			//console.log("connected!");
			return Backbone.Collection.prototype.create.call(this, data, options);		
		}else{
			var guid = GeoAppBase.guid();
			var queueObject ={
				"Uid": guid,
				"RequestType": 'NewTodoItem',
				"EventData": _.clone(data.newTodoListItem)
			};
			
			//add change to the queue!  This is where the magic happens!  Awesome!
			MainApplication.activeSynchQueue.push(queueObject);
			
			//call it as collection.add to add it to the local collection
			data.newTodoListItem.Id = guid;
			collection.add(data.newTodoListItem);	
			//add it to the queue
			GeoAppBase.localDatabaseModelSet("todoItemQueue",queueObject, null,"Uid");
			//store it locally
			GeoAppBase.localDatabaseModelSet("todoItems",data.newTodoListItem,cb,"Id");
			return false;
		}
	},
	fetch : function(options) {
		options !== undefined ? false : options={} ;
		var cb = options.success !== undefined ? options.success : function(){};
	    var collection = this;
		//offline check, cheap and easy, works with phonegap
		if(GeoAppBase.connectionAvailable()){
			options.success = function(data){
				//make this name agnostic, use url or some other thing
				GeoAppBase.localDatabaseCollectionSet("todoItems",data.toJSON(),cb,"Id");
			}
			return Backbone.Collection.prototype.fetch.call(this, options);		
		}else{
			var data=GeoAppBase.localDatabaseCollectionGet("todoItems",cb);
			data.done(function(data) {
				if(data.length){
					$.when(collection.reset(data)).then( options.success(data) );
				}else{
					alert("This application requires a connection to the internet when opening for the first time.  Please close the program, connect to the internet, and reload the application.");
					GeoAppBase.closeApp();
				}
			});
			/*data.fail(
				function(e) {
					console.log("fail");
					console.log(e);
					throw e; // db connection blocking, or schema mismatch 
				}
			);*/
			return false;
		}
	}
});

var Todos = Backbone.SynchCollection.extend({
	url: MainApplication.hostURL + '/todos',
	model: Todo
});