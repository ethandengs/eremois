import { Express } from 'express';
import { authenticate } from './auth';

export const setupMiddleware = (app: Express) => {
  // Protected routes middleware
  app.use('/api/auth/me', authenticate);
};

export { authenticate }; 