const mongoose = require('mongoose');

let mineral = new mongoose.Schema ({ 
    mineralName: String, //unique
    measuringUnit: String, //Metric tonne
    rockTypes: [{rockType: String, supplier: String, typeBalance: Number}],  
    suppliers: [String],
    powderGrades: [{gradeName: String, gradeBalance: Number, supplier: String}],
});

module.exports = Mineral = mongoose.model('mineral', mineral);