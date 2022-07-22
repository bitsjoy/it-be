const express = require('express'); 
const Mineral = require('../models/Mineral');
const router = express.Router();
const tokenVerification = require('../middleware');

var request = require('request');


// FILE UPLOAD and RETREIVE BEGIN
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const upload = require('multer')();

require('dotenv').config();


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

// FILE UPLOAD and RETREIVE END


router.get('/', tokenVerification, async (req, res) => {
    var allMinerals = [];
    var allMinerals = await Mineral.find();
    if(allMinerals.length != 0){
        res.send({content: allMinerals, message: 'success'})
    } else {
        res.send({content: [], message: 'failure'})
    }   
})

router.post('/', tokenVerification, (req, res)=>{ 
     Mineral.create(req.body).then((mineral) => {
         res.send({content: mineral, message: 'sucess'});
     })
});

router.put('/:id', tokenVerification, (req, res) => { 
    Mineral.findByIdAndUpdate({_id: req.params.id}, req.body).then(()=>{
        Mineral.findOne({_id: req.params.id}).then((mineral)=>{
            res.send({content: mineral, message: 'success'});
        })
    })
});
 
//updateRockTypeBalance
const updateRockTypeBalance =  (req, res, counter) => {
    console.log(req);
     Mineral.findOne({_id: req.params.id}).then((mineral)=>{ 
        var rockTypes = mineral.rockTypes;
        rockTypes.map((obj)=>{
            if(obj.rockType == req.body.rockType && obj.supplier == req.body.supplier){
                obj.typeBalance += req.body.quantityChange;
            }
        });
        Mineral.findByIdAndUpdate({_id: req.params.id}, {"rockTypes": rockTypes}).catch(()=>{
                res.send("Error in updating rockType-balance, try again");
            })
    }).then(()=>{
        counter.value++;
    })
}

router.put('/updaterocktypebalance/:id', tokenVerification, (req, res) => { 
    {/*req interface: {rocktype, amountChange, supplier}*/}
    updateRockTypeBalance(req, res, 0);
});

//updatePowderGradeBalance
const updatePowderGradeBalance =  (req, res, counter) => {
    console.log(req);
     Mineral.findOne({_id: req.params.id}).then((mineral)=>{ 
        var powderGrades = mineral.powderGrades;
        powderGrades.map((obj)=>{
            if(obj.gradeName == req.body.rockType && obj.supplier == req.body.supplier){
                obj.gradeBalance += req.body.quantityChange;
            }
        });
        Mineral.findByIdAndUpdate({_id: req.params.id}, {"powderGrades": powderGrades}).catch(()=>{
                res.send("Error in updating powderGrade-balance, try again");
            })
    }).then(()=>{
        counter.value++;
    })
}

router.put('/updatepowdergradebalance/:id', tokenVerification, (req, res) => { 
    {/*req interface: {gradeName, amountChange}*/}
   updatePowderGradeBalance(req, res);
});

module.exports = {
    router: router,
    updateRockTypeBalance: updateRockTypeBalance,
    updatePowderGradeBalance: updatePowderGradeBalance,
};

