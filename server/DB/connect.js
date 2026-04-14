import mongoose from "mongoose";
import logger from "../utils/logger.js";

//  Fix #6: Add connection timeouts to avoid silent hangs on cold starts 
const MONGOOSE_OPTIONS = {
  serverSelectionTimeoutMS: 5000,   // Fail fast if no server found
  connectTimeoutMS: 10000,          // Max time to establish initial connection
  socketTimeoutMS: 45000,           // Max time for a DB operation
};

const ConnectsDB = (url) => {
  return mongoose
    .connect(url, MONGOOSE_OPTIONS)
    .then(() => logger.info("MongoDB connected"))
    .catch((err) => {
      logger.error("MongoDB connection failed", { message: err.message });
      throw err;
    });
};

export default ConnectsDB;
