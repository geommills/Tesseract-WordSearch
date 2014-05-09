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
    loadGrid: function()
    {
        var data = this.getGridData();
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
        var word = $("#txtWord").val();
        if(word.length > 2)
        {
        var dc= this;
        if(word === '') word = '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~';
       $('#loadingDiv').css('display',"block");
        MainApplication.models.tesseractCollection = new TesseractCollection();
        MainApplication.models.tesseractCollection.fetch({
            data: { word: word},
            success: function(){
                dc.tesseractGrid.destroy();
                dc.documents = MainApplication.models.tesseractCollection.models[0];
                dc.loadGrid();
                $('#loadingDiv').css('display',"none");
                return false;
            },
            error: function(e){
                console.log(e);
                $('#loadingDiv').css('display',"none");
                return false;
            }
        });
        }
        else
        {
            alert("Words must be longer that 2 letters. Queries will take too long with shorter words.")
        }
    },
    getGridData: function () {
        var data = [];
        
        for (var i = 0; i < this.documents.attributes.rows.length; i++) {
            /*var instanceCount = 0;
            if(word !== '') 
            {
                var regex = new RegExp(word.toLowerCase(), "g");
                var count = this.documents.attributes.rows[i].content.toLowerCase().match(regex);  
                if(count !== undefined && count !== null)
                    instanceCount = count.length;  

            }*/
            data.push({
                name: this.documents.attributes.rows[i].name,
                pages: this.documents.attributes.rows[i].pages,
                instances: this.documents.attributes.rows[i].patternmatch
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


