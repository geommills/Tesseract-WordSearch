var TesseractModel = Backbone.Model.extend({
	url: function() { return MainApplication.hostURL + '/tesseractDocs' },
    idAttribute: 'Id'
});

var TesseractCollection = Backbone.Collection.extend({
    url: MainApplication.hostURL + '/terrainDocs',
    model: TesseractModel
});