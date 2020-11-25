const mongoose = require('mongoose');


//
// This file is old and no longer used.
// We've kept it just in case, but it should be 
// safe to delete.
//

const TestEntry = mongoose.Schema(
    {
        testfield1: { type: String, required: true },
        testfield2: { type: Boolean, required: true },
        testfield3: { type: Date, required: false, default: Date.now},
        testfield4: { type: [String], required: false }
    },
    { timestamps: true, collection: "test" },
);

module.exports = mongoose.model('testEntries', TestEntry);
