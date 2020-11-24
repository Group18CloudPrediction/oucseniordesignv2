//
// This file may be unused? It's intended to be used however it currently is not.
// May be safe to delete, but we're keeping it just to be safe.
//

'use strict';
var express = require('express');

var router = express.Router();

module.exports = () => {
  router.route("/:id").post((request, response) => {
    var locationID = request.params.id;
    console.log("location " + locationID + " connected");
    request.on("data", function (data) {
      pushData("/" + locationID, data);
    });
  });
  return router;
};
