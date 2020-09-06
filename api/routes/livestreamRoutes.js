'use strict';
var express = require('express');

var router = express.Router();

module.exports = (viewerServer) => {
    router.route('/:id').post((request, response) => {
        var cameraId = request.params.id
        console.log("Camera " + cameraId + " connected")
        request.on('data', function (data) {
          if (cameraId == 1)
            viewerServer.broadcast(data);
          else if (cameraId == 2)
            viewerServer.broadcast(data);
          else if (cameraId == 3)
            viewerServer.broadcast(data);
          else if (cameraId == 4)
            viewerServer.broadcast(data);
          else
            console.log(cameraId + " is not handled")
        });
    });
    return router
};
/*
module.exports = (viewerServer) => {
    router.route('/').post((request, response) => {
        console.log("Camera connected")
        request.on('data', function (data) {
            viewerServer.broadcast(data);
        });
        viewerServer.on('connection', function connection(ws, req) {
          const location = url.parse(req.url, true);
          console.log("This is the parsed location: " + location);
          // branch your code here based on location.pathname
        });
    });
    return router
};
*/
