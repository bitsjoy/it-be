const mongoose = require('mongoose')

const user = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    ppImageLink: {
        type: String,
    },
    ownedProducts: {
        type: [String],
        default: []
    },
    active: Boolean,
    notes: {
        type: {

        },
        default : {
            // "Book Title a" : [{noteId: "a", noteTitle: 'Sample note a', deleted: false}],
            // "Book Title b" : [{noteId: "b", noteTitle: 'Sample note b', deleted: false}], 
        }
    }
});

module.exports = new mongoose.model("User", user)