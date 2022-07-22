const express = require('express');
const User = require('../models/User');
const router = express.Router();
const tokenVerification = require('../middleware');

router.post('/getUserNotes', tokenVerification, async (req, res) => {
    console.log("fs");
    User.findOne({email: req.body.email}).then( user => {
        if(!user){
            res.status(404);
        } else {
            let obj = {};
            if(Object.keys(user.notes).length != 0) {
            Object.keys(user.notes).map((key) => {
               let arr = user.notes[key].filter(x => x.deleted != true);
               if(arr.length > 0){
                obj[key] = arr;
               }
            })
            console.log(obj);
            res.status(200).json({notes: obj});
        } else {
            res.status(200).json({notes: {}});
        }
    }
    })
})

module.exports = {
    router: router
}