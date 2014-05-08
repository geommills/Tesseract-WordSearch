
var restify = require('restify');

var siteController = require('./scripts/appServer/controllers/siteController.js');
var terrainController = require('./scripts/appServer/controllers/terrainController.js');


var server = restify.createServer();
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.jsonp());
server.use(restify.CORS());
server.use(restify.fullResponse());

//Define Endpoints for Site and CRUD functionality
server.get('/terrain3d', terrainController.getSurface);
server.get('/pipe3d', terrainController.getPipe);
server.get('/borings3d', terrainController.getBorings);
server.get('/.*', siteController.loadsite);

var port = process.env.PORT || 1337;

server.listen(port, function() {
	console.log('%s listening at %s', server.name, server.url);
});