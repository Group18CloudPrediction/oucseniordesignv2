const mongoose = require('mongoose')
const PowerPredictionsModel = require('../models/powerPredictionsModel')

const MINUTE_MULTIPLIER = 60000;
    
const getAll = (req, res) => {
    PowerPredictionsModel
        .find()
        .exec((error, data) => {
            if (error) {
                return res.json({'success':false,'message':'Some Error'});
            }
            return res.json({'success':true,'message':'Data fetched successfully',data});
        })
}


const getTimeLocal = (req, res) => {
    //console.log(req.params.time)
    //console.log(req.params.year + " " + req.params.month);
    const date = new Date(req.params.year,
                          req.params.month-1,
                          req.params.day,
                          req.params.hour,
                          req.params.minute);
    const range_in_minutes = 15;
    const start = new Date(date.getTime() - range_in_minutes*MINUTE_MULTIPLIER);
    const end   = new Date(date.getTime() + range_in_minutes*MINUTE_MULTIPLIER);
    
    
    PowerPredictionsModel
        .find({"dateAndTime": {"$gte": start, "$lte": end}})
        .exec((error, data) => {
            if (error) {
                return res.json({'success':false,'message':'Some Error'});
            }
            return res.json({'success':true,'message':'Data fetched successfully',data});
        })
}

const getNowForStation = (req, res) => {
    //console.log(req.params.time)
    console.log("===============================");
    console.log("getNowForStation");
    
    console.log(req.params.year + " " + req.params.month + " " + req.params.day + " " + req.params.hour + " " + req.params.minute);
    const date = new Date(
                 Date.UTC(req.params.year,
                          req.params.month-1,
                          req.params.day,
                          req.params.hour,
                          req.params.minute));
    
    console.log(req.params.stationID + " " + date);
    
    PowerPredictionsModel
        .find({"dateAndTime": date, "stationID": req.params.stationID})
        .exec((error, data) => {
            if (error) {
                return res.json({'success':false,'message':'Some Error'});
            }
            console.log(data);
            
            return res.json({'success':true,'message':'Data fetched successfully',data});
        })
}

const getMostRecentForStation = (req, res) => {
    PowerPredictionsModel
        .find({"dateAndTime": date, "stationID": req.params.stationID})
        .sort('-date')
        .limit(1)
        .exec((error, data) => {
            if (error) {
                return res.json({'success':false,'message':'Some Error'});
            }
            return res.json({'success':true,'message':'Data fetched successfully',data});
        })
}

const validateForStation = (req, res) => {
    
    console.log("===============================");
    console.log("validateForStation");
    
    const success = req.body != undefined &&
                    req.body.year &&
                    req.body.month && 
                    req.body.day &&
                    req.body.hour &&
                    req.body.minute &&
                    req.body.overNMostRecent
    
    if(req.body == undefined)
        res.json({'success':false,'message':"no body recieved in post request"});
    if(!success)
        res.json({'success':false,'message':"malformed post request body"});
    
    
    const date = new Date(Date.UTC(req.body.year, 
                                   req.body.month, 
                                   req.body.day,
                                   req.body.hour,
                                   req.body.minute
                          )
                          + 15*MINUTE_MULTIPLIER)
    
    console.log("Station id" + req.params.stationID);
    
    PowerPredictionsModel
        .find({"dateAndTime": {"$lte": date}, "stationID": req.params.stationID})
        .sort('-dateAndTime')
        .limit(req.body.overNMostRecent+15)
        .exec((error, data) => {
            if (error) {
                return res.json({'success':false,'message':'Some Error'});
            }
            
            //console.log(data)
//             data[15].measuredPowerValue -> data[0].powerPredictionsMade[0]   // newest prediction for data[15].measured
//                                         -> data[1].powerPredictionsMade[1]
//                                         ...
//                                         -> data[14].powerPredictionsMade[14] // oldest prediction for data[15].measured
//             
            var percentErrors = [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0]
            for (var i = 15; i < data.length; i++) {
                // calculate errors for predictions made on data[i].measuredPowerValue
                const realValue = data[i].measuredPowerValue
                
                for (var j = 1; j <= 15; j++) {
                    const predictedValue = data[i-j].powerPredictionsMade[15-j]
                    const percentError = (predictedValue - realValue) / realValue
                    
                    percentErrors[j-1] += percentError
                }
            }
            
            
            for (var i = 0; i < 15; i++) {
                percentErrors[i] /= req.body.overNMostRecent
            }
            
            data = {"data":percentErrors}
            console.log(data)
            
            return res.json({'success':true,'message':'Data fetched successfully',data});
        })
}

module.exports = {
    getAll,
    getTimeLocal,
    getNowForStation,
    getMostRecentForStation,
    validateForStation
}
