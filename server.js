import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import authRouter from './routes/auth.js';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import PgSession from 'connect-pg-simple';
import pool from './config/databases.js';
import initTables from './migrations/tables/initTables.js';
import initFunctions from './migrations/functions/initFunctions.js';
import organisationRouter from './routes/organization.js';
import userRouter from './routes/user.js';
import eventRouter from './routes/event.js';
import destinationRouter from './routes/destination.js';


const app = express();
dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


app.use(cors({
  origin: process.env.APP_HOST, 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
 
app.use(session({
    store: new (PgSession(session))({
      pool,
      tableName: 'session',
      createTableIfMissing: true
    }),
    secret: process.env.JWT_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, 
      // secure: false, // Supprimé pour le développement
      // httpOnly: true, // Supprimé pour le développement 
    }
  }));


// =================== ROUTES ===================


app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/event', eventRouter)
app.use('/api/destination', destinationRouter)
app.use('/api/organization', organisationRouter)
//app.use('/api/comment', commentRouter)

app.get('/api/test', (req, res) => {
  res.status(200).json({
    message: 'API is running'
  });
});
 

// 
initTables().then(() => {
  initFunctions();
  app.listen(process.env.PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${process.env.PORT}`);
  });
}).catch(err => {
  console.error("❌ Erreur lors des migrations :", err);
});
 
 