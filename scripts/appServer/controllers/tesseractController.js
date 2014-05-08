var http = require("http");
var us = require('underscore');
var _ = require('lodash');
var request = require('request');
var fs = require("fs");
var when = require("when");
var pgQuery = require('./../src/tesseractPgQuery.js');
var tesseract = require('node-tesseract');
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
	        c++;
	        tesseract.process(dir+file, options, function(err, text) {
			    if(err) {
			        console.error(err);
			    } else {
			        console.log(text);
					res.send("Success!");
			    }
			});
    	});
	});
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


