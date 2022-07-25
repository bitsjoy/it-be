const express = require('express');
const User = require('../models/User');
const router = express.Router();
const tokenVerification = require('../middleware');
const Razorpay = require('razorpay');

require('dotenv').config();


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
});

router.post('/getUserOwnedProducts', tokenVerification, async (req, res) => {
    //console.log("fs");
    User.findOne({email: req.body.email}).then( user => {
        if(!user){
            res.status(203);
        } else {
            res.status(200).json({ownedProducts: user.ownedProducts});
    }
    })
});


router.post('/setUserOwnedProducts', tokenVerification, async (req, res) => {
    // email, product, paymentId
    User.findOne({email: req.body.email}).then( async (user) => {
        if(!user){
            res.status(404);
        } else { 
            var instance = new Razorpay({ key_id: process.env.RZP_ACCESS_KEY_ID, key_secret: process.env.RZP_SECRET_ACCESS_KEY })

 
let k = await instance.payments.fetch(req.body.paymentId);
if(k.captured == true){
    console.log("FS", user.ownedProducts.includes(req.body.product));
    if(!user.ownedProducts.includes(req.body.product)){
      User.findByIdAndUpdate(user._id, {ownedProducts: [...user.ownedProducts, `${req.body.product}`]}).then((usr)=>{
console.log(usr.ownedProducts.join("||"));

        res.status(200).json({ownedProducts: usr.ownedProducts});

    }).catch((err)=>{console.log(err); res.status(404);});
    } else {
        res.status(200).json({ownedProducts: user.ownedProducts});

    }
   
}
console.log("k");
    }
    })
});

module.exports = {
    router: router
}