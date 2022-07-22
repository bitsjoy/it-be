const mongoose = require('mongoose')

const note = mongoose.Schema({
    bookTitle: String,
    dateCreated: {
        type: String
    },
    dateUpdated: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    author: {
        type: {
            id: String,
            fullName: String,
            ppImageLink: String
        },
        required: true
    },
    accessibleTo: {
        type: [String]
    }
});

module.exports = new mongoose.model("Note", note)