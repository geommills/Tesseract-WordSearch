var TesseractModel = Backbone.Model.extend({
	url: function() { return MainApplication.hostURL + '/getDocuments' },
    idAttribute: 'Id'
});

var TesseractCollection = Backbone.Collection.extend({
    url: MainApplication.hostURL + '/getDocuments',
    model: TesseractModel
});