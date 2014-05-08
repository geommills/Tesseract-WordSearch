var MapView = Backbone.Marionette.Layout.extend({
    template: function (serialized_model) {
        return Handlebars.buildTemplate(serialized_model, MainApplication.Templates.MapView);
    },
    initialize: function (options) {
		this.todos = options.todos;

		this.defaultMap = L.tileLayer('http://a.tiles.mapbox.com/v3/examples.map-y7l23tes/{z}/{x}/{y}.png');
		this.offlineMap = new L.TileLayer.OfflineMBTiles('', {tms:true, minZoom:1, maxZoom: 12,attribution: "Washington"});	
		
		this.mapFirstView = true;
        _.bindAll(this, 'onShow');
    },
    events: {
		"click #lnkOfflineButton" : "setBaseMapOffline",
		"click #lnkDefaultButton" : "setBaseMapDefault",
		"click #lnkSyncQueueData" : "syncLiveData",
		"click #lnkToggleConnection" : "toggleConnection"
	},	
	onShow: function(){
		var dc=this;
		this.bounds = false;
		//set buttons according to internet settings
		this.toggleSetButtons();
		MainApplication.Map === undefined ? MainApplication.Map = L.mapbox.map('map') : false;
		//MainApplication.markerLayer = L.mapbox.markers.layer();
		//MainApplication.Map.addLayer(MainApplication.markerLayer);
			  
		this.loadCurrentMap();
		MainApplication.Map.on("dragstart",function(){
			dc.loadCurrentMap();
		});
		
		//MainApplication.Map.off('click');
		/*MainApplication.Map.on('click', function(e) {
			var todoMarker = dc.addMapMarker(e.latlng);
			MainApplication.views.toDoView.createTodoDetails(todoMarker);
		});*/
		//console.log(MainApplication.models.todos.length);
		for (var i = MainApplication.models.todos.length - 1; i >= 0; i--){
			if(MainApplication.models.todos.models[i].attributes.Latitude !== undefined && MainApplication.models.todos.models[i].attributes.Longitude !== undefined){
				todoMarkerItem = this.addMapMarker({
					"lat": MainApplication.models.todos.models[i].attributes.Latitude, 
					"lng": MainApplication.models.todos.models[i].attributes.Longitude 
				});
				todoMarkerItem.todo = MainApplication.models.todos.models[i];
				MainApplication.models.todos.models[i].marker = todoMarkerItem;
				todoMarkerItem.markerToolTip.Description = MainApplication.models.todos.models[i].attributes.Description;
				todoMarkerItem.markerToolTip.Id = MainApplication.models.todos.models[i].attributes.Id;
				todoMarkerItem.markerToolTip.render();
			}
		};
		this.mapFirstView===true ? MainApplication.Map.setView([47.2270, -122.1212], 8) : false;
		this.mapFirstView=false;
	},
	addMapMarker: function(b){
		var bounds = b;
		var unboundMarker = L.marker([bounds.lat, bounds.lng], {icon: MainApplication.defaultMarker, draggable: false});
		unboundMarker.addTo(MainApplication.Map);
		//MainApplication.markerLayer.add_feature(unboundMarker);
		unboundMarker.markerToolTip = new NewMarkerToolTip({
			todos : this.todos,
			marker: unboundMarker
		});
		unboundMarker.bindPopup(unboundMarker.markerToolTip.$el[0], { closeButton:false, closeOnClick:false });
		unboundMarker.openPopup();
		unboundMarker.on("dragend", function(){
			this.openPopup();
		});
		return unboundMarker;
	},
	clearMapMarkers: function(){
		var collection = this.todos;
		for (var x=0;x<this.todos.length;x++){
			todo = this.todos.models[x];
			MainApplication.Map.removeLayer(todo.marker);
		};
		return false;
	},
	loadCurrentMap: function(){
		if(GeoAppBase.connectionAvailable()){
			MainApplication.Map.hasLayer(this.defaultMap)===false ? this.setBaseMapDefault() : false;
		}else{
			MainApplication.Map.hasLayer(this.offlineMap)===false ? this.setBaseMapOffline() : false;
		}
		return false;
	},
	resetBaseMaps: function(){
		$("#lnkOfflineButton").removeClass('btn-primary');
		$("#lnkDefaultButton").removeClass('btn-primary');
		
		//console.log(MainApplication.Map.hasLayer(this.defaultMap));
		//console.log(MainApplication.Map.hasLayer(this.offlineMap));
		
		if (MainApplication.Map.hasLayer(this.defaultMap)) {
			MainApplication.Map.removeLayer(this.defaultMap);
		}
		if (MainApplication.Map.hasLayer(this.offlineMap)) {
			MainApplication.Map.removeLayer(this.offlineMap);
		}	
	},
	setBaseMapDefault: function(){
		this.resetBaseMaps();
		$("#lnkDefaultButton").addClass('btn-primary');
		this.defaultMap.addTo(MainApplication.Map);
		return false;
	},
	setBaseMapOffline: function(){
		this.resetBaseMaps();
		$("#lnkOfflineButton").addClass('btn-primary');
		this.offlineMap.addTo(MainApplication.Map);
		return false;
	},
	syncLiveData: function(){
		//clear local todos as well, we're syncing!
		GeoAppBase.localDatabaseCollectionClear("todoItems");
		var dc = this;
		
		this.clearMapMarkers();
		this.todos.fetch({
			success: function(){
				dc.onShow();
			}
		});
		return false;
	},
	toggleConnection: function(){
		GeoAppBase.toggleConnectionVar();
		this.toggleSetButtons();
		if(MainApplication.connectionActive === true){
			MainApplication.onDeviceOnline();
		}else{
			MainApplication.onDeviceOffline();
		}
	},
	toggleSetButtons: function(){
		if(MainApplication.connectionActive === true){
			$("#lnkToggleConnection").addClass("btn-primary");
			$("#lnkSyncQueueData").css("display","block");
		}else{
			$("#lnkToggleConnection").removeClass("btn-primary");
			$("#lnkSyncQueueData").css("display","none");
		}	
	}
});	


