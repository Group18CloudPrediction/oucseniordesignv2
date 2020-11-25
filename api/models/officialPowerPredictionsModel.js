const mongoose = require('mongoose');

// 
// Each entry in the PowerPredictionData table of our database will look like this below.
// Note: prediction_start_time is the date and time that the first prediction predicts for
//       prediction_end_time is the date and time one minute after the last prediction
//
// power_predictions is an array 15 elements long. At index 0 is the predicted solar panel
// output for prediction_start_time in kilowats AC. At index 1 is the predicted solar panel
// output for prediction_start_time + 1 minute, etc.
//
// system_num is the id of the station that these predictions are made for, or alternatively,
// the id of the jetson system that they were made on, depending on how the jetsons are set up
// these may be one and the same.
//
// author is mostly unused, but will tell you what script a given entry comes from.
// "PowerPredictionData" is the name of the table these entries will be in
//
const PowerPrediction = mongoose.Schema(
    {
        prediction_start_time: {type: Date, required: true},   
        prediction_end_time: {type: Date, required: true},
        
        system_num: {type: String, required: true},            
        power_predictions: { type: [Number], required: true },
        
        author: {type: String, required: false}
    },
    { timestamps: true, collection: "PowerPredictionData" },
);

module.exports = mongoose.model('officialPowerPredictions', PowerPrediction);
