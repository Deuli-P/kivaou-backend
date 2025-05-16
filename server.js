import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import PgSession from 'connect-pg-simple';
import pool from './config/databases.js';
import initTables from './migrations/tables/initTables.js';
import initFunctions from './migrations/functions/initFunctions.js';
import router from './routes/routes.js';


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
      httpOnly: true,
      secure: process.env.ENV === 'PROD' ,
    }
  }));


// =================== ROUTES ===================



app.use('/api', router);


// 
initTables().then(() => {
  initFunctions();
  app.listen(process.env.PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${process.env.PORT}`);
  });
}).catch(err => {
  console.error("❌ Erreur lors des migrations :", err);
});
 
 