const mongoose = require('mongoose')
const WeatherDataModel = require('../models/weatherDataModel')

// retrieves all data from the weather data table
// note: this is ALL DATA COLLECTED OVER THE LIFETIME 
// OF THE SYSTEM
function getAll(req, res) {
    // see cloudCoverageDataController.js for a more detailed
    // explanation of how the below calls work.
    
    WeatherDataModel     // search this table
        .find()          // for literally everything
        .exec((error, data) => {
            // send the results as json
            if (error) {
                return res.json({'success':false,'message':error});
            }
            return res.json({'success':true,'message':'Data fetched successfully',data});
        })
}

// retrieves all data collected at a given station
// collected over the lifetime of the system
function getAllForStation(req, res) {
    // see cloudCoverageDataController.js for a more detailed
    // explanation of how the below calls work.
    
    WeatherDataModel                                // search this table
        .find({"system_num": req.params.stationID}) // only entries that match the system_num value
        .exec((error, data) => {
            // send the results as json
            if (error) {
                return res.json({'success':false,'message':error});
            }
            return res.json({'success':true,'message':'Data fetched successfully',data});
        })
}


// this is the most used function in this file, so I added
// console log statements to it to help debugging potential issues.

// retrieves data from the weather data table against 3 potential 
// restrictions:
// 1. the station the data was collected at
// 2. recorded between a given min and max time of day
// 3. recorded between a given date range
//
// this function may also retrieve only a limited number
// of most recent (within the given date range) entries.
//
// POST request body parameters recognized:
// note: any of these may be undefined, and they will be ignored
//
//    stationID        - string
//    startDate        - string of the format "2020-12-01", assumes endDate to be right now (today) if it is undefined in the POST body
//    endDate          - string of the format "2020-12-01", only respected if endDate is also defined
//    startTime        - string of the format "14:02", only respected if endTime is also defined
//    endTime          - string of the format "14:02", only respected if startTime is also defined
//    onlyMostRecent   - integer
//
function getTargeted(req, res) {
    
    console.log("===============================");
    console.log(req.body);
    
    // this function was called by a GET request by mistake
    if(req.body == undefined)
        res.json({'success':false,'message':"no body recieved in post request"});
    
    // set up useful variables
    var reqBody = req.body;//JSON.parse(req.body);
    var query = {};
    
    
    // check for the stationID parameter, and respect it
    if (req.params.stationID)
        query.system_num = req.params.stationID;
    
    // check for the startDate parameter, and validate it
    // if no endDate is specified, assumes endDate to be today
    if (reqBody.startDate) {
        var startDate;
        var endDate;
        
        // turn the startDate into an actual Date object
        startDate = new Date(
            parseInt(reqBody.startDate.substring(0,4)), 
            parseInt(reqBody.startDate.substring(5,7))-1, 
            parseInt(reqBody.startDate.substring(8,10)), 
            0, 0, 0
        );
        
        // if an end date is defined, turn it into a Date object
        // otherwise, assume the value of end date was supposed
        // to be today.
        if (reqBody.endDate) {
            endDate = new Date(
                parseInt(reqBody.endDate.substring(0,4)), 
                parseInt(reqBody.endDate.substring(5,7))-1, 
                parseInt(reqBody.endDate.substring(8,10)), 
                23, 59, 59
            );
        }
        else {
            // adds one day to today to make sure any data actually
            // recorded today is captured
            endDate = new Date(new Date() + 24*60*60000); // now() + 1 day
        }
        
        // put the date range into the query
        query.date = {"$gte": startDate, "$lte": endDate};
    }
    
    // if BOTH start and end time are defined, parse and respect them.
    if (reqBody.startTime && reqBody.endTime)
    {
        // the an example of both of these arguments would look like "14:02"
        var startTimeHour   = parseInt(reqBody.startTime.substring(0, 2));
        var startTimeMinute = parseInt(reqBody.startTime.substring(3, 5));
        var endTimeHour     = parseInt(reqBody.endTime.  substring(0, 2));
        var endTimeMinute   = parseInt(reqBody.endTime.  substring(3, 5));
        
        // recall from weatherDataModel.js that we had a field
        // that encoded the time of day as time from the epoch
        // that means we can encode these arguments as Date objects
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
        
        // the field of the weather data table mentioned above
        query.time_only = {"$gte": startTime, "$lte": endTime};
    }
    
    // log the whole query so programmers fixing bugs can see it
    console.log(query);
    
    // the function we want to have respond to the query
    // it's defined here because we want to use it in two
    // potential places below
    execute = (error, data) => {
        if (error) {
            console.log("request failed");
            return res.json({'success':false,'message':error});
        }
        console.log("success!");
        console.log("found " + data.length + " responses");
        return res.json({'success':true,'message':'Data fetched successfully',data});
    }
    
    // onlyMostRecent is the only parameter we can't encode 
    // in the query object
    
    // see cloudCoverageDataController.js for a more detailed
    // explanation of how the below calls work.
    if (reqBody.onlyMostRecent)
        WeatherDataModel
            .find(query)
            .sort('-date')                // the data should already be sorted like this, but just to be sure
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
