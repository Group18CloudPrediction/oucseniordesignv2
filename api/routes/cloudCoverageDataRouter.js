var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const cloudCoverageDataController = require("../controllers/cloudCoverageDataController");



router.route("/:stationID/mostrecent")
      .get(cloudCoverageDataController.getMostRecentForStation);
      .post(cloudCoverageDataController.getMostRecentForStation);

      
module.exports = router;
