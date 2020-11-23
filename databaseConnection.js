var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// grab the connection string from the mongodbCredentials.js file
// unless we're on heroku.
// if you're not using heroku, <process.env.DATABASE_URL ||> can probably be safely deleted
const uri = process.env.DATABASE_URL || require("./credentials/mongodbCredentials");

// simple connection with mongoose
mongoose.connect(
    uri,
    {  useNewUrlParser: true,  useUnifiedTopology: true }
)
.then(
    () => {
        console.log('MongoDB Connected…')
    }
)
.catch(err => console.log(err));
