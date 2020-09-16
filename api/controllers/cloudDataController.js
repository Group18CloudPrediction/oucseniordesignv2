const mongoose = require('mongoose')
const CloudDataModel = require('../models/cloudDataModel')

const getAll = (req, res) => {
    CloudDataModel
        .find()
        .exec((error, data) => {
            if (error) {
                return res.json({'success':false,'message':'Some Error'});
            }
            return res.json({'success':true,'message':'Data fetched successfully',data});
        })
}

const getMostRecent = (req, res) => {
    return res.json({'success':false,'message':'Not yet implemented'});
} 


module.exports = {
    getAll,
    getMostRecent
}
