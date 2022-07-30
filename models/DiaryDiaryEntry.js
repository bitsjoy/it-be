const mongoose = require('mongoose')

const DailyDiaryEntry = mongoose.Schema({
    date :{
        type: String,
        required: true
    },
    mood: {
        type: String,
        default: 0  // options would be  ... -3 -2 -1 0 1 2 3 ...
    },
    mainContent: {
        type: String,
        required: true
    },
    ownerId: {
        type: String,
        required: true
    }
});

module.exports = new mongoose.model("DailyDiaryEntry", DailyDiaryEntry)