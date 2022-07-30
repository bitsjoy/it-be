const express = require('express');
const Note = require('../models/Note');
const User = require('../models/User');
const router = express.Router();
const tokenVerification = require('../middleware');
const DiaryDiaryEntry = require('../models/DiaryDiaryEntry');

router.get('/getDiaryEntryByDate/:date', tokenVerification, async (req, res) => {
    // req: date
    DiaryDiaryEntry.findOne({ownerId: req.user._id, date: req.params.date}).then((DDE)=>{
        if(DDE != null){res.status(200).json(DDE);}
        else{
            res.status(404).json({message: `No diary entry for ${req.params.date}`});
        }
    }).catch(err => {
        res.status(500).json({message: "something went wrong!"});
    })
});


router.post('/createDiaryEntry', tokenVerification, async(req, res) => {
    // req: date, ownerId, mainContent, mood
    //console.log(req);
    DiaryDiaryEntry.findOne({ownerId: req.user._id, date: req.body.date}).then((DDE)=>{
        if(DDE == null){
            DiaryDiaryEntry.create({ ...req.body, ownerId: req.user._id}).then((DDEC) => {
                res.status(200).json({message: "Saved"});
            }).catch(err => {
                res.status(500).json({message: "Something went wrong, please try again"});
            })
        } else {
            DiaryDiaryEntry.findByIdAndUpdate({_id: DDE._id}, {mainContent: req.body.mainContent}).then(DDEU => {
                res.status(200).json({message: "Updated successfully"});
            }).catch(err => {
                res.status(500).json({message: "Something went wrong while updating"});
            })
        }
    })
}) 

// router.delete('/deleteDiaryEntryByDate/:date', tokenVerification, async(req, res) => {  
//     // req: date
//     DiaryDiaryEntry.DeleteOne({ownerId: req.user._id, date: req.params.date}).then((DDE)=>{
//         res.status(200).json({message: "Diary entry deleted"});
//     });
 
// }); 

module.exports = {
    router: router
}
