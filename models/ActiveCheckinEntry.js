const mongoose = require('mongoose');

let activeCheckinEntry = new mongoose.Schema({
    fullName: { 
        type: String,
        required: true
    },
    roomNumber: { 
        type: String,
        required: true
    },
    checkinDate: { // AUTOFILLED FROM FRONT END ON CHECKIN PAGE
        type: String,
        required: true
    }, 
    checkinTime: {  // AUTOFILLED FROM FRONT END ON CHECKIN PAGE
        type: String,
        required: true
    },
    fingerprintId: { // PREMIUM FEATURE
        type: String,
        required: true  // for now
    }, 
    phoneNumber: { 
        type: Number,
        default: 0
    },
    idCardBucketKey: { 
        type: String,
        default: ""
    },
    checkoutDate: { // AUTOFILLED FROM FRONT END ON CHECKOUT SCREEN
        type: String,
        default: ""
    },
    checkoutTime: { // AUTOFILLED FROM FRONT END ON CHECKOUT SCREEN
        type: String,
        default: ""
    },
});

module.exports = Mineral = mongoose.model('activeCheckinEntry', activeCheckinEntry);

