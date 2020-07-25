var express = require('express');
var router = express.Router();

/* GET archive page */
router.get('/', function(req, res, next) {
  console.log('Request for archive recieved');
  res.render('archive', { title: 'Archive' });
});

module.exports = router;
