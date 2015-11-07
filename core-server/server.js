"use strict";

var restify = require('restify');
var r = require('rethinkdb');

var config = {
  dbhost: 'localhost',
  dbport: 28015,
  dbname: 'drever'
}

/** CONSTANTS */
var USER = 'user';
var BOOKING = 'booking';

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

/** APIS */
server.get('/list', function(req, res, next) {
  dbconn(function(err, conn) {
    if(err) return res.send(err);
    r.table(BOOKING)
    .coerceTo('array')
    .run(conn, function(err, result) {
      return handleCRUDTrans(err, result, conn, res);
    });
  });
});

server.get('/insertTestUser', function(req, res, next) {
  insertTestUser(res);
});

server.listen(18865, function() {
  console.log('Drver Core Server listening at %s', server.url);
});

/** HELPERS */

function dbconn(cb) {
  r.connect({ host: config.dbhost, port: config.dbport }, function(err, conn) {
    if(err) return cb(err);
    conn.use(config.dbname);
    return cb(null, conn);
  });
}

function handleCRUDTrans(err, result, conn, res) {
  conn.close();
  if(err)
    return res.json(500, err);
  return res.json(result);
}

function insertTestUser(res) {
  dbconn(function(err, conn) {
    if(err) return res.send(err);
    r.table(BOOKING)
    .insert({
      email: 'user1@drever.cangroup.io'
    })
    .run(conn, function(err, result) {
      return handleCRUDTrans(err, result, conn, res);
    });
  });
}
