WorkflowView = Backbone.Marionette.ItemView.extend({
    template: function (serialized_model) {
        return Handlebars.buildTemplate(serialized_model, MainApplication.Templates.WorkflowTemplate);
    },
    initialize: function (options) {
        this.workflowJobCollection = options.workflowJobCollection
    },
    onShow: function()
    {
        var width = 960,
        height = 500;

        var chartData = [{
          id: 1,
          name: "Start Workflow",
          fixed: true,
          x: 100,
          y: 100
        },
        {
          id: 2,
          name: "Workflow Task 1",
          fixed: true,
          x: 400,
          y: 50
        },
        {
          id: 3,
          name: "Workflow Task 2",
          fixed: true,
          x: 400,
          y: 150
        },
        {
          id: 4,
          name: "End Workflow",
          fixed: true,
          x: 700,
          y: 100
        }

        ];



        /*var workflowItems = [];
        this.workflowJobCollection.each(function(item){
          chartData.name = item.attributes.QueueName;
          var count=0;
          _.each(item.attributes.DataJson.Blueprint, function(workflow){
              var workflowItem = {
                name: workflow.TaskType,
                children: []
              };

              _.each(workflow.WorkflowStepInfo.Dependents, function(dependent){
                workflowItem.children.push({name: dependent, children: []});
              });

              if(count > 0)
              {
                var foundChild= false;
                _.each(chartData.children, function(child){ 
                  _.each(child.children, function(subChild){   
                    console.log(subChild);        
                    if(subChild.name == workflow.TaskType)
                    {
                      foundChild = true;
                      _.each(workflow.WorkflowStepInfo.Dependents, function(dependent){
                        subChild.children.push({name: dependent, children: []});
                      });
                    }
                  });  
                });
                if(!foundChild)
                {
                  chartData.children.push(workflowItem);
                }
              } 
              else
              {
                chartData.children.push(workflowItem);
              }
              count += 1;
          });
        });

        */
        
          var linkVals = [];
          linkVals.push({source: chartData[0], target : chartData[1]});
          linkVals.push({source: chartData[0], target : chartData[2]});
          linkVals.push({source: chartData[1], target : chartData[3]});
          linkVals.push({source: chartData[2], target : chartData[3]});

        var svg = d3.select("#workflowChart").append("svg")
            .attr("width", width)
            .attr("height", height);

        var force = d3.layout.force()
            .gravity(.05)
            .distance(100)
            .charge(-100)
            .size([width, height]);

          force
              .nodes(chartData)
              .links(linkVals)
              .start();

          var link = svg.selectAll(".link")
              .data(linkVals)
            .enter().append("line")
              .attr("class", "link");

          var node = svg.selectAll(".node")
              .data(chartData)
            .enter().append("g")
              .attr("class", "node")
              .call(force.drag);

          node.append("circle")
              .attr("x", -8)
              .attr("y", -8)
              .attr("width", 16)
              .attr("height", 16);

          node.append("text")
              .attr("dx", 12)
              .attr("dy", ".35em")
              .text(function(d) { return d.name });

          force.on("tick", function() {
            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
          });

           d3.select("#workflowChart").style("height", height + "px");
    },
    onRender: function () {
          //do nothing
          return this;
    }


});

var WorkflowFooterView = Backbone.Marionette.ItemView.extend({
    template: function (serialized_model) {
        return Handlebars.buildTemplate(serialized_model, MainApplication.Templates.WorkflowFooterTemplate);
    },
    initialize: function (options) {
    },
    events: {
        "click #btnWorkflows" : "pickWorkflow",
        "click #btnDetails" : "pickWorkflow"
    },  
    pickWorkflow: function(){
        //Create new marker
        alert(":");
        return false;
    }
});