var NewMarkerToolTip = Backbone.Marionette.ItemView.extend({
    template: function (serialized_model) {
		return Handlebars.buildTemplate(serialized_model, MainApplication.Templates.MapNewMarkerTipTemplate);
    },
	templateHelpers: function(){
		return {
			Description: this.Description
		};
	},	
	events: {
		"click .geoEditTodo" : "editTodo",
		"click .geoDeleteTodo" : "deleteTodo"
	},	
	initialize: function(options){
		this.todos = options.todos;
		this.marker = options.marker;
		this.Description = "New Todo"
	},
	editTodo: function(){		
		var todoTitleModal = new TodoTitleModal({
			todos : this.todos,
			marker : this.marker
		});
		todoTitleModal.render();
		
		this.marker.bindPopup(todoTitleModal.$el[0], { closeButton:false, closeOnClick:false, minWidth: 300 });
		this.marker.openPopup();
		return false;
	},
	deleteTodo: function(){
		if(confirm("Are you sure you want to delete this well site, it will not be recoverable.")){
			var thisTodo = this.todos.get(this.Id);
			thisTodo.destroy();
			MainApplication.Map.removeLayer(thisTodo.marker);
		}
		return false;
	}
});


var MapFooterView = Backbone.Marionette.ItemView.extend({
    template: function (serialized_model) {
        return Handlebars.buildTemplate(serialized_model, MainApplication.Templates.MapFooterTemplate);
    },
    initialize: function (options) {
		this.todos = options.todos;
		this.genericCollection = options.genericCollection;
        _.bindAll(this, 'loadContactUs', 'addTodos');
    },
	events: {
		"click #lnkContactUs" : "loadContactUs",
		"click #lnkTodos" : "addTodos",
		"click #lnkLocate" : "geoLocate"
	},	
	addTodos: function(){
		//Create new marker
		var bounds = MainApplication.Map.getCenter();
		var unboundMarker = L.marker([bounds.lat, bounds.lng], {icon: MainApplication.defaultMarker, draggable: true});
		unboundMarker.addTo(MainApplication.Map);
		unboundMarker.markerEditModal = new TodoTitleModal({
			todos : this.todos,
			marker : unboundMarker
		});
		unboundMarker.markerEditModal.render();
		
		unboundMarker.bindPopup(unboundMarker.markerEditModal.$el[0], { closeButton:false, closeOnClick:false, minWidth: 300 });
		unboundMarker.openPopup();
		unboundMarker.on("dragend", function(){
			this.openPopup();
		});
		return false;
	},		
	loadContactUs: function(){
	 	window[ApplicationName].router.navigate("ContactUs", { trigger: true });
		return false;
	},
	geoLocate: function(){
		if (navigator.geolocation) {
			MainApplication.Map.once('locationfound', function (e) {
				//MainApplication.geoLocationResults = e;
				MainApplication.Map.setView(e.latlng, 13, {animate: false});
			});
			MainApplication.Map.once('locationerror', function (e) {
				alert('We could not locate your position.');
			});		
			MainApplication.Map.locate();
		}else{
			alert("Geolocation is unavailable on this device.  We apologize for any inconvenience.");
		}
		return false;
	}
});
