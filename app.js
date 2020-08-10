var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var webSocket = require('ws');
var socketIO = require('socket.io');
var http = require('http');

var app = express();
var streamServer = http.createServer(app);
var socketio = socketIO(streamServer);
var socketServer = new webSocket.Server({server: streamServer, path:'/livestream'})

// import routing scripts
var routes = require('./routes/index');
var archiveRoutes = require('./routes/archiveRoutes');
var livestreamRoutes = require('./routes/livestreamRoutes')(socketServer);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// set route scripts to their equivalent URL
app.use('/', routes);
app.use('/archive', archiveRoutes);
app.use('/livestream', livestreamRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

function init() {
  socketServer.broadcast = function (data) {
    socketServer.clients.forEach(function each(client) {
      if (client.readyState === webSocket.OPEN) {
        client.send(data);
      }
    });
  };
}

init();

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
