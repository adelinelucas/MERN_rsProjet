const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
require('dotenv').config({path:'./config/.env'});
const port = 5000;
require('./config/db');
const {checkUser, requireAuth} = require('./middleware/auth.middleware');
const cors = require('cors');

const app = express();

const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
}

app.use(cors(corsOptions));

// body parser va nous permettre de traiter la data 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
// lire les cookies
app.use(cookieParser());

// middleware
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) =>{
    res.status(200).send(res.locals.user._id)
});

// routes
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);

// partie qui est lue en dernier
app.listen(process.env.PORT, ()=>{
    console.log(`listening on ${process.env.PORT} `);
})