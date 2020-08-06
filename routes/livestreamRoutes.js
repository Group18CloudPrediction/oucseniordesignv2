var express = require('express');
var router = express.Router();

/* GET livestream page. */
router.get('/', function(req, res, next) {
  console.log('Request for livestream recieved');
  res.render('livestream', { title: 'Livestream Test' });
});

module.exports = router;
