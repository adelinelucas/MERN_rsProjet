const express = require('express');
const app = express();
require('dotenv').config({path:'./config/.env'});
const port = 5000;
require('./config/db');

// partie qui est lue en dernier
app.listen(process.env.PORT, ()=>{
    console.log(`listening on ${process.env.PORT} `);
})