import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import { createApp } from "./src/app.js";
import { logger } from "./src/utils/logger.js";

dotenv.config();

if (process.env.LOG_LEVEL) {
  logger.level = process.env.LOG_LEVEL;
}

// connect DB
connectDB();

const app = createApp();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info({ port: PORT }, "Server running");
});
