(function ($) {
    MainApplication.LoadedPages = [];
    MainApplication.viewObjs = [];
    MainApplication.views = [];
    MainApplication.models = [];
    MainApplication.pageInitializer = [];
    MainApplication.Templates = [];
    MainApplication.PageLoader = MainApplication.module("PageLoader", function () {
        //init this and store it for later use
        var page_options = {};
        this.startWithParent = false;
        this.on("before:start", function (options) {
            page_options = options;
			
            //kill the region display
            if (MainApplication.mainRegion !== undefined) { MainApplication.mainRegion.close(); }
            if (MainApplication.pageInitializer !== undefined && MainApplication.pageInitializer[page_options.path] !== undefined) { MainApplication.pageInitializer[page_options.path].stop(); }
            if (MainApplication.views !== undefined) {
                for (var viewToDelete in MainApplication.views) {
					if(viewToDelete !== "indexOf"){
						MainApplication.views[viewToDelete].close();
					}
                }
            }
            MainApplication.views = [];
            MainApplication.vent.unbind();
            //kill all active models/collections
            //kill all active templates
        });
        this.on("start", function() {
            //var scoped so we can use this within the module specifically
            var page_source_files = [];
            this.thisPath = page_options.path;
            if (page_options.path !== undefined && page_options.path !== null) {
                if (MainApplication.ConfigFiles !== undefined && MainApplication.ConfigFiles[page_options.path] !== undefined) {
                    var key;
                    var pathTypes = MainApplication.pathsConfig;
                    for (pathData in pathTypes) {
                        if (MainApplication.ConfigFiles[page_options.path][pathTypes[pathData].setName] !== undefined) {
                            for (key in MainApplication.ConfigFiles[page_options.path][pathTypes[pathData].setName]) {
                                page_source_files.push(pathTypes[pathData].path + "/" + pathTypes[pathData].setName + "/" + MainApplication.ConfigFiles[page_options.path][pathTypes[pathData].setName][key][pathTypes[pathData].name] + "?ver=" + MainApplication.appVersion);
                            }
                        }
                    }
                }
                require(page_source_files, function() {
                    MainApplication.PageLoader.stop();
                });
            }
        });
        this.addFinalizer(function () {
            var this_path = this.thisPath;
            MainApplication.LoadedPages.push(this.thisPath);
			if(MainApplication.ConfigFiles[this.thisPath] !== undefined ){
				require(["scripts/appClient/src/initializers/" + MainApplication.ConfigFiles[this.thisPath].initializers  + "?ver=" + MainApplication.appVersion], function () {
					MainApplication.addInitializer(function () {
						//we pass in page options from the module
						MainApplication.mainRegion.once("show", function () {
							var configPageTitle = MainApplication.ConfigFiles[this_path].sectionName !== undefined ? MainApplication.ConfigFiles[this_path].sectionName : "";
							var configPageContainerClass = MainApplication.ConfigFiles[this_path].containerClass !== undefined ? MainApplication.ConfigFiles[this_path].containerClass : "";
							//once the initializers load, load the page title and custom styles
							MainApplication.views.sitePageTitle = new SiteMasterTitle({
								pageTitle: configPageTitle
							});
							MainApplication.titleRegion.show(MainApplication.views.sitePageTitle);
							MainApplication.mainRegion.$el.attr("class", configPageContainerClass);
						});
						//load application notification events
						MainApplication.ApplicationNotificationLoader.runNotifications(page_options);
						//log pageView
						//	GA.logGAPageView();
						//run the main application
						MainApplication.pageInitializer[this_path].start(page_options);
					});
				});
			}else{
				$(MainApplication.mainRegion.el).html("The requested page could not be loaded.");
			}
        });
    });
	
    //notification loader
    MainApplication.ApplicationNotificationLoader = {};
    MainApplication.ApplicationNotificationLoader.runNotifications = function (options) {
		//options.path === "AppNavigation" && 
		/*if(GeoAppBase.storageGet('siteFirstLoad')==='true' && (GeoAppBase.storageGet('firstLoadModalDisplayed')===undefined || GeoAppBase.storageGet('firstLoadModalDisplayed')===null || GeoAppBase.storageGet('firstLoadModalDisplayed')===false)){
			this.intrusiveNotification = new GeoAppBase.GenericModalInterface({
				modalTitle: "Welcome",
				contentTemplate: "Welcome to the RCO application interface.  From here you may select available applications and contact support.",
				okText: "OK",
				okCallback: function() {
					GeoAppBase.storageSet('firstLoadModalDisplayed',true);
					window[ApplicationName].modalRegion.hideModal();
				},
				cancelCallback: function() {
					GeoAppBase.storageSet('firstLoadModalDisplayed',true);
					window[ApplicationName].modalRegion.hideModal();
				}
			});
			this.intrusiveNotification.once("show", function(){
				window[ApplicationName].modalRegion.lockModal();
			});
			window[ApplicationName].modalRegion.show(this.intrusiveNotification);
		}*/
    };	
})(jQuery);