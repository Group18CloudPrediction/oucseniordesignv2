// unused, safe to delete. Copied from last year's team.

// const mongoose = require('mongoose')
// const CloudDataModel = require('../models/cloudDataModel')
// 
// const getAll = (req, res) => {
//     CloudDataModel
//         .find()
//         .exec((error, data) => {
//             if (error) {
//                 return res.json({'success':false,'message':'Some Error'});
//             }
//             return res.json({'success':true,'message':'Data fetched successfully',data});
//         })
// }
// 
// const getMostRecent = (req, res) => {
//     //return res.json({'success':false,'message':'Not yet implemented'});
// 
//     CloudDataModel.findOne({}, {}, { sort: { 'created_at' : 1 } }, function(error, data) {
//         //console.log( post );
//         if (error) {
//             return res.json({'success':false,'message':'Some Error'});
//         }
//         return res.json({'success':true,'message':'Data fetched successfully',data});
//     });
// } 
// 
// 
// module.exports = {
//     getAll,
//     getMostRecent
// }
