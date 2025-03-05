import express from 'express';
import path from 'path';
import authRouter from './routes/loginRouters';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import PgSession from 'connect-pg-simple';
import pool from './config/databases.js';


const app = express();
dotenv.config();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(session({
    store: new (PgSession(session))({
      pool,
      tableName: 'session',
    }),
    secret: process.env.JWT_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: process.env.JWT_EXPIRE, 
      // secure: false, // Supprimé pour le développement
      // httpOnly: true, // Supprimé pour le développement
    }
  }));


// =================== ROUTES ===================

app.use('/auth', authRouter)
//app.use('/organisation', organisationRouter)
//app.use('/user', userRouter)
//app.use('/event', eventRouter)
//app.use('/comment', commentRouter)




// 
app.listen(process.env.PORT, () => {
    console.log('Server is running on port 3000');
});
