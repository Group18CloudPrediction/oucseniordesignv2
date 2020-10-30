const mongoose = require('mongoose');


// 
// Each entry in the PowerVerificationData table of our database will look like this below.
//
// verified_power_data is a JSON string. Examples of what it may look like are listed at the end of this file.
const PowerPredictionValidation = mongoose.Schema(
    {
        author: {type: String, required: false},
        
        verified_power_data: {type: String, required: true},
        verified_time: { type: Date, required: true},
        system_num:    { type: String, required: true }
    },
    { timestamps: true, collection: "PowerVerificationData" },
);

module.exports = mongoose.model('officialPowerPredictionValidations', PowerPredictionValidation);


/*
 EXAMPLE 1:
 
 [
    {
        "py/object": "__main__.VerifiedPowerData", 
        "verified_time": 
        {
            "py/object": "datetime.datetime", 
            "__reduce__": 
            [
                {"py/type": "datetime.datetime"}, 
                ["B+QKDBQtCAibKA=="]
            ]
        }, 
        "percentage": -132.7483701072681, 
        "predicted_value": -318.2206615433097, 
        "actual_value": 104.21208
    }
]


EXAMPLE 2:

[
    {
        "py/object": "__main__.VerifiedPowerData", "
        verified_time": 
        {
            "py/object": "datetime.datetime", 
            "__reduce__": [{"py/type": "datetime.datetime"}, ["B+QKDBQuCAie+w=="]]
        }, 
        "percentage": -128.67898006106225, 
        "predicted_value": -363.3744288608432, 
        "actual_value": 104.21208
    }, 
    {
        "py/object": 
        "__main__.VerifiedPowerData", 
        "verified_time": "datetime.datetime(2020, 10, 12, 20, 46, 8, 564987)", 
        "percentage": -111.65981438560766, 
        "predicted_value": -893.7713462114334, 
        "actual_value": 104.21208
    }
]


the json for verified_power_data works like this:
[verification for prediction from one minute ago, from 2 mins, from 3 mins, ...]

 */
