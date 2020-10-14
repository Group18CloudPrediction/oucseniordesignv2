var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const PowerPredictionsController = require("../controllers/powerPredictionsController");

const OfficialPowerPredictionsController = require("../controllers/officialPowerPredictionsController");

/* Router for:
 * ~/powerPredictions/
 */ 


router.route("/getall")
    .get(PowerPredictionsController.getAll);
router.route("/get15pastAndFuture/:year/:month/:day/:hour/:minute")
    .get(PowerPredictionsController.getTimeLocal);
router.route("/getNow/:stationID/:year/:month/:day/:hour/:minute")
    .get(PowerPredictionsController.getNowForStation);
router.route("/getMostRecent/:stationID/:year/:month/:day/:hour/:minute")
    .get(PowerPredictionsController.getMostRecentForStation);
router.route("/validate/:stationID")
    .post(PowerPredictionsController.validateForStation);

//router.route("/get15pastAndFuture/:year/:month/:day/:hour/:minute");

router.route('/official')
    .get(OfficialPowerPredictionsController.getTest1)

    
module.exports = router;
