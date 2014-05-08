var this_page_name = "Tesseract";
MainApplication.pageInitializer[this_page_name] = MainApplication.module(this_page_name+"Module", function () {
    this.startWithParent = false;
});
MainApplication.pageInitializer[this_page_name].on("start", function (options) {
	$('#loadingDiv').css('display',"block");
	MainApplication.models.tesseractCollection = new TesseractCollection();
	MainApplication.models.tesseractCollection.fetch({
			//data: { keyword: 'test'},
			success: function(){
				MainApplication.views.tesseractView = new TesseractView({
					tesseractCollection: MainApplication.models.tesseractCollection
	    		});
				MainApplication.mainRegion.show(MainApplication.views.tesseractView);
				$('#loadingDiv').css('display',"none");
				return false;
			},
			error: function(e){
				console.log("Error retrieving documents");
				console.log(e);
				$('#loadingDiv').css('display',"none");
				return false;
			}
	});
	MainApplication.views.tesseractFooterView = new TesseractFooterView({});
	MainApplication.footerRegion.show(MainApplication.views.tesseractFooterView);	
});
