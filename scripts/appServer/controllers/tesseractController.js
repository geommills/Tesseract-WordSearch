var http = require("http");
var us = require('underscore');
var _ = require('lodash');
var request = require('request');
var fs = require("fs");
var when = require("when");
var pgQuery = require('./../src/tesseractPgQuery.js');
var reporters = require('./../src/reporters.js');
var tesseract = require('node-tesseract');
var inspect = require('eyes').inspector({maxLength:20000});
var pdf_extract = require('pdf-extract');
var inspect = require('eyes').inspector({maxLength:20000});
var data = [];


var processQuery = function (params, res, sqlTemplate, asGeoJson) {
	var sqlString = us.template(sqlTemplate, params);	
	var reporter = asGeoJson === true ? reporters.geoJsonReporter(res) : reporters.jsonReporter(res);
	var queryManager = new pgQuery.pgQueryExecutor(sqlString, reporter, reporters.errorReporter);
	queryManager.executeQuery();
};

sqlStrings = {
	documentsSelectAll: "Select id, filename, pages, '' as instances from documents;",
	documentsDeleteAll: "Delete from documents;"
};

exports.getDocuments = function(req, res, next){

	if(req.params.word == undefined)
		{			
			processQuery(req.params, res, sqlStrings.documentsSelectAll, true)
			.then(function (result) {
				res.send(result);
				return next();
			})
			.otherwise(function (error) {
				console.log('error' + error);
				res.send(error);
				return next(error);
			});
		}
};


//Assumes you are looking at pdfs - this may be updated to accomidate other filetypes in the future.

exports.loadDatabase = function(req, res, next){
	var dir='./documents/';
	var data={};
	console.log("Loading Database Now!");
 	var options = {
	    l: 'eng',
	    psm: 6,
	    binary: '/usr/local/bin/tesseract'
	};

	fs.readdir(dir,function(err,files){
    	if (err) console.log(err);
    	var c=0;
    	files.forEach(function(file){
    		if(file !== ".DS_Store")
    		{
		        var options = {
				  type: 'text'  // extract the actual text in the pdf file
				}
				var processor = pdf_extract(dir+file, options, function(err) {
				  if (err) {
				    return callback(err);
				  }
				});


				processor.on('complete', function(data) {
							console.log("File Read Complete");
							//console.log(data.text_pages[0].toString());
							console.log("Pages: " + data.text_pages.length);
						    var text = "";
							for(var i=0; i < data.text_pages.length; i++)
							{
								text += " " + data.text_pages[i].toString().split("'").join("''");
							}
							var sqlString = "Insert into document(name, pages, content) Values ('" + file + "', "+data.text_pages.length+", '"+ text + "');";
							console.log(sqlString);
						  	processQuery(req.params, res, sqlString, true)
							.then(function (result) {
								console.log(result);
								return next();
							})
							.otherwise(function (error) {
								console.log('error' + error);
								res.send(error);
								return next(error);
							});
						  	//inspect(data.text_pages, 'extracted text pages');
						  	//callback(null, text_pages);

				});
				processor.on('error', function(err) {
				  //inspect(err, 'error while extracting pages');
				  return callback(err);
				});

    			console.log(file);
			}
    	});
    	
	});
	res.send("Processing Data Now...");
}

exports.clearDatabase = function(req, res, next){
	processQuery(req.params, res, sqlStrings.documentsDeleteAll, true)
			.then(function (result) {
				res.send(result);
				return next();
			})
			.otherwise(function (error) {
				console.log('error' + error);
				res.send(error);
				return next(error);
			});
}

exports.getfile = function(file){
	var d = when.defer();
	fs.readFile(file, 'utf8', function (err2,filetext) {		
		d.resolve(filetext);
	});
	return d.promise;
}


