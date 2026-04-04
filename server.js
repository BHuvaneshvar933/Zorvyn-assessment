import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import { createApp } from "./src/app.js";

dotenv.config();

// connect DB
connectDB();

const app = createApp();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
