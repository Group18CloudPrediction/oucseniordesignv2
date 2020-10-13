const mongoose = require('mongoose');

const PowerPredictionValidation = mongoose.Schema(
    {
        author: {type: String, required: false},
        
        verified_power_data: {type: Buffer, required: true},
        verified_time: { type: String, required: true},
        system_num:    { type: String, required: true }
    },
    { timestamps: true, collection: "PowerVerificationData" },
);

module.exports = mongoose.model('officialPowerPredictionValidations', PowerPredictionValidation);
