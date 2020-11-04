const mongoose = require('mongoose')
const CloudCoverageDataModel = require('../models/cloudCoverageDataModel')


function getMostRecentForStation(req, res) {
    CloudCoverageDataModel
        .find({"system_num": req.params.stationID})
        .sort('-date')
        .limit(1)
        .exec((error, data) => {
            if (error) {
                return res.json({'success':false,'message':error});
            }
            return res.json({'success':true,'message':'Data fetched successfully',data});
        })
}


module.exports = {
    getMostRecentForStation
}
