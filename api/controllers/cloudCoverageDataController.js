//
// Because the only data in cloud coverage entries is the percentage coverage
// this model is really simple. 
//

const mongoose = require('mongoose')
const CloudCoverageDataModel = require('../models/cloudCoverageDataModel')

// finds the most recent entry for a given substation in the CloudCoverageData table
function getMostRecentForStation(req, res) {
    CloudCoverageDataModel                          // search this table
        .find({"system_num": req.params.stationID}) // with this query
        .sort('-date')                              // sort the data from newest to oldest
        .limit(1)                                   // only retrieve the first entry found
        .exec((error, data) => {                    // execute the constructed query, and then call the passed in lambda function
            // send the results as a json object
            if (error) {
                return res.json({'success':false,'message':error});
            }
            return res.json({'success':true,'message':'Data fetched successfully',data});
        })
}


module.exports = {
    getMostRecentForStation
}
