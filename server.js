var express  = require("express"),
  mongoose   = require("mongoose"),
  bodyParser = require("body-parser"),
  path       = require("path"),
  http       = require("http"),
  webSocket  = require("ws"),
  io         = require("socket.io"),
  url        = require("url"),
  cors       = require("cors"), // cors is required for the api to be able to recieve and respond to requests from the frontend
  //cron       = require("cron"), // for scheduling the emailer
  nodemailer = require("nodemailer"); // for sending emails
  
var app = express(),
  streamServer = http.createServer(app),
  socketio = io(streamServer),
  channels = {},
  viewers = {},
  port = process.env.PORT || 3000;

function addValueToList(map, key, value) {
  //if the list is already created for the "key", then uses it
  //else creates new list for the "key" to store multiple values in it.
  map[key] = map[key] || [];
  map[key].push(value);
}

//sanity check

function createChannel(path) {
  tmpServer = new webSocket.Server({ noServer: true });
    tmpServer.on("connection", function connection(ws) {
      addValueToList(viewers, path, ws);
  });
  channels[path] = tmpServer
}

function initChannels() {
  createChannel("/sub-27");
  createChannel("/sub-28");
  createChannel("/sub-29");
  createChannel("/sub-33");
}

//todo: Try to move route() back to livestreamRoutes.js
function route() {
  var router = express.Router();

  router.route("/:id").post((request, response) => {
    var locationID = request.params.id;
    console.log("location " + locationID + " connected");
    request.on("data", function (data) {
      pushData("/" + locationID, data);
    });
  });
  return router;
}

// this function sets up the base URLs that the routers will expand on
// for example if the backend is hosted on localhost, "https://localhost:3000/weatherData"
// will be the base URL for requesting weather data, and "weatherDataRouter.js" will
// expand on that URL for specific requests (eg "https://localhost:3000/weatherData/getall")
function init_routes() {
  var testAPIRouter          = require("./api/routes/testAPIRouter");
  var weatherDataRouter      = require("./api/routes/weatherDataRouter");
  var powerPredictionsRouter = require("./api/routes/powerPredictionsRouter");
  //var cloudDataRouter        = require("./api/routes/cloudDataRouter");
  //var legacyCloudCoverageRouter = require("./api/routes/legacyCloudCoverageRouter");
  //var legacyCloudMotionRouter   = require("./api/routes/legacyCloudMotionRouter");

  viewer = route();
  app.use("/cloudtrackinglivestream", viewer);
  app.use("/weatherData", weatherDataRouter);
  app.use("/powerPredictions", powerPredictionsRouter);
  //app.use("/cloudData", cloudDataRouter);
  //app.use("/cloudCoverage", legacyCloudCoverageRouter);
  //app.use("/cloudMotion", legacyCloudMotionRouter);
}

async function initEmailer() {
//   const toEmail = require("./config/emailAddressForAnomalyReports");
//   
//   // Generate test SMTP service account from ethereal.email
//   // Only needed if you don't have a real mail account for testing
//   let testAccount = await nodemailer.createTestAccount();
// 
//   // create reusable transporter object using the default SMTP transport
//   let transporter = nodemailer.createTransport({
//     host: "localhost:3000",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: testAccount.user, // generated ethereal user
//       pass: testAccount.pass, // generated ethereal password
//     },
//   });
// 
//   
//   // send mail with defined transport object
//   let info = await transporter.sendMail({
//     from: '"Fred Foo 👻" <foo@example.com>', // sender address
//     to: toEmail, // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>", // html body
//   });
// 
//   console.log("Message sent: %s", info.messageId);
  
  const toEmail = require("./config/emailAddressForAnomalyReports");
  const mailOptions = {
    from:    "ouc.sdproj.2019.2020@gmail.com",
    to:      toEmail,
    subject: 'test',
    text:    'testing text'
  };
  
//   const transporter = nodemailer.sendmail;
//   const transporter = nodemailer.createTransport({
//     service: 'SMTP',
//     auth2
//       user: "ouc.sdproj.2019.2020@gmail.com",
//       pass: "oucIsTheBestSponsor1!A"
//     }
//   });
  
  const transporter = nodemailer.createTransport({
    port: 3000,
    host: 'localhost',
    tls: {
      rejectUnauthorized: false
    }
  });
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log("email error:");
      console.log(error);
      console.log(" ");
    } else {
      console.log("email sent: " + info.response);
    }
  });
}

function pushData (toWho, data) {
  if (!viewers[toWho]) {
    return
  }
  viewers[toWho].forEach(function each(client) {
    if (client.readyState === webSocket.OPEN) {
      client.send(data);
    }
  });
};

function init() {
  app.use(cors()); // as mentioned above, this line where cors is set up allows the backend to respond to the frontend
  app.use(bodyParser.json());

  require('./databaseConnection');
  initChannels();
  init_routes(); // sets up API urls
  //initEmailer();
  
  /// todo: viewers = { }

  // viewerServer.on("connection", function connection(ws, req) {
  //   const location = url.parse(req.url, true);
  //   addValueToList(location.pathname.substring(1), ws);
  // });

  streamServer.on("upgrade", (req, socket, head) => {
    const pathname = url.parse(req.url).pathname;
    viewSrv = channels[pathname]; // local scope pls
    if (!viewSrv) {
      console.log("[error] viewer tried to access invalid strm path " + pathname);
      return
    }
    viewSrv.handleUpgrade(req, socket, head, function done(ws) {
      viewSrv.emit("connection", ws, req);
    });
  });

  //Copy and paste from previous team code
  socketio.on('connection', (client) => {
    console.log('Client Connected');

    client.on('substation', (substation) => {
      console.log('client has connected to substation: ', substation);
      client.join(substation);
    });

    client.on('coverage', (data) => {
      const [frame, substation] = data;
      console.log('coverage received from substation: ', substation);
      client.to(substation).broadcast.emit('coverage', "data:image/png;base64,"+ frame.toString("base64"));
    });

    client.on('shadow', (data) => {
      const [frame, substation] = data;
      console.log('shadow received from substation: ', substation);
      client.to(substation).broadcast.emit('shadow', "data:image/png;base64,"+ frame.toString("base64"));
    });
  });


  // Serve the static files from the React app
  app.use(express.static(path.join(__dirname, "Front_End/build")));
  // Handles any requests that don't match the ones above
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/Front_End/build/index.html"));
  });

  //const port = process.env.PORT || 3000;
  //app.listen(port);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  streamServer.listen(port);
  console.log("App is listening on port " + port);
}
init();
