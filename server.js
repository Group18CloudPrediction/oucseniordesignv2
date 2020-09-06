var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    path = require('path'),
    http = require('http'),
    webSocket = require('ws'),
    socketIO = require('socket.io');

var app = express(),
  streamServer = http.createServer(app),
  //socketio = socketIO(streamServer),
  viewerServer1 = new webSocket.Server({ server: streamServer, path: '/stream1'}),
  viewerServer2 = new webSocket.Server({ server: streamServer, path: '/stream2'}),
  //viewerServer3 = new webSocket.Server({ server: streamServer, path: '/stream3'}),
  //viewerServer4 = new webSocket.Server({ server: streamServer, path: '/stream4'}),
  port = process.env.PORT || 3000,
  mongodb = process.env.MONGODB_URI || 'mongodb://localhost/cloudtracking';

  function init_routes() {
    var livestreamRoute = require('./api/routes/livestreamRoutes')
    (viewerServer1/*, viewerServer2, viewerServer3, viewerServer4*/);

    app.use('/cloudtrackinglivestream', livestreamRoute)
  }

  function init () {
    viewerServer1.broadcast = function (data) {
      viewerServer1.clients.forEach(function each(client) {
        if (client.readyState === webSocket.OPEN) {
          client.send(data);
        }
      });
    };
    init_routes();
  // Serve the static files from the React app
  app.use(express.static(path.join(__dirname, 'Front_End/build')));
  // Handles any requests that don't match the ones above
  app.get('*', (req,res) =>{
      res.sendFile(path.join(__dirname+'/Front_End/build/index.html'));
  });

  //const port = process.env.PORT || 3000;
  //app.listen(port);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  streamServer.listen(port);
  console.log('App is listening on port ' + port);
}
init();
