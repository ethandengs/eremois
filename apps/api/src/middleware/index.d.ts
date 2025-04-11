import { Express } from 'express';
import { authenticate } from './auth';
export declare const setupMiddleware: (app: Express) => void;
export { authenticate };
