"use strict";

var restify = require('restify');
var r = require('rethinkdb');
var Faker = require('Faker');
var util = require('util');

var config = {
  appport: 18865,
  dbhost: 'localhost',
  dbport: 28015,
  dbname: 'drever',
  client1URL: process.env.client1URL,
  testUserID: process.env.testUserID,
  testDriverID: process.env.testDriverID
}

if(process.env.env === "development") {
  config.client1URL = 'http://localhost:' + config.appport;
  config.testUserID = '1c1954d6-b055-4574-8893-2addf92945f4';
  config.testDriverID = '53364e81-2b22-4162-b9ec-8c6a95bbca15';
}

var client1 = restify.createJsonClient({
  url: config.client1URL
});

/** CONSTANTS */
var USER = 'user';
var DRIVER = 'driver';
var BOOKING = 'booking';

var server = restify.createServer();
server.use(restify.CORS());
server.use(restify.queryParser());
server.use(restify.bodyParser());
function corsHandler(req, res, next) {
  // kudos https://github.com/restify/node-restify/issues/296#issuecomment-12333568
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

server.get('/user/get', function(req, res, next) {
  var p = req.params;
  dbconn(function(err, conn) {
    if(err) return res.send(err);
    r.table(USER)
    .get(p.userID)
    .run(conn, function(err, result) {
      return handleSimpleTrans(err, result, conn, res);
    });
  });
});

server.get('/driver/get', function(req, res, next) {
  var p = req.params;
  dbconn(function(err, conn) {
    if(err) return res.send(err);
    r.table(DRIVER)
    .get(p.driverID)
    .run(conn, function(err, result) {
      return handleSimpleTrans(err, result, conn, res);
    });
  });
});

server.get('/user/list', function(req, res, next) {
  dbconn(function(err, conn) {
    if(err) return res.send(err);
    r.table(USER)
    .coerceTo('array')
    .run(conn, function(err, result) {
      return handleSimpleTrans(err, result, conn, res);
    });
  });
});

server.get('/driver/list', function(req, res, next) {
  dbconn(function(err, conn) {
    if(err) return res.send(err);
    r.table(DRIVER)
    .coerceTo('array')
    .run(conn, function(err, result) {
      return handleSimpleTrans(err, result, conn, res);
    });
  });
});

server.get('/booking/list', function(req, res, next) {
  dbconn(function(err, conn) {
    if(err) return res.send(err);
    r.table(BOOKING)
    .coerceTo('array')
    .run(conn, function(err, result) {
      return handleSimpleTrans(err, result, conn, res);
    });
  });
});

server.get('/booking/get', function(req, res, next) {
  var p = req.params;
  dbconn(function(err, conn) {
    if(err) return res.send(err);
    r.table(BOOKING)
    .get(p.bookingID)
    .run(conn, function(err, booking) {
      if(err) return res.json(500, err.toString());

      // inject driver's info into the booking before returning back to the client
      client1.get(apiNS()+'/driver/get?driverID='+booking.driverID,
      function(err, req, result, obj) {
        if(err) return res.json(500, err.toString());
        booking.driver = obj;
        return handleSimpleTrans(err, booking, conn, res);
      });

    });
  });
});

server.get('/booking/:id/delete', function(req, res, next) {
  dbconn(function(err, conn) {
    if(err) return res.json(500, err.toString());
    r.table(BOOKING)
    .get(req.params.id)
    .delete()
    .run(conn, function(err, result) {
      return handleSimpleTrans(err, result, conn, res);
    });
  });
});

server.post('/booking/create', function(req, res, next) {
  var p = req.params;
  dbconn(function(err, conn) {
    if(err) return res.json(500, err);
    r.table(BOOKING)
    .insert({
      userID: p.userID,
      createdTS: now(),
      start_longitude: p.start_longitude,
      start_latitude: p.start_latitude,
      end_longitude: p.end_longitude,
      end_latitude: p.end_latitude,
      pickupTS: p.pickupTS,
      isAllNight: p.isAllNight // true means the valet is for all niiight long
    })
    .run(conn, function(err, result) {
      return handleSimpleTrans(err, result, conn, res);
    });
  });
});

server.post('/booking/update', function(req, res, next) {
  var p = req.params;
  if('state' in p)
    p.state = parseInt(p.state);

  dbconn(function(err, conn) {
    if(err) return res.json(500, err);
    var q = r.table(BOOKING);
    if(!p.all) {
      q = q.get(p.bookingID);
      delete p.bookingID;
    }
    q = q.update(p)
    .run(conn, function(err, result) {
      return handleSimpleTrans(err, result, conn, res);
    });
  });

});

server.get('/booking/complete', function(req, res, next) {
  var data = {
    bookingID: req.params.bookingID,
    state: 2
  };
  client1.post(apiNS() + '/booking/update', data, function(err, req, result, obj) {
    if(err) return res.json(500, err);
    return res.send(obj);
  });
});

server.get('/booking/cancel', function(req, res, next) {
  var data = {
    bookingID: req.params.bookingID,
    state: -1
  };
  client1.post(apiNS() + '/booking/update', data, function(err, req, result, obj) {
    if(err) return res.json(500, err);
    return res.send(obj);
  });
});

// params: bookingID, driverID
server.get('/booking/accept', function(req, res, next) {
  var p = req.params;
  var data = {
    bookingID: p.bookingID,
    driverID: p.driverID
  }
  client1.post(apiNS() + '/booking/update', data, function(err, req, result, obj) {
    if(err) return res.json(500, err);
    return res.send(obj);
  });
});

/** SEED DATA */

server.post('/insertTestBooking', function(req, res, next) {
  var data = {
    userID: config.testUserID,
    start_longitude: 103.8099239,
    start_latitude: 1.3068147,
    end_longitude: 103.8404695,
    end_latitude: 1.2787637,
    pickupTS: now(),
    isAllNight: false
  }
  console.log('creating a test booking request: ' + util.inspect(data));
  client1.post(apiNS() + '/booking/create', data, function(err, req, result, obj) {
    if(err) return res.json(500, err);
    console.log('test booking request creation result: ' + util.inspect(obj));
    return res.send(obj);
  });
});

server.get('/insertTestUser', function(req, res, next) {
  insertTestUser(res);
});

server.get('/insertTestDriver', function(req, res, next) {
  insertTestDriver(res);
});


/** HELPERS */

function now() {
  return (new Date()).getTime();
}

function apiNS() {
  if(process.env.env === "development")
    return '';
  return '/api';
}

function dbconn(cb) {
  r.connect({ host: config.dbhost, port: config.dbport }, function(err, conn) {
    if(err) return cb(err);
    conn.use(config.dbname);
    return cb(null, conn);
  });
}

function handleSimpleTrans(err, result, conn, res) {
  conn.close();
  if(err)
    return res.json(500, err);
  return res.json(result);
}

function insertTestUser(res) {
  var randomName = Faker.Name.findName();
  var randomEmail = Faker.Internet.email();
  dbconn(function(err, conn) {
    if(err) return res.send(err);
    r.table(USER)
    .insert({
      name: randomName,
      email: randomEmail
    })
    .run(conn, function(err, result) {
      return handleSimpleTrans(err, result, conn, res);
    });
  });
}

function insertTestDriver(res) {
  var randomName = Faker.Name.findName();
  var randomEmail = Faker.Internet.email();
  dbconn(function(err, conn) {
    if(err) return res.send(err);
    r.table(DRIVER)
    .insert({
      name: randomName,
      email: randomEmail
    })
    .run(conn, function(err, result) {
      return handleSimpleTrans(err, result, conn, res);
    });
  });
}

/** KICK STARTS */

server.listen(config.appport, function() {
  console.log('Drver Core Server listening at %s', server.url);
});
