import { Express } from 'express';
import authRouter from './auth';

export const setupRoutes = (app: Express) => {
  app.use('/api/auth', authRouter);
  
  // Health check endpoint
  app.get('/health', (_, res) => {
    res.json({ status: 'ok' });
  });
}; 