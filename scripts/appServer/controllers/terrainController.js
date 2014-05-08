var http = require("http");
var _ = require('lodash');
var request = require('request');
var fs = require("fs");
var when = require("when");
    xml2js = require('xml2js');
var data = [];
exports.getSurface = function(req, res, next){
    
	fs.readFile('./projects/SurfaceTest/I-5_SurfaceTest.xyz', 'utf8', function (err,dataset) {
	  	if (err) {
	    	console.log(err);
	    	res.send(err);
	  	}
	  	data = dataset;
	  	
	  	console.log(data);
	  	var remaining = '';
	  	remaining += data;
		var index = remaining.indexOf('\n');
		var count = 0;
		var rowcount;
		var vertices = [];
		var firstX = 0;
		var firstY = 0;
		var lastX = 0;
		var lastY = 0;
		var width = 0;
		var height = 0;
		var xdiff = 0;
		var ydiff = 0;
		var minHeight = 0;
		while (index > -1) {
	      var line = remaining.substring(0, index);
	      remaining = remaining.substring(index + 1);
	      index = remaining.indexOf('\n');
	      if(count > 0)
	      {
	      	var splitData = line.split(',');
	      	if(count == 1)
	      	{
	      		minHeight = parseFloat(splitData[2].replace('\r', ''));
	      		firstX = parseFloat(splitData[0]);
	      		firstY = parseFloat(splitData[1]);
	      	}
	      	else if(count == 2)
	      	{
	      		xdiff = parseFloat(splitData[0]) - firstX;
	      	}
	      	else if(count == (rowcount+1))
	      	{
	      		ydiff = parseFloat(splitData[1]) - firstY;
	      	}
	      	else
	      	{
	      		lastX = parseFloat(splitData[0]);
	      		lastY = parseFloat(splitData[1]);
	      	}
	      	if(minHeight > parseFloat(splitData[2].replace('\r', ''))){
	      		minHeight = parseFloat(splitData[2].replace('\r', ''));
	      	}

	      	var vert = {x: parseFloat(splitData[0]) - firstX + 1, y: parseFloat(splitData[1]) - firstY + 1, z: parseFloat(splitData[2].replace('\r', ''))};
	      	vertices.push(vert);
	  	  }
	  	  else
	  	  {
	  	  	 rowcount = parseFloat(line.replace('\r', ''));
	  	  }
	      count++;
	    }
	    width = lastX - firstX;
	    height = lastY - firstY;
	    
	    console.log(width);
	    console.log(height);
	    var dataset = {rows: rowcount, width: width, height: height, xdiff: xdiff, ydiff: ydiff, minx: firstX, miny: firstY, minz: minHeight, vertices: vertices};
	    //console.log(dataset);
	  	res.send(dataset);
	});


};


exports.getPipe = function(req, res, next){
	fs.readFile('./projects/SurfaceTest/DrillProfile.txt', 'utf8', function (err2,drilldata) {
	  	if (err2) {
	    	console.log(err2);
	    	res.send(err2);
	  	}
	  	var remainingdrill = '';
	  	remainingdrill += drilldata;
		var drillvertices = [];
		var index = remainingdrill.indexOf('\n');
		while (index > -1) {
		    var line = remainingdrill.substring(0, index);
		    remainingdrill = remainingdrill.substring(index + 1);
		    index = remainingdrill.indexOf('\n');
		    var splitData = line.split(',');
			var data = {x: parseFloat(splitData[0]), y: parseFloat(splitData[1]), z: parseFloat(splitData[2].replace('\r', ''))};
	      	drillvertices.push(data);
		}
		var dataset = {vertices: drillvertices};
	    //console.log(dataset);
	  	res.send(dataset);
	 });
};

exports.getBorings = function(req, res, next){
	var borings = [];
	exports.getfile('./projects/SurfaceTest/sample.xml') 
	.then(function (boringsxml)
	{
		return exports.xmlJson(boringsxml)
		.then(function (boringsJSON)
		{
			var previousID = "";
			var depths = [];
			var previousDepth = 0;
			_.each(boringsJSON.dataroot.SAMPLE, function(sample)
			{
				if(previousID !== "" && previousID !== sample.PointID[0])
				{	
					borings.push({SampleID: previousID, x: 0, y: 0, depths: depths});
					depths = [];
				}
				depths.push({depth: parseFloat(sample.Depth[0])});
				previousID = sample.PointID[0];
			});
			borings.push({SampleID: previousID, x: 0, y: 0, depths: depths});
			return exports.getfile('./projects/SurfaceTest/location.xml') 
			.then(function (locationsxml)
			{
				return exports.xmlJson(locationsxml)
				.then(function (locationsJSON)
				{
					var count =0;
					_.each(locationsJSON.dataroot.LOCATION, function(location){
						borings[count].x = parseFloat(location.Longitude[0]);
						borings[count].y = parseFloat(location.Latitude[0]);
						count ++;
					});
					res.send({borings: borings});
					return next();
				});
			});

		});
	});

};

exports.getfile = function(file){
	var d = when.defer();
	fs.readFile(file, 'utf8', function (err2,drilldata) {		
		d.resolve(drilldata);
	});
	return d.promise;
}

exports.xmlJson = function(xml){
	var d = when.defer();
	var parser = new xml2js.Parser();
	parser.parseString(xml, function (err, result) {
        d.resolve(result);
    });
	return d.promise;
}

