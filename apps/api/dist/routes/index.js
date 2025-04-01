"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = void 0;
const auth_1 = __importDefault(require("./auth"));
const setupRoutes = (app) => {
    app.use('/api/auth', auth_1.default);
    // Health check endpoint
    app.get('/health', (_, res) => {
        res.json({ status: 'ok' });
    });
};
exports.setupRoutes = setupRoutes;
