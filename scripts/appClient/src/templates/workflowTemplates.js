MainApplication.Templates = MainApplication.Templates || {};
MainApplication.Templates.WorkflowTemplate = [
    "<div id='workflow'><div id='workflowChart'></div></div>",
    "<div id='workflowSelector'><select id=\"ddlSummaryType\">",
			"<option value=\"15f4afb0-f309-4ed8-bbaf-5da78fa8de6e\" selected>UnitTest-Parallel</option>",
		"</select></div>",
].join("\n");


MainApplication.Templates.WorkflowFooterTemplate = [
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