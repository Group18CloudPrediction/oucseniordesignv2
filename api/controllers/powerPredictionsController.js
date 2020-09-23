const mongoose = require('mongoose')
const PowerPredictionsModel = require('../models/powerPredictionsModel')

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
    const start = new Date(date.getTime() - range_in_minutes*60000);
    const end   = new Date(date.getTime() + range_in_minutes*60000);
    
    
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
    //console.log(req.params.year + " " + req.params.month);
    const date = new Date(req.params.year,
                          req.params.month-1,
                          req.params.day,
                          req.params.hour,
                          req.params.minute);
    
    console.log(req.params.stationID + " " + date);
    
    PowerPredictionsModel
        .find({"dateAndTime": date, "stationID": req.params.stationID})
        .exec((error, data) => {
            if (error) {
                return res.json({'success':false,'message':'Some Error'});
            }
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


module.exports = {
    getAll,
    getTimeLocal,
    getNowForStation,
    getMostRecentForStation
}
