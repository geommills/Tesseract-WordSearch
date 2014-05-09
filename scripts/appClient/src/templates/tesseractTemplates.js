MainApplication.Templates = MainApplication.Templates || {};
MainApplication.Templates.TesseractTemplate = [
	"<div id='searchDiv' class='container'><span style=\"font-size: 12pt\">Search for word: </span><input type='text' class='form-control' id='txtWord' placeholder='Search for word occurances' style=\"width: 250px; margin: 15px; display: inline-block\"/><button type=\"button\"  id='btnSearch' text='Search' class=\"btn btn-success\">Search</button>",
    "<div id='grdTesseract' style=\"height: 500px\"></div></div>"
].join("\n");


MainApplication.Templates.TesseractFooterTemplate = [
	"<div class='navbar navbar-inverse navbar-fixed-bottom'>",
		"<div class='navbar-inner'>",
			"<div class='container'>",
				"<ul class='navbar-nav iconsNav'>",
					//"<li id='btnWorkflows' class='navLink'><a href='#' ><i class='icon-comments icon-large'></i><div class='txt'>Worklows</div></a></li>",
					//"<li id='lnkTOC' class='navLink'><a href='#'><i class='icon-filter icon-large'></i><div class='txt'>TOC</div></a></li>",
					//"<li id='btnDetails' class='navLink' style=\"margin-left: 20px\"><a href='#'><i class='icon-compass icon-large'></i><div class='txt'>View Details</div></a></li>",
				"</ul>",
			"</div>",
		"</div>",
	"</div>"
].join("\n");