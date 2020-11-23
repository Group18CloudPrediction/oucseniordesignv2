//
// Unused, safe to delete, but a good simple reference
//

const mongoose = require('mongoose')
const TestModel = require('../models/testAPIModel')

const getAll = (req, res) => {
    TestModel
        .find()
        .exec((error, data) => {
            if (error) {
                return res.json({'success':false,'message':'Some Error'});
            }
            return res.json({'success':true,'message':'Data fetched successfully',data});
        })
}


module.exports = {
    getAll//,
//     getSomethingElse,
//     updateSomething
}
