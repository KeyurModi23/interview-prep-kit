import express from 'express';
import morgan from 'morgan';
import { errorHandler } from './middlewares/errorHandler.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

// Middleware
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/v1/users', userRoutes);

// 404 handler
app.use('*', (req, res, next) => {
  res.status(404).json({ success: false, message: `Can't find ${req.originalUrl} on this server!`, data: null, error: 'Not Found' });
});

// Global Error Handler
app.use(errorHandler);

export { app };
