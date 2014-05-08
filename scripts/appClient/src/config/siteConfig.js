/////////////////////CONFIG FILE//////////////////////////
//App Details
//Version 0.0.1 Build Boilerplate
/////////////////////This application declaration//////////////
var ApplicationName = "MainApplication";
window[ApplicationName] = new Backbone.Marionette.Application();
window[ApplicationName].appVersion = '0.0.1';
//Geoengineers main site loader
var GeoAppBase = new Backbone.Marionette.Application();
//indicates offline status, do not change.
MainApplication.clientOfflineMode = false;
///////////////////////////////////////////////////////////////


/////////////////////This application declaration//////////////
MainApplication.jasmineEnv = jasmine.getEnv();
MainApplication.jasmineEnv.updateInterval = 1000;
var htmlReporter = new jasmine.HtmlReporter();
MainApplication.jasmineEnv.addReporter(htmlReporter);
MainApplication.jasmineEnv.specFilter = function(spec) {
	return htmlReporter.specFilter(spec);
};
var currentWindowOnload = window.onload;

/*
///Sample Test - run in console or create a spec file below///
describe("A todo", function() {
	it("should exist", function() {
		expect(this).toBeDefined();
	});
	it("should have attributes", function() {
		expect(this.attributes).toBeDefined();
	});
	it("should be able to resolve an id", function() {
		expect(this.get("Id")).toBeDefined();
	});
});

MainApplication.jasmineEnv.execute();
*/
///////////////////////////////////////////////////////////////

var schema = {
  stores: [
		{
		  name: 'todoItems',
		  keyPath: 'Id',
		  type: 'TEXT'
		},{
		  name: 'todoItemQueue',
		  keyPath: 'Uid',
		  type: 'TEXT'
		}
	]
};
MainApplication.demoDB = new ydn.db.Storage('backbone-sync-1', schema);
//var objectStore = db.createObjectStore('Dat', { keyPath:'id',autoIncrement: false});

//debug override
MainApplication.connectionActive = true;
MainApplication.activeSynchQueue = [];


Backbone.ajaxSync = Backbone.sync;
Backbone.sync = function(method, model, options) {
    options || (options = {});	
	return Backbone.ajaxSync(method, model, options);
}


/////////////////////BACKBONE PROTO////////////////////////////
//fix for marionette template compilation process, advised via the Marionette JS GitHub Repo
Backbone.Marionette.TemplateCache.prototype.compileTemplate = function (rawTemplate) {
    return Handlebars.compile(rawTemplate);
};
//Backbone.Marionette.View.prototype.on("show",function(){
//	$.placeholder.shim();
//},this);
///////////////////////////////////////////////////////////////
 

////////////////////Application Details//////////////////////////
MainApplication.LandingPage = "Tesseract";
MainApplication.hostURL = window.location.protocol + "//" + window.location.host;
//MainApplication.hostURL = "http://smboilerplate-env.elasticbeanstalk.com";
//path ID 1 is our libraries we bring into the app (as opposed to getting them with bower, this can be for shims, fixes, overrides, whatever, the rest of the paths are arbitrary, and as such as completely flexible, that being said, we store our files in source)
MainApplication.pathsConfig = [
    { "id": "1", "path": "./scripts/appClient", "name": "library", "setName": "lib" },
    { "id": "5", "path": "./scripts/appClient/src", "name": "spec", "setName": "specs" },
    { "id": "2", "path": "./scripts/appClient/src", "name": "model", "setName": "models" },
    { "id": "3", "path": "./scripts/appClient/src", "name": "template", "setName": "templates" },
    { "id": "4", "path": "./scripts/appClient/src", "name": "view", "setName": "views" }
];

//These are the files we use which are stored in the paths above
MainApplication.ConfigFiles = {
    //this page is the default page
    "Map" : {
        "Id": 1,
        "hashPath": "*actions",
        "containerClass": "node-outline",
		//we require these libraries because the modules need to be loaded with the session
		//"lib": [
		//	{ "library" : "./lodash/lodash.underscore.js" },
		//	{ "library" : "./knex/knex.js" },
		//	{ "library" : "./bookshelf/bookshelf.js" }
		//],
        "models": [
            { "model" : "toDoModels.js" }
        ],
        "templates": [
            { "template" : "mapTemplate.js" },
            { "template" : "toDoTemplates.js" }
        ],
        "views": [
            { "view": "mapViews.js" },
            { "view": "toDoViews.js" }
        ],
        "initializers": "initMap.js"
    },
    "ContactUs": {
        "Id": 6,
        "sectionName": "Contact GeoEngineers",
        "containerClass": "node-outline",
        "hashPath": "ContactUs",
        "templates": [
            { "template": "contactUsTemplates.js" }
        ],
        "views": [
            { "view": "contactUsViews.js" },
        ],
        "initializers": "initContactUs.js"
    },
    "Spec": {
        "Id": 7,
        "sectionName": "Node Boilerplate Spec Runner",
        "containerClass": "node-outline",
        "hashPath": "Spec",
        "models": [
            { "model" : "toDoModels.js" }
        ],		
        "initializers": "initSpec.js"
    },
    "Workflow": {
        "Id": 8,
        "sectionName": "GeoEngineers Workflow",
        "containerClass": "",
        "hashPath": "Workflow",
        "models": [
            { "model" : "workflowModels.js" }
        ],
        "templates": [
            { "template": "workflowTemplates.js" }
        ],
        "views": [
            { "view": "workflowViews.js" },
        ],
        "initializers": "initWorkflow.js"
    },
    "Tesseract": {
        "Id": 8,
        "sectionName": "Tesseract Example",
        "containerClass": "",
        "hashPath": "Tesseract",
        "models": [
            { "model" : "tesseractModels.js" }
        ],
        "templates": [
            { "template": "tesseractTemplates.js" }
        ],
        "views": [
            { "view": "tesseractViews.js" },
        ],
        "initializers": "initTesseract.js"
    }
};  