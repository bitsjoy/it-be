const express = require('express');
const checkinEntry = require('../models/ActiveCheckinEntry');
const router = express.Router();
const tokenVerification = require('../middleware');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const { bucketName } = require('../s3BucketConfig');
const upload = require('multer')(); 

// create a new checkinEntry
router.post('/', tokenVerification, (req, res) => {  
    checkinEntry.create(req.body).then((checkinEntry) => {
        res.send({content: checkinEntry, message: 'sucess'});
    }) 
});

// upload IdCard_Image
router.post('/upload_id', tokenVerification, upload.any(), async (req, res) => {  
 
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        });

        console.log(process.env.AWS_ACCESS_KEY_ID);
        
        var s3 = new AWS.S3();


        const arr  = req.files[0].originalname.split('.');
        const ext = arr.length != 0 ? arr[arr.length - 1] : '';

        var filePath = `./assets/k${'.'+ext}`;
        console.log(req.files[0]);
        fs.writeFile(`./assets/k${'.'+ext}`, req.files[0].buffer, function (err) {
            if (err) throw err;               
            console.log('Results Received');
        }); 
        let targetFolderInBucket = "id_cards";
        //configuring parameters
        var params = {
        Bucket: bucketName,
        Body : fs.createReadStream(filePath),
        Key : targetFolderInBucket+"/"+"Date.now(;)"+"_"+path.basename(filePath),  // there is the folder name at the front, (folder in bucket)
        };
        
        s3.upload(params, function (err, data) {
        //handle error
        if (err) {
            console.log("Error", err);
        }
        
        //success
        if (data) {
            fs.unlinkSync(filePath);
            console.log("Uploaded in:", data.Location);
    
                var item = req.body;
                var params = { Bucket: "bitsjoy-template-test", Key: targetFolderInBucket+"/"+"Date.now(;)"+"_"+path.basename(filePath)}; // keyname can be a filename
                s3.getObject(params, function (err, data) {
                    if (err) {
                        return res.send({ "error": err });
                    }
                    res.send({ data });
                });
            
        }
    })
});



module.exports = {
    router: router
};