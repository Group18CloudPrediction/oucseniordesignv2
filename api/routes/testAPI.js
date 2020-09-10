var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {
    res.send("API is working properly");
});

router.get("/mongodb", function(req, res, next) {
    const MongoClient = require('mongodb').MongoClient;
    const uri = require("../../credentials/mongodbCredentials");
    console.log(uri);
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
    const collection = client.db("test").collection("devices");
        // perform actions on the collection object
        client.close();
        res.send("success 1");
    });
    res.send("success 2");
});





module.exports = router;
