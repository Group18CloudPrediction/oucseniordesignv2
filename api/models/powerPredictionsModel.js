const mongoose = require('mongoose');

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
    { timestamps: true, collection: "Predictions" },
);

module.exports = mongoose.model('powerPredictions', PowerPrediction);
