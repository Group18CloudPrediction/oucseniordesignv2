var express = require('express');
var router = express.Router();

/* GET livestream page. */
router.get('/', function(req, res, next) {
  console.log('Request for livestream recieved');
  res.render('livestream', { title: 'Livestream Test' });
});

/* POST livestream page. */

module.exports = (socketServer) => {
  router.route('/').post((request, response) => {
    console.log("Camera connected")
    request.on('data', function (data) {
      socketServer.broadcast(data);
    });
  });
  return router
};
