//
// This file creates the API urls and determines what each one should do.
// Note: all urls in this file start with "https://[SERVER URL or IP]:[IP ADDRESS]/weatherData"
// Note: the IP address is defined in server.js
// Note: if the IP address is set to 80, you don't need to specify an ip. 
//       this format will work in that case: "https://[SERVER URL or IP]/weatherData"
//
// For example, if the server is running on localhost with port 3000 
// and we navigate to "https://localhost:3000/weatherData/getall"
// in our browser, the server will execute the function "getAll" in the weatherDataController and send the
// results back via http.
//
// The url stubs below that have a colon in them are special, they're basically variables
// so for example the stub "/:stationID/getall" can be accessed through your browser
// at the url "https://localhost/weatherData/5/getall"
// the number 5 will then be passed to the function weatherDataController.getAllForStation
// as the variable named stationID (ie, getAllForStation will recieve a variable named stationID with the value "5")
//
// Note: the url stub "/" refers to the base url of this file, namely "https://localhost:3000/weatherData"
//
// for what each url does, please see the documentation for the relevant function in weatherDataController
//

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
