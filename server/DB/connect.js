import mongoose from "mongoose";
import logger from "../utils/logger.js";

const MONGOOSE_OPTIONS = {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
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
