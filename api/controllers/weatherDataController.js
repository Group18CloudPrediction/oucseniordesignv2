const mongoose = require('mongoose')
const WeatherDataModel = require('../models/weatherDataModel')

function getAll(req, res) {
    WeatherDataModel
        .find()
        .exec((error, data) => {
            if (error) {
                return res.json({'success':false,'message':error});
            }
            return res.json({'success':true,'message':'Data fetched successfully',data});
        })
}

function getAllForStation(req, res) {
    WeatherDataModel
        .find({"system_num": req.params.stationID})
        .exec((error, data) => {
            if (error) {
                return res.json({'success':false,'message':error});
            }
            return res.json({'success':true,'message':'Data fetched successfully',data});
        })
}



function getTargeted(req, res) {
    
    console.log("===============================");
    console.log(req.body);
    
    if(req.body == undefined)
        res.json({'success':false,'message':"no body recieved in post request"});
    
    var reqParams = req.body;//JSON.parse(req.body);
    var query = {};
    
    
    
    if (req.params.stationID)
        query.system_num = req.params.stationID;
    if (reqParams.startDate) {
        var startDate;
        var endDate;
        
        startDate = new Date(
            parseInt(reqParams.startDate.substring(0,4)), 
            parseInt(reqParams.startDate.substring(5,7)), 
            parseInt(reqParams.startDate.substring(8,10)), 
            0, 0, 0
        );
        
        if (reqParams.endDate) {
            endDate = new Date(
                parseInt(reqParams.endDate.substring(0,4)), 
                parseInt(reqParams.endDate.substring(5,7)), 
                parseInt(reqParams.endDate.substring(8,10)), 
                23, 59, 59
            );
        }
        else {
            endDate = new Date(new Date() + 24*60*60000); // now() + 1 day
        }
        
        query.date = {"$gte": startDate, "$lte": endDate};
    }
    if (reqParams.startTime && reqParams.endTime)
    {
        var startTimeHour   = parseInt(reqParams.startTime.substring(0, 2));
        var startTimeMinute = parseInt(reqParams.startTime.substring(3, 5));
        var endTimeHour     = parseInt(reqParams.endTime.  substring(0, 2));
        var endTimeMinute   = parseInt(reqParams.endTime.  substring(3, 5));
        
        console.log("start hour "+ startTimeHour + " minute " + startTimeMinute);
        var startTime = 
            new Date (
                1970,
                1,
                1,
                startTimeHour,
                startTimeMinute
            );
        var endTime = 
            new Date (
                1970,
                1,
                1,
                endTimeHour,
                endTimeMinute
            );
        
        query.time_only = {"$gte": startTime, "$lte": endTime};
    }
    
    console.log(query);
    
    WeatherDataModel
        .find(query)
        .exec((error, data) => {
            if (error) {
                console.log("request failed");
                return res.json({'success':false,'message':error});
            }
            console.log("success!");
            console.log("found " + data.length + " responses");
            return res.json({'success':true,'message':'Data fetched successfully',data});
        })
}

module.exports = {
    getAll,
    getAllForStation,
    getTargeted
}
