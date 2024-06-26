const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./utils/DBconfig')
const path = require('path') 


// config files
dotenv.config();
connectDB();
// rest obj initlisation
const app = express();


// middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/professor', require('./routes/professorRoute')); 
app.use('/api/v1/student', require('./routes/studentRoute')); 
app.use('/api/v1/admin', require('./routes/adminRoute')); 
//  listen to port 
const port = process.env.PORT  || 8000;
 

app.listen(port, ()=>{
    console.log(`server is live in ${process.env.NODE_MODE} on ${port}.`);
})