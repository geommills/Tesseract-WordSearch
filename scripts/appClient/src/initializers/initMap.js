//Initial View Loader
var this_page_name = "Map";
MainApplication.pageInitializer[this_page_name] = MainApplication.module(this_page_name+"Module", function () {
    this.startWithParent = false;
});
//Initial View Loader
MainApplication.pageInitializer[this_page_name].on("start", function (options) {
	MainApplication.defaultMarker = new Todo().getTodoLeafletMarker("teal");
	//synching on command:
	//wipe todos, fetch current todos
	var queueItemsPromise=GeoAppBase.localDatabaseCollectionGet("todoItemQueue");
	queueItemsPromise.done(function(data) {		
		MainApplication.activeSynchQueue = data;
		//changes found here
		if(data.length && GeoAppBase.connectionAvailable()){
			var clearPromise = GeoAppBase.localDatabaseCollectionClear("todoItems");
			queueItemsPromise.done(function(d) {
				GeoAppBase.synchTodoQueue();
				//be wary, the content below may need to be made a callback before long
			});
		}
		//continue app as normal after, might become a callback to sync queue depending on promise structure
		MainApplication.models.todos = new Todos();
		MainApplication.views.mapView = new MapView({
			todos: MainApplication.models.todos
		});
		MainApplication.views.mapView.on("show",function(){
			MainApplication.views.toDoView = new TodoAppView({
				todos : MainApplication.models.todos
			});
			//overwrites previous region on init
			MainApplication.addRegions({
			  toDoRegion: "#ToDoContainer"
			});
			MainApplication.toDoRegion.show(MainApplication.views.toDoView);
		});
		//MainApplication.models.todos.fetch({
		//	reset:true, 
		//	dataType: 'json',
		//	cache: false,
		//	success: function(){
				MainApplication.mainRegion.show(MainApplication.views.mapView);		
		//	},
		//	error: function(model, response, options) {
		//		console.log("Error retrieving todos");
		//	}
		//});
			
		MainApplication.views.mapFooterView = new MapFooterView({
			genericCollection: MainApplication.models.genericCollection,
			todos: MainApplication.models.todos
		});
		MainApplication.footerRegion.show(MainApplication.views.mapFooterView);	
	});
});