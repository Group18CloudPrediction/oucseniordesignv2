var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//const uri = require("./credentials/mongodbCredentials");
const uri = process.env.DATABASE_URL;
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
