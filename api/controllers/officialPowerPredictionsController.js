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

const getLatestPredictions = (res, stationID, percentageErrorData/*, forTime*/) => {
    PredictionsModel
        .find({"system_num": stationID})
        //.find({"system_num": stationID, "prediction_start_time": forTime}) // future feature
        .sort("-verified_time")
        .limit(1)
        .exec((error, data) => {
            if (error) {
                return res.json({'success':false,'message':'Some Error'});
            }
            
            data = data[0];
            
            data = {
                historical_worstPercentErrors: percentageErrorData.worstPercentErrors,
                historical_averagePercentErrors: percentageErrorData.averagePercentErrors,
                
                latest_prediction_start_time: data.prediction_start_time,
                latest_power_predictions: data.power_predictions,
                system_num: data.system_num
            }
            
            res.json({'success':true,'message':'Data fetched successfully',data});
        })
}

const getAverageAndWorst_AbsoluteValue_PercentErrors = (res, lookbackDepth, stationID /*, beforeDate*/) => {
    VerificationsModel
        .find({"system_num": stationID})
        //.find({"system_num": stationID, "verified_time": {"$lt": beforeDate}}) // future feature
        .sort("-verified_time")
        .limit(lookbackDepth)
        .exec((error, data) => {
            if (error) {
                return res.json({'success':false,'message':'Some Error'});
            }
            
            var processedData = {
                // [one minute out, two minutes out, three minutes out, ...] 
                worstPercentErrors: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                averagePercentErrors: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            };
            
            var numEntries = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            
            for (var i = 0; i < data.length; i++)
            {
                var thisData = data[i];
                
                const temp = JSON.parse(thisData.verified_power_data);
                
                for (var j = 0; j < temp.length; j++)
                {
                    numEntries[j]++; // found another entry for (j+1) minutes out
                    processedData.averagePercentErrors[j] += Math.abs(temp[j].percentage);
                    processedData.worstPercentErrors[j] = Math.max(Math.abs(temp[j].percentage), processedData.worstPercentErrors[j]);
                }
            }
            
            
            for (var i = 0; i < numEntries.length; i++)
            {
                processedData.averagePercentErrors[i] /= numEntries[i];
            }
            
            getLatestPredictions(res, stationID, processedData);
//             return res.json({'success':true,'message':'Data fetched successfully',data});
//             return data;
        })
}

const getTest3 = (req, res) => {
    var percentageErrorData = getAverageAndWorst_AbsoluteValue_PercentErrors(res, 20, "1");
//     var data = {
//         "percentageErrorData": percentageErrorData
//     }
//     
//     return res.json({'success':true,'message':'Data fetched successfully',data});
}

module.exports = {
    getTest2,
    getTest3
}
