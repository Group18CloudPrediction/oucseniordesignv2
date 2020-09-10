var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");

router.get("/", function(req, res, next) {
    res.send("API is working properly");
});


// router.get("/mongodb", function(req, res, next) {
//     const MongoClient = require('mongodb').MongoClient;
//     const uri = require("../../credentials/mongodbCredentials");
//     console.log(uri);
//     const client = new MongoClient(uri, { useNewUrlParser: true });
//     client.connect(err => {
//         const collection = client.db("test").collection("devices");
//         // perform actions on the collection object
//         client.close();
//         res.send("success 1");
//     });
//     res.send("success 2");
// });

router.get("/mongoose", function(req, res, next) {
    const uri = require("../../credentials/mongodbCredentials");
    mongoose.connect(
        uri, 
        {  useNewUrlParser: true,  useUnifiedTopology: true}
    )
    .then(
        () => {  
            console.log('MongoDB Connected…')
        }
    )
    .catch(err => console.log(err));
    
    res.send("hi");
});

// const MovieCtrl = require('../controllers/testAPIController')
// 
// router.post('/movie', MovieCtrl.createMovie)
// //router.put('/movie/:id', MovieCtrl.updateMovie)
// //router.delete('/movie/:id', MovieCtrl.deleteMovie)
// //router.get('/movie/:id', MovieCtrl.getMovieById)
// router.get('/movies', MovieCtrl.getMovies)


router.get("/test", function(req, res, next) {
    res.send("API really is working properly and I mean it");
});

module.exports = router;
