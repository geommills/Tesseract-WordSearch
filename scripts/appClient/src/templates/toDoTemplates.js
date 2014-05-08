MainApplication.Templates = MainApplication.Templates || {};

MainApplication.Templates.ToDoItemTemplate = [
	"{{#each todoObject}}",
		"<li id='todoItem-{{cid}}' class='todoItem'>",
			"<label class=\"checkbox\">",
				"<input type=\"checkbox\" id='todo-{{cid}}' class=\"completed-chk\" {{#if completed}}checked=\"checked\"{{/if}} />&nbsp;",
				"{{attributes.Description}}",
			"</label>",
		"</li>",
	"{{/each}}"
].join("\n");

MainApplication.Templates.ToDoAppTemplate = [
	"<h1>To-do List</h1>",
	"<p class=\"hide\" id=\"empty\">You don't have any todos! Add one now:</p>",
	"<ul id=\"todos\" class=\"unstyled\">",
	"</ul>",
	"<form class=\"form-inline\">",
	//	"<input id=\"todo-description\" type=\"text\" />",
		"<button id=\"add-btn\" class=\"btn btn-success\">Add</button>",
	"</form>",
	"<p>",
		"<a href id=\"remove-completed-btn\">Remove completed items</a>",
	"</p>"
].join("\n");



MainApplication.Templates.TodoTitleTemplate = [
	"<div class=\"popup-header\">",
		"<div class='buttonContainer usePointer' id=\"btnCancelAbout\"><button type=\"button\" class=\"close\" aria-hidden=\"true\">×</button></div>",
		"<h4 id=\"mySlideLabel\">Edit Todo</h4>",
	"</div>",
	"<div class=\"popup-body\">",
		"<input type='hidden' id='todoId' value='{{todoId}}' />",
		"<div class='col-3 noWrap' style='margin:3px;'><label for='Description' style='width: 90px'> Description:</label><input type='text' name='Description' placeholder='Description'  id='Description' value='{{Description}}' style='width: 200px'/></div>",
	"</div>",
	"<div class=\"popup-footer\">",
		"<button class=\"btn btn-warning\" type=\"button\" id=\"btnCancel\">CANCEL</button>",
		"<button class=\"btn btn-primary\" type=\"button\" id=\"btnOK\">OK</button>",
	"</div>"
].join("\n");