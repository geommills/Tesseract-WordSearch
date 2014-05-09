TesseractView = Backbone.Marionette.ItemView.extend({
    template: function (serialized_model) {
        return Handlebars.buildTemplate(serialized_model, MainApplication.Templates.TesseractTemplate);
    },
    initialize: function (options) {
        this.documents = options.tesseractCollection.models[0];
    },
    events: {
        "click #btnSearch": "searchWord"
    },
    onShow: function()
    {
      var dc = this;

      this.loadGrid('');


    },
    loadGrid: function(word)
    {
        var data = this.getGridData(word);
          this.tesseractGrid = new Slick.Grid("#grdTesseract", data, this.getGridColumns(), this.getGridOptions());
          this.tesseractGrid .visible = true;
          this.tesseractGrid .render();
  },
    onRender: function () {
          //do nothing
          return this;
    },
    getGridColumns: function () {
        return [
            { id: "File Name", name: "File Name", field: "name", minWidth: 126, minHeight: 40, sortable: true },
            { id: "Pages", name: "Pages", field: "pages", minWidth: 90, sortable: true },
            { id: "Word Instances", name: "Word Instances", field: "instances", minWidth: 120, sortable: true, resizable: true }
        ];
    },
    getGridOptions: function () {
        return {
            enableCellNavigation: true,
            forceFitColumns: true,
            enableColumnReorder: true
        };
    },
    searchWord: function(){
        this.tesseractGrid.destroy();
        var word = $("#txtWord").val();
        this.loadGrid(word);
    },
    getGridData: function (word) {
        var data = [];
        
        for (var i = 0; i < this.documents.attributes.rows.length; i++) {
            var instanceCount = 0;
            if(word !== '') 
            {
                var regex = new RegExp(word.toLowerCase(), "g");
                var count = this.documents.attributes.rows[i].content.toLowerCase().match(regex);  
                if(count !== undefined && count !== null)
                    instanceCount = count.length;  

            }
            data.push({
                name: this.documents.attributes.rows[i].name,
                pages: this.documents.attributes.rows[i].pages,
                instances: instanceCount
            });
        }
        return data;
    },


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


