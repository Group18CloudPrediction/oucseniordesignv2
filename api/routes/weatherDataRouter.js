var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const weatherDataController = require("../controllers/weatherDataController");


router.get("/", function(req, res, next) {
    res.send("Welcome to the weather data router!");
});

router.route("/getall")
      .get(weatherDataController.getAll)
      
router.get("/:stationID/getall", weatherDataController.getAllForStation);

router.route("/:stationID")
    .post(weatherDataController.getTargeted);

module.exports = router;
