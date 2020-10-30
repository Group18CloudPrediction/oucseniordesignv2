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
                data = {
                    historical_worstPercentErrors: percentageErrorData.worstPercentErrors,
                    historical_averagePercentErrors: percentageErrorData.averagePercentErrors,
                }
                
                return res.json({'success':false,'message':'Failed to retrieve predictions', 'error':error, data});
            }
            
            data = data[0];
            
            // collate the data
            data = {
                historicalCalculations_lookbackDepth : percentageErrorData.lookbackDepth,
                historical_worstPercentErrors:   percentageErrorData.worstPercentErrors,
                historical_averagePercentErrors: percentageErrorData.averagePercentErrors,
                
                latest_actualPowerValue:     percentageErrorData.latestActualPowerValue,
                latest_actualPowerValueTime: percentageErrorData.latestActualPowerValueTime,
              
                latest_prediction_start_time: data.prediction_start_time,
                latest_power_predictions:     data.power_predictions,
              
                system_num: data.system_num
            }
            
            // send the data
            res.json({'success':true,'message':'Data fetched successfully',data});
        })
}

const getAverageAndWorst_AbsoluteValue_PercentErrors_AndLatestPredictions = (res, lookbackDepth, stationID /*, beforeDate*/) => {
    VerificationsModel
        .find({"system_num": stationID})
        //.find({"system_num": stationID, "verified_time": {"$lt": beforeDate}}) // future feature
        .sort("-verified_time")
        .limit(lookbackDepth)
        .exec((error, data) => {
            if (error) {
                return res.json({'success':false,'message':'failed to retrieve verification data', 'error':error});
            }
            
            if (!data || data.length <= 0){
                return res.json({'success':false,'message':'failed to retrieve verification data, or no verification data available for station ' + stationID, 'error':error});
            }
            
            // verification data has been requested
            
            // calculate the average and worst Math.abs(percentageError) values over the reqested period
            var processedData = {
                // [one minute out, two minutes out, three minutes out, ...] 
                lookbackDepth: lookbackDepth,
              
                worstPercentErrors: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                averagePercentErrors: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                latestActualPowerValue: null,
                latestActualPowerValueTime: data[0].verified_time
            };
            
            var numEntries = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            
            for (var i = 0; i < data.length; i++)
            {
                var thisData = data[i];
                
                if (thisData == null || typeof(thisData) === "undefined" || thisData.verified_power_data == "" || thisData.verified_power_data == null)
                {
                    console.log("Error with thisData: " + thisData);
                    continue;
                }
                
                const temp = JSON.parse(thisData.verified_power_data);
                
                if (temp[0] == null || typeof(temp[0]) === "undefined")
                {
                    console.log("error with temp: " + temp);
                    continue;
                }
                
                if(processedData.latestActualPowerValue == null)
                    processedData.latestActualPowerValue = temp[0].actual_value;
                    // every temp[k].actual_value has the same value
                
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
            
            // now get the latest predictions
            // the result will be sent from in there.
            
            getLatestPredictions(res, stationID, processedData);
        })
}

const getTest3 = (req, res) => {
    var percentageErrorData = getAverageAndWorst_AbsoluteValue_PercentErrors_AndLatestPredictions(res, 20, "1");
//     var data = {
//         "percentageErrorData": percentageErrorData
//     }
//     
//     return res.json({'success':true,'message':'Data fetched successfully',data});
}

const getLatestForStation_predictionsAndVerification = (req, res) => {
    var lookbackDepth = req.body.lookbackDepth || 1;
    getAverageAndWorst_AbsoluteValue_PercentErrors_AndLatestPredictions(res, lookbackDepth, req.params.stationID);
}

module.exports = {
    getTest2,
    getTest3,
    getLatestForStation_predictionsAndVerification
}
