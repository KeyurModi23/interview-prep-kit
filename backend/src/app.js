import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/errorHandler.js';
import userRoutes from './routes/userRoutes.js';
import kitRoutes from './routes/kitRoutes.js';

const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/kits', kitRoutes);

// Root route
app.get('/', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>API Status - Interview Prep Kit</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background-color: #030712;
          color: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }
        .container {
          background: rgba(17, 24, 39, 0.8);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 3rem 4rem;
          border-radius: 24px;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 40px rgba(245, 158, 11, 0.1);
        }
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(16, 185, 129, 0.1);
          color: #34d399;
          padding: 8px 16px;
          border-radius: 99px;
          font-weight: bold;
          font-size: 14px;
          border: 1px solid rgba(16, 185, 129, 0.2);
          margin-bottom: 24px;
        }
        .dot {
          width: 8px;
          height: 8px;
          background-color: #10b981;
          border-radius: 50%;
          box-shadow: 0 0 10px #10b981;
          animation: pulse 2s infinite;
        }
        h1 {
          margin: 0 0 12px 0;
          font-size: 2.5rem;
          background: linear-gradient(to right, #f59e0b, #f43f5e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        p {
          color: #94a3b8;
          margin: 0 0 32px 0;
          font-size: 1.1rem;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          text-align: left;
          background: rgba(0, 0, 0, 0.2);
          padding: 24px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .info-label {
          color: #64748b;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: bold;
          margin-bottom: 4px;
        }
        .info-value {
          color: #e2e8f0;
          font-family: monospace;
          font-size: 14px;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="status-badge">
          <div class="dot"></div>
          SYSTEMS ONLINE
        </div>
        <h1>API Gateway</h1>
        <p>AI Interview Prep Kit Backend Service</p>
        
        <div class="info-grid">
          <div>
            <div class="info-label">Environment</div>
            <div class="info-value">${process.env.NODE_ENV || 'production'}</div>
          </div>
          <div>
            <div class="info-label">Version</div>
            <div class="info-value">v1.0.0</div>
          </div>
          <div>
            <div class="info-label">Time</div>
            <div class="info-value">${new Date().toISOString().replace('T', ' ').split('.')[0]} UTC</div>
          </div>
          <div>
            <div class="info-label">Engine</div>
            <div class="info-value">Node.js</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  res.send(html);
});

// 404 handler
app.use('*', (req, res, next) => {
  res.status(404).json({ success: false, message: `Can't find ${req.originalUrl} on this server!`, data: null, error: 'Not Found' });
});

// Global Error Handler
app.use(errorHandler);

export { app };
