const mongoose = require('mongoose');
const colors = require('colors');
const connectDB = async ()=>{
    try{
     await mongoose.connect(process.env.MONGO_URL)
     console.log(`Connected To Mongodb Database ${mongoose.connection.host}`.bgMagenta.white);
    }catch (error){
    console.log(`Mongodb Databse Error ${error}`.bgRed.white);
    }
};

module.exports = connectDB;