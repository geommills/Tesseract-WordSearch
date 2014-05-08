TesseractView = Backbone.Marionette.ItemView.extend({
    template: function (serialized_model) {
        return Handlebars.buildTemplate(serialized_model, MainApplication.Templates.TesseractTemplate);
    },
    initialize: function (options) {
    },
    onShow: function()
    {
      var dc = this;
      
    $('#loadingDiv').css('display',"none");
    },
    onRender: function () {
          //do nothing
          return this;
    }


});

var TesseractFooterView = Backbone.Marionette.ItemView.extend({
    template: function (serialized_model) {
        return Handlebars.buildTemplate(serialized_model, MainApplication.Templates.TesseractFooterTemplate);
    },
    initialize: function (options) {
    },
    events: {
        "click #btnWorkflows" : "pickWorkflow",
        "click #btnDetails" : "pickWorkflow"
    },  
    pickWorkflow: function(){
        //Create new marker
        return false;
    }
});


