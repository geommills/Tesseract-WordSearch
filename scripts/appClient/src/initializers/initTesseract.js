var this_page_name = "Tesseract";
MainApplication.pageInitializer[this_page_name] = MainApplication.module(this_page_name+"Module", function () {
    this.startWithParent = false;
});
MainApplication.pageInitializer[this_page_name].on("start", function (options) {
	$('#loadingDiv').css('display',"block");
	MainApplication.views.tesseractView = new TesseractView({});
	MainApplication.mainRegion.show(MainApplication.views.tesseractView);
	MainApplication.views.tesseractFooterView = new TesseractFooterView({});
	MainApplication.footerRegion.show(MainApplication.views.tesseractFooterView);	
});
