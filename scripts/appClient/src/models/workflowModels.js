var WorkflowQueueModel = Backbone.Model.extend({
	url: function() { return MainApplication.hostURL + '/workflowsForQueueName' },
    idAttribute: 'Id'
});

var WorkflowQueueCollection = Backbone.Collection.extend({
    url: MainApplication.hostURL + '/workflowsForQueueName',
    model: WorkflowQueueModel,
	fetch : function(options, b ,c) {
		options !== undefined ? false : options={} ;
		var cb = options.success !== undefined ? options.success : function(){};
	    var collection = this;
		this.url = MainApplication.hostURL + '/workflowsForQueueName';
		if(GeoAppBase.connectionAvailable()){			
			return Backbone.Collection.prototype.fetch.call(this, options);		
		}else{
			return false;
		}
	},
});

var WorkflowJobModel = Backbone.Model.extend({
	url: function() { return MainApplication.hostURL + '/getWorkflowByJobIdentifier' },
    idAttribute: 'Id'
});

var WorkflowJobCollection = Backbone.Collection.extend({
    url: MainApplication.hostURL + '/getWorkflowByJobIdentifier',
    model: WorkflowQueueModel,
	fetch : function(options, b ,c) {
		options !== undefined ? false : options={} ;
		var cb = options.success !== undefined ? options.success : function(){};
	    var collection = this;
		this.url = MainApplication.hostURL + '/workflowForJobIdentifier';
		if(GeoAppBase.connectionAvailable()){			
			return Backbone.Collection.prototype.fetch.call(this, options);		
		}else{
			return false;
		}
	},
});