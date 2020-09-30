var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const weatherDataController = require("../controllers/weatherDataController");

router.route("/getall")
      .get(weatherDataController.getAll)
      
router.route("/:stationID/getall")
      .get(weatherDataController.getAllForStation);

router.route("/:stationID")
      .post(weatherDataController.getTargeted);
      
router.route("/")
      .post(weatherDataController.getTargeted);
      
module.exports = router;
