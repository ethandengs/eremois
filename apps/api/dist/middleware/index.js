"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = exports.setupMiddleware = void 0;
const auth_1 = require("./auth");
Object.defineProperty(exports, "authenticate", { enumerable: true, get: function () { return auth_1.authenticate; } });
const setupMiddleware = (app) => {
    // Protected routes middleware
    app.use('/api/auth/me', auth_1.authenticate);
};
exports.setupMiddleware = setupMiddleware;
