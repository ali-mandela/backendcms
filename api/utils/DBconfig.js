const mongoose = require('mongoose')


const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`succesfully connected to database ${conn.connection.host}`);
    }catch(error){
        console.log(error);
        console.log(`error in connecting to DB. ${error.message}`);
        process.exit(1); // Exit the application if unable to connect to the database
    }
};

module.exports = connectDB; 