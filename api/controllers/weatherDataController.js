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
    
    var reqBody = req.body;//JSON.parse(req.body);
    var query = {};
    
    
    
    if (req.params.stationID)
        query.system_num = req.params.stationID;
    if (reqBody.startDate) {
        var startDate;
        var endDate;
        
        startDate = new Date(
            parseInt(reqBody.startDate.substring(0,4)), 
            parseInt(reqBody.startDate.substring(5,7))-1, 
            parseInt(reqBody.startDate.substring(8,10)), 
            0, 0, 0
        );
        
        if (reqBody.endDate) {
            endDate = new Date(
                parseInt(reqBody.endDate.substring(0,4)), 
                parseInt(reqBody.endDate.substring(5,7))-1, 
                parseInt(reqBody.endDate.substring(8,10)), 
                23, 59, 59
            );
        }
        else {
            endDate = new Date(new Date() + 24*60*60000); // now() + 1 day
        }
        
        query.date = {"$gte": startDate, "$lte": endDate};
    }
    if (reqBody.startTime && reqBody.endTime)
    {
        var startTimeHour   = parseInt(reqBody.startTime.substring(0, 2));
        var startTimeMinute = parseInt(reqBody.startTime.substring(3, 5));
        var endTimeHour     = parseInt(reqBody.endTime.  substring(0, 2));
        var endTimeMinute   = parseInt(reqBody.endTime.  substring(3, 5));
        
        console.log("start hour "+ startTimeHour + " minute " + startTimeMinute);
        var startTime = 
            new Date (
                1970,
                0,
                0,
                startTimeHour,
                startTimeMinute
            );
        var endTime = 
            new Date (
                1970,
                0,
                0,
                endTimeHour,
                endTimeMinute
            );
        
        query.time_only = {"$gte": startTime, "$lte": endTime};
    }
    
    console.log(query);
    
    execute = (error, data) => {
        if (error) {
            console.log("request failed");
            return res.json({'success':false,'message':error});
        }
        console.log("success!");
        console.log("found " + data.length + " responses");
        return res.json({'success':true,'message':'Data fetched successfully',data});
    }
    
    if (reqBody.onlyMostRecent)
        WeatherDataModel
            .find(query)
            .sort('-date')
            .limit(reqBody.onlyMostRecent)
            .exec(execute)
    else
        WeatherDataModel
            .find(query)
            .exec(execute)
}

module.exports = {
    getAll,
    getAllForStation,
    getTargeted
}
