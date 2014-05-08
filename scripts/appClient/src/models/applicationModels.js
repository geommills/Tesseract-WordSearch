//Models
var GenericModel = Backbone.Model.extend({
    urlRoot: 'api/modelname',
    idAttribute: 'Id'
});

/*
var BikePathModel = Backbone.Model.extend({
    urlRoot: 'scripts/source/config/esri_sunriver_conference_poker_ride.geojson',
    idAttribute: 'Id'
});
*/

//Collections
var GenericCollection = Backbone.Collection.extend({
    url: 'api/modelname',
    model: GenericModel
});