var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const cloudDataController = require("../controllers/cloudDataController");


router.route("/getall")
    .get(cloudDataController.getAll);
    
router.route("/mostrecent")
    .get(cloudDataController.getMostRecent);

module.exports = router;
