const mongoose = require('mongoose');

//
// This file is old and no longer used.
// We've kept it just in case, but it should be 
// safe to delete.
//
const PowerPrediction = mongoose.Schema(
    {
        date: {type: Date, required: true},
        time: {type: Date, required: true},
        dateAndTime: {type: Date, required: true},
        stationID: {type: String, required: true},
        // predictions made follow this format:
        // [prediction for timeAndDate+00:01:00, timeAndDate+00:02:00, ... timeAndDate+00:15:00]
        powerPredictionsMade: { type: [Number], required: true },
        
        // other data being predicted goes here
        
        // the solar panel output measured for this very minute
        measuredPowerValue: { type: Number, required: true}
        
    },
    { timestamps: true, collection: "TestPredictions" },
);

module.exports = mongoose.model('powerPredictions', PowerPrediction);
