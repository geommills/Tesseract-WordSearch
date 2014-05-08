//This is where we extend various components of the application.  This is preferable to modifying the source JS files, 
//REMEMBER..NEVER build a function here unless it's really useful on a app scope

_.extend(Handlebars, {
    buildTemplate: function (dataModel, template) {
        var handleBarsTemplate = Handlebars.compile(template);
        var data = dataModel;
        return handleBarsTemplate(data);
    },
    buildSelectOptions: function (dataset, valueTemplate, displayTemplate, selectedValue) {
        var retval = "";
        if (dataset != null) {
            for (var i = 0; i < dataset.length; i++) {
				valueRendered = Handlebars.buildTemplate(dataset[i],valueTemplate);
				displayRendered = Handlebars.buildTemplate(dataset[i],displayTemplate);
                if (Handlebars.buildTemplate(dataset[i],valueTemplate) == selectedValue) {
                    retval = retval + "<option selected='true' value='" + valueRendered + "'>" + displayRendered + "</option>";
                } else {
                    retval = retval + "<option value='" + valueRendered + "'>" + displayRendered + "</option>";
                }				
            }
        }
        return retval;
    },
	buildSelectOptionsBB: function (dataset, valueTemplate, displayTemplate, selectedValue) {
        var retval = "";
        if (dataset != null) {
			dataset.each(function(data){
				valueRendered = Handlebars.buildTemplate(data.attributes,valueTemplate);
				displayRendered = Handlebars.buildTemplate(data.attributes,displayTemplate);
                if (Handlebars.buildTemplate(data.attributes,valueTemplate) == selectedValue) {
                    retval = retval + "<option selected='true' value='" + valueRendered + "'>" + displayRendered + "</option>";
                } else {
                    retval = retval + "<option value='" + valueRendered + "'>" + displayRendered + "</option>";
                }
			});
        }
        return retval;
    }
});

//running show(someNewView) blows away the current view within a region and the related view events, 
//essentally killing the event rules, so this is an alternative to the show(loadingView) technique, for already rendered views
//these functions do not affect the DOM status of the view, BUT this can only be used on a rendered view.
_.extend(Backbone.Marionette.View.prototype, {
    startLoading: function () {
        this.$el.hide();
        $("#" + this.$el.parent()[0].id).append("<div id='loading_" + this.cid + "'>" + GeoAppBaseTemplates.loadingIndicator + "</div>");
    },
    endLoading: function () {
        this.$el.show();
        $("#loading_" + this.cid).remove();
    }
});

