const mongoose = require('mongoose');

const CloudCoverageDataModel = mongoose.Schema(
    {
        author: { type: String, required: false },
        
        cloud_coverage: { type: Number, required: true },
        system_num:     { type: String, required: true }
    },
    { timestamps: true, collection: "cloudCoverageData" },
);

module.exports = mongoose.model('cloudCoverageData', CloudCoverageDataModel);
