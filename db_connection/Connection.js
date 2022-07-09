const mongoose = require('mongoose');

const ConnectionString = "mongodb+srv://test1:test1@cluster0.ntljf.mongodb.net/?retryWrites=true&w=majority";


const connectDB = async () => {
    await mongoose.connect(ConnectionString, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });
    console.log("Database connection successful");
}

module.exports = connectDB;