_.extend(GeoAppBase, { 
	appErrorHandler: function(type){
		if(type==='connection'){
			if(navigator.app !== undefined && navigator.app.exitApp !== undefined && GeoAppBase.testPhonegap()){
				alert("This application requires a connection to the internet.  Please turn on your internet connection and reopen Washington Water Cruiser to continue.");
				GeoAppBase.closeApp();
			}else{
				alert("There was an error recieving data for the application, please ensure your internet is connected and try again.");		
			}
			return false;
		}
		alert("There was an unknown error in the application");
		return false;
	},
	closeApp: function (){
		navigator.app.exitApp();
	},
	//get exact connection type
	checkConnection: function () {
		var networkState = navigator.connection.type;

		var states = {};
		states[Connection.UNKNOWN]  = 'Unknown connection';
		states[Connection.ETHERNET] = 'Ethernet connection';
		states[Connection.WIFI]     = 'WiFi connection';
		states[Connection.CELL_2G]  = 'Cell 2G connection';
		states[Connection.CELL_3G]  = 'Cell 3G connection';
		states[Connection.CELL_4G]  = 'Cell 4G connection';
		states[Connection.CELL]     = 'Cell generic connection';
		states[Connection.NONE]     = 'No network connection';

		return 'Connection type: ' + states[networkState];
	},
	//gets t/f value of wireless presence
	connectionAvailable: function () {
		var networkState = navigator.connection !== undefined ? navigator.connection.type : "Unknown";
		var states = {};	
		//console.log(GeoAppBase.testPhonegap());
		//console.log(window.Connection);
		if(window.Connection){
			states[Connection.NONE]     = 0;
			states[Connection.UNKNOWN]  = 1;
			states[Connection.ETHERNET] = 2;
			states[Connection.WIFI]     = 3;
			states[Connection.CELL_2G]  = 4;
			states[Connection.CELL_3G]  = 5;
			states[Connection.CELL_4G]  = 6;
			states[Connection.CELL]     = 7;
		}
		//console.log("Connection:");
		//console.log(navigator.connection);
		//navigator.onLine checks classical www connections
		return (states[networkState] > 1 || navigator.onLine) && MainApplication.connectionActive===true && MainApplication.clientOfflineMode === false;
		//return (states[networkState] > 1 || navigator.onLine);
	},
	geolocateApp: function(){
		MainApplication.LandingPageMap.locate();		
	},
    getHashTag: function () {
        return window.location.hash.substring(1);
    },
	guid: function () {
	  return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
			 this.s4() + '-' + this.s4() + this.s4() + this.s4();
	},
	s4: function () {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	},	
	jsArrayMove: function (thisArr, old_index, new_index) {
        if (new_index >= thisArr.length) {
            var k = new_index - thisArr.length;
            while ((k--) + 1) {
                thisArr.push(undefined);
            }
        }
        thisArr.splice(new_index, 0, thisArr.splice(old_index, 1)[0]);
        return thisArr; // for testing purposes
    },
    left: function (str, num) {
        return str !== undefined && str !== null ? str.substr(0, num) : null;
    },
    right: function (str, num) {
        return str !== undefined && str !== null ? str.substr(str.length - num, str.length - 1) : null;
    },
	toggleConnectionVar: function(){
		MainApplication.connectionActive=!MainApplication.connectionActive;
		return false;
	},
	//delete by ID
	localDatabaseModelDelete: function(tableName,id) {	
		var df_db = MainApplication.demoDB.remove(tableName,id);	
		return df_db;
	},	
	//get, if id is included use it
	localDatabaseCollectionGet: function(tableName,cb) {
		var df_db = MainApplication.demoDB.values(tableName,null,999999);	
		return df_db;
	},	
	//set. insert or update
	localDatabaseCollectionSet: function(tableName,data,cb,kp) {
		_.each(data,function(item){
			MainApplication.demoDB.put({name: tableName, keyPath: kp}, item).fail(function(e) {
				throw e;
			});
		});
		cb();
	},
	//set. insert or update a single model
	localDatabaseModelSet: function(tableName,data,cb,kp) {
		MainApplication.demoDB.put({name: tableName, keyPath: kp}, data).fail(function(e) {
			throw e;
		});
		cb !== undefined && cb !== null && cb !== false ? cb() : false;
		return false;
	},
	localDatabaseCollectionClear: function(tableName){
		var df_db = MainApplication.demoDB.clear(tableName);
		return df_db;
	},	
	localDatabasesClearAll: function(){
		this.localDatabaseCollectionClear("todoItems");
		this.localDatabaseCollectionClear("todoItemQueue");
	},
	storageGet: function(cookie){
		var returnVal;
		if(window.localStorage){
			returnVal = window.localStorage.getItem(cookie);
		}else{
			returnVal = $.cookie(cookie);
		}
		return returnVal;
	},
	storageSet: function(cookie,value,opts){
		if(window.localStorage){
			//opts ignored here, we don't use them on devices or outside of cookies
			window.localStorage.setItem(cookie,value);
		}else{
			$.cookie(cookie,value,opts);
		}
		return true;
	},
	synchTodoQueue: function(cb){
		$("#loadingDiv").css("display","block");
		var queueItemsPromise=this.localDatabaseCollectionGet("todoItemQueue");
		queueItemsPromise.done(function(data) {
			//clear queue after sending
			//MainApplication.models.todos = new Todos();
			MainApplication.models.queuedTodos = new QueuedTodo();
			var synchEventsObject = { "SynchEvents" : MainApplication.activeSynchQueue };
			MainApplication.models.queuedTodos.save(synchEventsObject, {
				success:function(data){
					MainApplication.models.queuedTodos.clear();
					MainApplication.activeSynchQueue=[];
					GeoAppBase.localDatabaseCollectionClear("todoItemQueue");
					$("#loadingDiv").css("display","none");
					cb !== undefined && cb !== null ? cb() : false;
				},
				error: function(e){
					console.log("There was an error posting.")
					//console.log(e);
				}
			});
		});
		queueItemsPromise.fail(
			function(e) {
				console.log("fail");
				console.log(e);
				throw e; // db connection blocking, or schema mismatch 
			}
		);
	},
	testPhonegap: function(){
		//console.log(window.device);
		//console.log(window.device.cordova);
		//console.log(window.device.cordova);
	
		return window.device !== undefined && window.device.cordova !== null ? true : false;
	}
});