import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/error.middleware.js';
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1', authRoutes);
app.use('/api/v1', bookRoutes);
app.use('/api/v1', categoryRoutes);

app.use(errorHandler);

export default app;
