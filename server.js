
var restify = require('restify');

var siteController = require('./scripts/appServer/controllers/siteController.js');
var tesseractController = require('./scripts/appServer/controllers/tesseractController.js');


var server = restify.createServer();
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.jsonp());
server.use(restify.CORS());
server.use(restify.fullResponse());

//Define Endpoints for Site and CRUD functionality
server.get('/getDocuments', tesseractController.getDocuments);
server.get('/loadDatabase', tesseractController.loadDatabase);
server.get('/clearDatabase', tesseractController.clearDatabase);
server.get('/.*', siteController.loadsite);

var port = process.env.PORT || 1337;

server.listen(port, function() {
	console.log('%s listening at %s', server.name, server.url);
});