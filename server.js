import express from "express";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import * as userRoutes from './routes/user.routes.js';
import * as postRoutes from './routes/post.routes.js';
import dotenv from 'dotenv'; 
dotenv.config({path:'./config/.env.'});
const port = 5000;
import './config/db.js';
import {checkUser, requireAuth} from './middleware/auth.middleware.js';
import cors from 'cors';

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