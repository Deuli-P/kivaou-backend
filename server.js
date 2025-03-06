import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import authRouter from './routes/auth.js';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import PgSession from 'connect-pg-simple';
import pool from './config/databases.js';


const app = express();
dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


app.use(cors({
    origin: process.env.APP_HOST,
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

app.get('/api/', (req, res) => {
    res.send('Hello World');
}
);

app.use('/api/auth', authRouter)
//app.use('/api/organisation', organisationRouter)
//app.use('/api/user', userRouter)
//app.use('/api/event', eventRouter)
//app.use('/api/comment', commentRouter)




// 
app.listen(process.env.PORT, () => {
    console.log('Server is running on port 3000');
});
