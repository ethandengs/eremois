"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = require("./routes");
const middleware_1 = require("./middleware");
const logger_1 = require("./utils/logger");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
(0, middleware_1.setupMiddleware)(app);
// Routes
(0, routes_1.setupRoutes)(app);
// MongoDB connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/eremois';
mongoose_1.default.connect(mongoUri)
    .then(() => {
    logger_1.logger.info('Connected to MongoDB');
})
    .catch((error) => {
    logger_1.logger.error('MongoDB connection error:', error);
});
// Start server
app.listen(port, () => {
    logger_1.logger.info(`Server is running on port ${port}`);
});
