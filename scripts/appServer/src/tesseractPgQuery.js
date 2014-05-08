var pg = require('pg');
var utilities = require('./utilities.js');
var us = require('underscore');

var errorMessages = {
    postgresConnectError: 'could not connect to postgres',
    postgresQueryError: 'error running query'
};

exports.sqlStrings = {
    wordsearch: ""; 
}

exports.pgQueryExecutor = function (query, success, error) {
    this.executeQuery = function() {
        var conString = "postgres://postgres:geopostgres@localhost:5432/Tesseract";
        
        var client = new pg.Client(conString);	
        console.log(query);
        client.connect(function (err) {
            if (err) error(errorMessages.postgresConnectError);
            client.query(query, function (err, result) {
            	console.log(err);
                if (err) error(errorMessages.postgresQueryError);
                //console.log(result);
                success(result);
                client.end();
            });
        });
    }
};




