const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TestEntry = new Schema(
    {
        testfield1: { type: String, required: true },
        testfield2: { type: Boolean, required: true },
        testfield3: { type: Date, required: false },
        testfield4: { type: [String], required: false }
    },
    { timestamps: true },
)

module.exports = mongoose.model('testEntries', TestEntry);
