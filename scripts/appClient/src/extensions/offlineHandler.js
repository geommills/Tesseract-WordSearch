_.extend(MainApplication, {
	onDeviceOnline : function(e){	
		alert("You are now back online.");	
		//switch to online maps
		MainApplication.views.mapView !== undefined && MainApplication.views.mapView.setBaseMapDefault!== undefined ? MainApplication.views.mapView.setBaseMapDefault() : false;
		//switch to online todos
		GeoAppBase.synchTodoQueue(
			function(){
				//tenative fetch
				MainApplication.models.todos.fetch({
					success: function(){
						MainApplication.clientOfflineMode = false;
						$("#loadingDiv").css("display","none");
						$("#connectionStatus").css({"display":"none"});
					},
					error: function(){
						alert("An error has occurred while syncing data");
						$("#loadingDiv").css("display","none");
					}
				});
			}
		);
		//console.log("Internet Connection Reloaded");
	},
	onDeviceOffline : function(e){
		if(MainApplication.clientOfflineMode!==true){
			//console.log("Switching to offline mode.");
			alert("Your application has gone offline.  Once reconnected the application may have to syncronize before any changes are saved to the server.");
			//switch to offline maps
			MainApplication.views.mapView.setBaseMapOffline();
			MainApplication.clientOfflineMode = true;
			$("#connectionStatus").css({"display":"block"});
		}
	},
	onDevicePause: function(e){
		//do nothing
		//console.log("Paused");
	},
	onDeviceResume: function(e){
		if(MainApplication.connectionActive !== GeoAppBase.connectionAvailable()){
			if(GeoAppBase.connectionAvailable()){
				MainApplication.onDeviceOnline();
			}else{
				ainApplication.onDeviceOffline();
			}
		}
	}
});

//offline event setters
if(GeoAppBase.testPhonegap()){
	document.addEventListener('online', MainApplication.onDeviceOnline, false);
	document.addEventListener('offline', MainApplication.onDeviceOffline, false);
	document.addEventListener('pause', MainApplication.onDevicePause, false);
	document.addEventListener('resume', MainApplication.onDeviceResume, false);
}else{
	//Offline.on("up", MainApplication.onDeviceOnline, this);
	//Offline.on("down", MainApplication.onDeviceOffline, this);
}