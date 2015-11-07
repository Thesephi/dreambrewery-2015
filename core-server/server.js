"use strict";

var restify = require('restify');

var server = restify.createServer();
server.use(restify.CORS());
server.use(restify.queryParser());
server.use(restify.bodyParser());
function corsHandler(req, res, next) {
  res.setHeader('Access-Control-Allow-Headers', 'Accept, Access-Control-Allow-Credentials, Access-Control-Allow-Headers, Access-Control-Allow-Methods, Access-Control-Allow-Origin, Content-Type');
  res.setHeader('Access-Control-Allow-Methods', '*');
  return next();
}
function optionsRoute(req, res, next) {
  res.send(200);
  return next();
}
server.opts('/\.*/', corsHandler, optionsRoute);

server.get('/test', function(req, res, next) {
  res.json(200, "Hi, Drever User!");
});

server.listen(18865, function() {
  console.log('Drver Core Server listening at %s', server.url);
});
