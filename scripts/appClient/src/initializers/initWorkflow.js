var this_page_name = "Workflow";
MainApplication.pageInitializer[this_page_name] = MainApplication.module(this_page_name+"Module", function () {
    this.startWithParent = false;
});
MainApplication.pageInitializer[this_page_name].on("start", function (options) {
	//MainApplication.models.WorkflowJobCollection = new WorkflowJobCollection();	
	MainApplication.views.WorkflowView = new WorkflowView({});
	MainApplication.mainRegion.show(MainApplication.views.WorkflowView);
	/*MainApplication.models.WorkflowJobCollection.fetch({
			
			data: { JobIdentifier: '15f4afb0-f309-4ed8-bbaf-5da78fa8de6e'},
			success: function(){
    		MainApplication.views.WorkflowView = new WorkflowView({
    			workflowJobCollection: MainApplication.models.WorkflowJobCollection
    		});
    		MainApplication.mainRegion.show(MainApplication.views.WorkflowView);
				$('#loadingDiv').css('display',"none");
				return false;
			},
			error: function(e){
				console.log("Error retrieving workflows");
				console.log(e);
				$('#loadingDiv').css('display',"none");
				return false;
			}
		});
*/
	MainApplication.views.workflowFooterView = new WorkflowFooterView({});
	MainApplication.footerRegion.show(MainApplication.views.workflowFooterView);	
});
