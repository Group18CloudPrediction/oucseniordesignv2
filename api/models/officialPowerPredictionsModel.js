const mongoose = require('mongoose');

const PowerPrediction = mongoose.Schema(
    {
        prediction_start_time: {type: Date, required: true},
        prediction_end_time: {type: Date, required: true},
        
        stationID: {type: String, required: true},
        power_predictions: { type: [Number], required: true },
    },
    { timestamps: true, collection: "PowerPredictionData" },
);

module.exports = mongoose.model('officialPowerPredictions', PowerPrediction);
