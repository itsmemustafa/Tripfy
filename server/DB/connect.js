import mongoose from "mongoose";
import logger from "../utils/logger.js";

const MONGOOSE_OPTIONS = {
  serverSelectionTimeoutMS: 5000, 
  connectTimeoutMS: 10000,
  socketTimeoutMS: 30000,
  bufferCommands: true, // Re-enable buffering so Mongoose waits for the connection automatically
};

let cachedConnection = null;

const ConnectsDB = async (url) => {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    cachedConnection = await mongoose.connect(url, MONGOOSE_OPTIONS);
    logger.info("MongoDB connected");
    return cachedConnection;
  } catch (err) {
    logger.error("MongoDB connection failed", { message: err.message });
    cachedConnection = null;
    throw err;
  }
};

export default ConnectsDB;
