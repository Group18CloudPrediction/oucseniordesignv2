var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const weatherDataController = require("../controllers/weatherDataController");


router.get("/", function(req, res, next) {
    res.send("Welcome to the weather data router!");
});

router.get("/getall", weatherDataController.getAll);
// router.get("/getday/:?", weatherDataController.getDay); // gets the data for the day posted

router.get("/:stationID/getall", weatherDataController.getAllForStation);

module.exports = router;
