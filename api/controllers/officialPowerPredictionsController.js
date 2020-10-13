const mongoose = require('mongoose')
const PredictionsModel = require('../models/officialPowerPredictionsModel')
const VerificationsModel = require('../models/officialPowerPredictionValidationsModel')
const pickle = require("pickle");


const getTest1 = (req, res) => {
    VerificationsModel
        .find()
        .sort("-date")
        .exec((error, data) => {
            if (error) {
                return res.json({'success':false,'message':'Some Error'});
            }
            
            console.log(data[13]);
            data = data[13];
            console.log(data.verified_power_data);
            pickle.loads(data.verified_power_data, function(original)
            {
                console.log("original:", original);
            });
            
            console.log(data);
            return res.json({'success':true,'message':'Data fetched successfully',data});
        })
}

module.exports = {
    getTest1
}
