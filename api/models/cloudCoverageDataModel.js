const mongoose = require('mongoose');


// 
// Each entry in the cloudCoverageData table of our database will look like this below.
// Note: in MongoDB, tables are called "collections"
//
// these entries contain cloud coverage calculations made on the jetson
//
const CloudCoverageDataModel = mongoose.Schema(
    {
        author: { type: String, required: false }, // again, not sure what this is for, but it's in some entries. the website doesn't use it
        
        cloud_coverage: { type: Number, required: true }, // cloud coverage in percent, see jetson code for details. a value of 10 indicates 10%
        system_num:     { type: String, required: true }  // the id of the jetson / substation where this data was recorded
    },
    { timestamps: true, collection: "cloudCoverageData" },
);

module.exports = mongoose.model('cloudCoverageData', CloudCoverageDataModel);
