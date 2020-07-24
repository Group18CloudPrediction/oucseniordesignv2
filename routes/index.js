var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('Request for home recieved');
  res.render('index', { title: 'OUC Cloud Tracking' });
});

module.exports = router;
