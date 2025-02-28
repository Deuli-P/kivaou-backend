import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

// Configuration des middlewares
app.use(cors());
app.use(express.json());

// Définition des routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

export default app;
