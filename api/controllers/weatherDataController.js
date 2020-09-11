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

// function getDay(req, res) {
//     TestModel
//         .find()
//         .exec((error, data) => {
//             if (error) {
//                 return res.json({'success':false,'message':'Some Error'});
//             }
//             return res.json({'success':true,'message':'Data fetched successfully',data});
//         })
// }


module.exports = {
    getAll//,
//     getDay
}
