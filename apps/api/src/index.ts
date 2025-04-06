import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { setupRoutes } from "./routes";
import { setupMiddleware } from "./middleware";
import { logger } from "./utils/logger";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
setupMiddleware(app);

// Routes
setupRoutes(app);

// MongoDB connection
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/eremois";
mongoose
  .connect(mongoUri)
  .then(() => {
    logger.info("Connected to MongoDB");
  })
  .catch((error) => {
    logger.error("MongoDB connection error:", error);
  });

// Start server
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
