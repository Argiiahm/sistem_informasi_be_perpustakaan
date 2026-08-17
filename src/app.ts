import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/error.middleware.js';
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import usersRoutes from './routes/userRoutes.js';
import borrowBookRoutes from './routes/borrowBookRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1', authRoutes);
app.use('/api/v1', bookRoutes);
app.use('/api/v1', categoryRoutes);
app.use('/api/v1', usersRoutes);
app.use('/api/v1', borrowBookRoutes);

app.use(errorHandler);

export default app;
