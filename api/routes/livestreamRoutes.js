'use strict';
var express = require('express');

var router = express.Router();
module.exports = (viewerServer1, viewerServer2/*, viewerServer3, viewerServer4*/) => {
    router.route('/:id').post((request, response) => {
        var cameraId = request.params.id
        console.log("Camera " + cameraId +"connected")
        request.on('data', function (data) {
          if (cameraId == 1)
            viewerServer1.broadcast(data);
          else if (cameraId == 2)
            viewerServer2.broadcast(data);
          else if (cameraId == 3)
            viewerServer3.broadcast(data);
          else if (cameraId == 4)
            viewerServer4.broadcast(data);
          else
            console.log(cameraId + " is not handled")
        });
    });
    return router
};
/*
module.exports = (viewerServer1) => {
    router.route('/').post((request, response) => {
        console.log("Camera connected")
        request.on('data', function (data) {
            viewerServer1.broadcast(data);
        });
    });
    return router
};
*/
