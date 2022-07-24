const express = require('express');
const Note = require('../models/Note');
const User = require('../models/User');
const router = express.Router();
const tokenVerification = require('../middleware');

router.post('/getNote', tokenVerification, async (req, res) => {
    // req: noteId, idOfAccessor
    console.log(req.body);
    Note.findOne({_id: req.body.noteId}).then( note => {
        console.log(note);
        if(note.accessibleTo.find(x => x == req.body.idOfAccessor) ){
            res.status(200).json(note);
        } else {
            res.status(403).json({message: "Access denied"});
        }
    })
})
router.post('/createNote', tokenVerification, async(req, res) => {
    Note.create(req.body).then((note) => {
        User.findOne({_id: req.body.author.id}).then(user => {  
            if(user.ownedProducts.includes("Notes")){
           
            let j = user.notes[req.body.bookTitle]?user.notes[req.body.bookTitle]:[]; 
            if(j.find(x => x.noteTitle == req.body.title)){
                res.status(400).json({message: 'note title already exists'});   // title exists
            } else {
            j.push({"noteId": note._id.toString(), "noteTitle" : note.title, "deleted": false}) // converting id_object to string
            console.log(user.notes);
            user.notes[req.body.bookTitle] = j;
            
           // linking newly created note to the author's collection of 'notes'
          
           User.findByIdAndUpdate(req.body.author.id, {notes: user.notes}).then(result => {
            //  console.log(res);
            
           }).then(() => {
            let arr = [];
            arr.push(req.body.author.id);
            Note.findByIdAndUpdate(note._id, {accessibleTo: arr}).then(()=>{
                res.send({content: user.notes, message: 'sucess'});
            });
        });
    }
} else {
    res.status(403).json({message: 'access denied'});
}
 
        })
    })
})

router.put('/updateNote', tokenVerification, async(req, res) => {  
    // req -> noteId, body, title, accessibleTo, dateUpdated, authorId, booktitle
 console.log(req.body);
    Note.findOne({_id: req.body.noteId}).then(note => { 
        if(note.author.id === req.body.authorId){
            Note.findByIdAndUpdate(req.body.noteId, {body: req.body.noteBody, title: req.body.title, accessibleTo: req.body.accessibleTo, dateUpdated: req.body.dateUpdated}).then(result => {
                //  console.log(res);
                //update title of the note in "user"'s collection of 'notes'
        
               User.findOne({_id: req.body.authorId}).then(user => { 
        
                let j = user.notes[req.body.bookTitle]? user.notes[req.body.bookTitle] : [];
                console.log(j);
                if(j == []){
                    j.push({noteId: req.body.noteId, noteTitle: req.body.title})
                } else {
                let target = j.findIndex( x => x.noteId == req.body.noteId);
                j[target].noteTitle = req.body.title;
                }
                user.notes = {...user.notes, [req.body.bookTitle] :  j}
         
                console.log(user.notes);
                
                User.findByIdAndUpdate(req.body.authorId, {notes: user.notes}).then(result => {
                console.log("user notes updated");
                // res.send({content: result, message: 'sucess'});
                }).then(()=>{
                    Note.findOne({_id: req.body.noteId}).then((resu) => {
                        res.send({content: resu, message: 'success'});
                    })
                });
        
               
            })
               });
        } else {
            res.status(403).json({message: "access denied"});
        }
});
});

router.put('/updateNoteAccessibleTo', tokenVerification, async(req, res) => {  
    // req -> list(), noteId, authorId
    

    Note.findOne({_id: req.body.noteId}).then(note => {
        if(note.author.id === req.body.authorId){
    let accessibleToArr = [...note.accessibleTo];
    
        req.body.list.forEach((email, i) => {
            User.findOne({email: email}).then(resu => {
                if(!accessibleToArr.find(x => x == resu._id)) { accessibleToArr.push(resu._id);}
                Note.findByIdAndUpdate(req.body.noteId, { accessibleTo: accessibleToArr}).then(result => {
                
                    if(i==req.body.list.length-1){res.send({message: "success"});}
              
        }) 
            })
        }) 
    } else {
        res.status(403).json({message: "access denied"});

    }
    })      
    
}); 

router.put('/NoteRemoveAccess', tokenVerification, async(req, res) => {  
    // req -> list(), noteId,  authorId
    Note.findOne({_id: req.body.noteId}).then(note => {
        if(note.author.id === req.body.authorId){

    let accessibleToArr = [];
     
            
        req.body.list.forEach((email, i) => {
            User.findOne({email: email}).then(resu => {
                if(!accessibleToArr.find(x => x == resu._id)) { accessibleToArr.push(resu._id);}
                Note.findByIdAndUpdate(req.body.noteId, { accessibleTo: accessibleToArr}).then(result => {
                
                    if(i==req.body.list.length-1){res.send({message: "success"});}
              
        }) 
            })
        })      
    } else {
        res.status(403).json({message: "access denied"});

    }
})       
 
}); 



router.put('/deleteNote', tokenVerification, async(req, res) => {  
    //     // req -> noteId, authorId, booktitle
    Note.findOne({_id: req.body.noteId}).then(note => { 
        if(note.author.id === req.body.authorId){
      
                //  console.log(res);
                //update title of the note in "user"'s collection of 'notes'
        
               User.findOne({_id: req.body.authorId}).then(user => { 
        
                let j = user.notes[req.body.bookTitle]? user.notes[req.body.bookTitle] : [];
                console.log(j);
                if(j == []){
                    j.push({noteId: req.body.noteId, noteTitle: req.body.title})
                } else {
                let target = j.findIndex( x => x.noteId == req.body.noteId);
                j[target].deleted = true;
                }
                user.notes = {...user.notes, [req.body.bookTitle] :  j}
         
                console.log(user.notes);
                
                User.findByIdAndUpdate(req.body.authorId, {notes: user.notes}).then(result => {
                console.log("user notes updated");
                // res.send({content: result, message: 'sucess'});
                }).then(()=>{
                    Note.findOne({_id: req.body.noteId}).then((resu) => {
                        res.send({content: resu, message: 'success'});
                    })
                });
        
               
            }) 
        } else {
            res.status(403).json({message: "access denied"});
        }
});
 
}); 

module.exports = {
    router: router
}