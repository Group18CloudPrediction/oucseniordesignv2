const mongoose = require('mongoose')
const PredictionsModel = require('../models/officialPowerPredictionsModel')
const VerificationsModel = require('../models/officialPowerPredictionValidationsModel')


// const getTest1 = (req, res) => {
//     VerificationsModel
//         .find()
//         .sort("-date")
//         .exec((error, data) => {
//             if (error) {
//                 return res.json({'success':false,'message':'Some Error'});
//             }
//             
//             console.log(data[13]);
//             data = data[13];
//             console.log(data.verified_power_data);
//             pickle.loads(data.verified_power_data, function(original)
//             {
//                 console.log("original:", original);
//             });
//             
//             console.log(data);
//             return res.json({'success':true,'message':'Data fetched successfully',data});
//         })
// }

const getTest2 = (req, res) => {
    VerificationsModel
        .find()
        .sort("-verified_time")
        .limit(1)
        .exec((error, data) => {
            if (error) {
                return res.json({'success':false,'message':'Some Error'});
            }
            
            //console.log(data[0]);
            data = data[0];
            //console.log(data.verified_power_data);
            const temp = JSON.parse(data.verified_power_data);
            
            console.log(temp);
            
            data = {
                "verified_time": data.verified_time,
                "system_num": data.system_num,
                "verified_power_data": temp,
                "author": data.author
            }
            
            return res.json({'success':true,'message':'Data fetched successfully',data});
        })
}

const getAverageAndWorstPercentErrors = (lookbackDepth) => {
    
}

module.exports = {
    getTest2
}
