var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    path = require('path'),
    http = require('http'),
    webSocket = require('ws'),
    socketIO = require('socket.io'),
    url = require('url');

var app = express(),
  streamServer = http.createServer(app),
  //socketio = socketIO(streamServer),
  viewerServer = new webSocket.Server({ server: streamServer}),
  port = process.env.PORT || 3000,
  mongodb = process.env.MONGODB_URI || 'mongodb://localhost/cloudtracking';

  function init_routes() {
    /*
    var livestreamRoute = require('./api/routes/livestreamRoutes')
    (viewerServer);
    */
    viewer = route(viewerServer);
    app.use('/cloudtrackinglivestream', viewer)
  }

  function route (viewerServer) {
    var router = express.Router();

        router.route('/:id').post((request, response) => {
            var locationID = request.params.id
            console.log("location " + locationID + " connected")
            request.on('data', function (data) {
                viewerServer.pushData(locationID, data);
            });
        });
        return router
  }

  function init () {
    viewerServer.pushData = (toWho, data) => {
      viewerList.get(toWho).foreach(function each(client) {
        if (client.readyState === webSocket.OPEN) {
          client.send(data)
        }
      })
    };

  var map = {};

  function addValueToList(key, value) {
      //if the list is already created for the "key", then uses it
      //else creates new list for the "key" to store multiple values in it.
      map[key] = map[key] || [];
      map[key].push(value);
  }

  viewerServer.on('connection', function connection(ws, req) {
    const location = url.parse(req.url, true);
    console.log(location)
    addValueToList(location.pathname.substring(1), ws)
  });

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
