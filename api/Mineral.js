const express = require('express'); 
const Mineral = require('../models/Mineral');
const router = express.Router();
const tokenVerification = require('../middleware');

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

