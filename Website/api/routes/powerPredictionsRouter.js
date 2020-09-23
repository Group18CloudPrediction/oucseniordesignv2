var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const PowerPredictionsController = require("../controllers/powerPredictionsController");

router.route("/getall")
    .get(PowerPredictionsController.getAll);
router.route("/get15pastAndFuture/:year/:month/:day/:hour/:minute")
    .get(PowerPredictionsController.getTimeLocal);
router.route("/getNow/:stationID/:year/:month/:day/:hour/:minute")
    .get(PowerPredictionsController.getNowForStation);
router.route("/getMostRecent/:stationID/:year/:month/:day/:hour/:minute")
    .get(PowerPredictionsController.getMostRecentForStation);


//router.route("/get15pastAndFuture/:year/:month/:day/:hour/:minute");


    
module.exports = router;
