//
// Sets up the routes for "http://[SERVER]:[PORT]/powerPredictions"
// for a more full explanation, please see weatherDataRouter.js
//
// note: the .get() function sets up a response for when the given url 
// recieves a GET request, while the post() function sets up a response
// for when the given url recieves a POST request
//

var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const PowerPredictionsController = require("../controllers/powerPredictionsController");

const OfficialPowerPredictionsController = require("../controllers/officialPowerPredictionsController");

/* Router for:
 * ~/powerPredictions/
 */ 

// old, defunct routes
// router.route("/getall")
//     .get(PowerPredictionsController.getAll);
// router.route("/get15pastAndFuture/:year/:month/:day/:hour/:minute")
//     .get(PowerPredictionsController.getTimeLocal);
// router.route("/getNow/:stationID/:year/:month/:day/:hour/:minute")
//     .get(PowerPredictionsController.getNowForStation);
// router.route("/getMostRecent/:stationID/:year/:month/:day/:hour/:minute")
//     .get(PowerPredictionsController.getMostRecentForStation);
// router.route("/validate/:stationID")
//     .post(PowerPredictionsController.validateForStation);

//router.route("/get15pastAndFuture/:year/:month/:day/:hour/:minute");

// router.route('/officialSystem_test/test2')
//     .get(OfficialPowerPredictionsController.getTest2)
// router.route('/officialSystem_test/test3')
//     .get(OfficialPowerPredictionsController.getTest3)
router.route('/station/:stationID')
    .get (OfficialPowerPredictionsController.getLatestForStation_predictionsAndVerification)
    .post(OfficialPowerPredictionsController.getLatestForStation_predictionsAndVerification)

    
module.exports = router;
