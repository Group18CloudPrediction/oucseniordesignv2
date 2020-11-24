//
// This controller is really messy and I'm not happy with how I 
// had to do certain things. I'm sorry to whoever needs to modify
// or fix it! (Hopefully it doesn't need to be fixed though, I'm
// pretty sure it's working fine.)
//
// We wanted power predictions and prediction verifications bundled 
// together. There's no nice way to do that as far as I know. Hence
// the spaghetti.
//
// Here's the idea: first, we get the validation data, and do all our
// calculations on that (more on that later)
// then, we get our predictions
// finally, after we've gotten our predictions back from the db,
// we can send everything we've gotten back as an HTTP response
//
// Now, notice our plan has us querying two different tables 
// (PowerPredictions and PowerPredictionVerifications) for
// a single api call. The only way I found to do this was to put
// one query inside the other. So, I put the PowerPredictions query
// inside the Validations query. This is peak spaghetti for our api
// and I really do not like this solution, but I couldn't figure out
// a better one.
//

const mongoose = require('mongoose')
const PredictionsModel = require('../models/officialPowerPredictionsModel')
const VerificationsModel = require('../models/officialPowerPredictionValidationsModel')

// this is the base function that the API can call
// ensures a valid lookbackDepth is used
// calls the function that querys the Verifications table
const getLatestForStation_predictionsAndVerification = (req, res) => {
    var lookbackDepth = req.body.lookbackDepth || 1;
    getAverageAndWorst_AbsoluteValue_PercentErrors_AndLatestPredictions(res, lookbackDepth, req.params.stationID);
}


// OVERVIEW
// querys the Verifications table
// does some math on the results
// passes the results (plus the latest actual power value) to a function that querys the power predictions table

// MATH? WHAT KIND OF MATH?
// This function first queries for the first `lookbackDepth` number of verification entries
// then, for each prediction timestep, finds the average percent error and the worst percent error
// it then takes the absolute value of everything (so all values returned by this function will
// always be positive)
//
// this function will end with results that look something like this:
// average percent errors: [5%,  10%, 11%, 12%, 11%, 15.3%, 16.5%, 16.8%, 19%,    18%, 21.58%, 22.38%, 25.65%, 28.6%,  30.56%]
// worst percent errors:   [10%, 10%, 20%, 25%, 23%, 22.5%, 30%,   36%,   36.86%, 32%, 40.5%,  58%,    76%,    68.53%, 127.6%]
//
// note: when I say "for each prediction timestep", I mean: (predictions made for 1 minute out, predictions made
// for 2 minutes out ... predictions made for 15 minutes out)
// you can think of these as different prediction types. We just happen to be doing calculations on each type in 
// parallel. So when I say "each prediction timestep", think "each type of prediction". As far as we're concerned, 
// they're unrelated to eachother.
//
const getAverageAndWorst_AbsoluteValue_PercentErrors_AndLatestPredictions = (res, lookbackDepth, stationID /*, beforeDate*/) => {
    VerificationsModel
        .find({"system_num": stationID})
        //.find({"system_num": stationID, "verified_time": {"$lt": beforeDate}}) // future feature
        .sort("-verified_time")
        .limit(lookbackDepth)
        .exec((error, data) => {
            // if we encounter an error or find no data, end EVERYTHING here
            // don't even try to request prediction data
            // tell the HTTP request what happened
            if (error) {
                return res.json({'success':false,'message':'failed to retrieve verification data', 'error':error});
            }
            
            if (!data || data.length <= 0){
                return res.json({'success':false,'message':'failed to retrieve verification data, or no verification data available for station ' + stationID, 'error':error});
            }
            
            // verification data has been requested and recieved as the array `data`
            
            // calculate the average and worst Math.abs(percentageError) values over the reqested period
            var processedData = {
                lookbackDepth: lookbackDepth,
              
                // [one minute out, two minutes out, three minutes out, ...] 
                worstPercentErrors: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                averagePercentErrors: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
              
                // hey, look, a bonus!
                // the below is irrelevant to the math, but it's also data that we want to send
                // back to the client
                latestActualPowerValue: null, 
                latestActualPowerValueTime: data[0].verified_time
            };
            
            // find how many data points we have for each prediction "type" (each prediction timestep)
            var numEntries = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            
            // now might be a good time to review officialPowerPredictionValidations.js
            // every element of data will look like what that file specifies.
            for (var i = 0; i < data.length; i++)
            {
                var thisData = data[i];
                
                // handle some basic "bad data" errors
                if (thisData == null || typeof(thisData) === "undefined" || thisData.verified_power_data == "" || thisData.verified_power_data == null)
                {
                    console.log("Error with thisData: " + thisData);
                    continue;
                }
                
                const temp = JSON.parse(thisData.verified_power_data);
                
                if (temp[0] == null || typeof(temp[0]) === "undefined")
                {
                    console.log("error with json data: " + temp);
                    continue;
                }
                
                // only keep the actual_value from the final element of the data array will
                if(processedData.latestActualPowerValue == null)
                    processedData.latestActualPowerValue = temp[0].actual_value;
                    // every temp[k].actual_value has the same value
                
                // temp is a list of data like so:
                // [data for some prediction made for 1 minute out, 2 minutes out, 3 minutes out, ... 15 minutes out]
                // but may be less than 15 elements long.
                for (var j = 0; j < temp.length; j++)
                {
                    numEntries[j]++; // found another entry for (j+1) minutes out
                    processedData.averagePercentErrors[j] += Math.abs(temp[j].percentage);
                    processedData.worstPercentErrors[j] = Math.max(Math.abs(temp[j].percentage), processedData.worstPercentErrors[j]);
                }
            }
            
            // calculate average percent error for each "type" of prediction
            for (var i = 0; i < numEntries.length; i++)
            {
                processedData.averagePercentErrors[i] /= numEntries[i];
            }
            
            // now get the latest predictions
            // the result will be sent from in there.
            
            getLatestPredictions(res, stationID, processedData);
        })
}


// recieves results from the verifications query
// queries the power predictions table
// sends the results from both queries via HTTP
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
            
            // prepare the data, put it all into one package to send back
            // note: this variable HAS to be called data.
            // the HTML response will name this below JSON object whatever the below variable name is
            // we want it to be "data"
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

module.exports = {
    getLatestForStation_predictionsAndVerification
}
