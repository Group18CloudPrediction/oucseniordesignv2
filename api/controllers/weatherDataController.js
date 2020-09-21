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
    
    var reqParams = JSON.fromString(req.body);
    var query = {};
    
    if (req.params.stationID != "ALL_STATIONS")
        query.system_num = reqParams.stationID;
    if (req.params.startDate) {
        var endDate;
        if (req.params.endDate)
            endDate = req.params.endDate
        else 
            endDate = new Date(new Date() + 24*60*60000); // now() + 1 day
        reqParams.date = {"$gte": req.params.startDate, "$lte": req.params.endDate};
    }
    if (req.params.startTime && req.params.endTime)
        reqParams.dateMinsOnly = {"$gte": req.params.startTime, "$lte": req.params.endTime};
        
    
    WeatherDataModel
        .find(query)
        .exec((error, data) => {
            if (error) {
                return res.json({'success':false,'message':error});
            }
            return res.json({'success':true,'message':'Data fetched successfully',data});
        })
}

module.exports = {
    getAll,
    getAllForStation,
    getTargeted
}
