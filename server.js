var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    path = require('path'),
    http = require('http'),
    webSocket = require('ws'),
    socketIO = require('socket.io');

var app = express(),
  streamServer = http.createServer(app),
  socketio = socketIO(streamServer),
  socketServer = new webSocket.Server({ server: streamServer, path: '/stream'}),
  port = process.env.PORT || 3000,
  mongodb = process.env.MONGODB_URI || 'mongodb://localhost/cloudtracking';

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'Front_End/build')));
// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/Front_End/build/index.html'));
});

//const port = process.env.PORT || 3000;
app.listen(port);

console.log('App is listening on port ' + port);
