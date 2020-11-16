//
// Sets up routes for "http://[SERVER]:[PORT]/cloudCoverageData"
// for a more full explanation, please see weatherDataRouter.js
//
// note: the .get() function sets up a response for when the given url 
// recieves a GET request, while the post() function sets up a response
// for when the given url recieves a POST request
//

var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const cloudCoverageDataController = require("../controllers/cloudCoverageDataController");



router.route("/:stationID/mostrecent")
      .get(cloudCoverageDataController.getMostRecentForStation)
      .post(cloudCoverageDataController.getMostRecentForStation);

      
module.exports = router;
