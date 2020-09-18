const mongoose = require('mongoose');

const CloudData = mongoose.Schema(
    {
        cloud: { type: [Number], required: true },
        shadow: { 
            data: { type: Buffer, required: false }, 
            contentType: { type: String, required: false} 
        },
        coverage: { 
            data: { type: Buffer, required: false }, 
            contentType: { type: String, required: false} 
        }
    },
    { timestamps: true, collection: "cloudData" },
);

module.exports = mongoose.model('cloudData', CloudData);
