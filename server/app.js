import config from "./config/index.js";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import ConnectsDB from "./DB/connect.js";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import notFound from "./middleware/notFound.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import requestId from "./middleware/requestId.js";
import authRoutes from "./routes/auth.js";
import placesRouter from "./routes/place.js";
import reviewsRouter from "./routes/reviews.js";
import adminRouter from "./routes/admin.js";
import planRouter from "./routes/plan.js";
import cookieParser from "cookie-parser";
import aiPlannerRouter from "./routes/ai-planner.js";
import healthRouter from "./routes/health.js";
import weatherRouter from "./routes/weather.js";
import { csrfProtection } from "./middleware/csrf.js";
import logger from "./utils/logger.js";

const app = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(requestId);

app.use(morgan(config.isProd ? "combined" : "dev"));

app.use(compression());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
  })
);
app.use(express.json({ limit: "512kb" }));
app.use(express.urlencoded({ extended: true, limit: "512kb" }));
app.use(cookieParser(config.cookie.signedSecret));
app.use(csrfProtection);
app.use(
  cors({
    origin: config.cors.origins,
    credentials: config.cors.credentials,
  })
);

// Serve uploaded images statically
app.use("/uploads", express.static("public/uploads"));

app.use("/api/v1/health", healthRouter);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/place", placesRouter);
app.use("/api/v1/reviews", reviewsRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/plan", planRouter);
app.use("/api/v1/ai-planner", aiPlannerRouter);
app.use("/api/v1/weather", weatherRouter);
app.use(notFound);
app.use(errorHandlerMiddleware);

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection", { promise: String(promise), reason: String(reason) });
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception", { message: err.message, stack: err.stack });
  process.exit(1);
});

const start = async () => {
  try {
    await ConnectsDB(config.db.url);
    const server = app.listen(config.port, () => {
      logger.info(`Server listening on port ${config.port}`, { env: config.env });
    });

    const shutdown = async (signal) => {
      logger.info(`${signal} received — shutting down gracefully`);
      server.close(async () => {
        try {
          await mongoose.connection.close();
          logger.info("MongoDB connection closed. Process exiting.");
        } catch (e) {
          logger.error("Error closing MongoDB connection", { message: e.message });
        }
        process.exit(0);
      });
      // Force kill after 10 seconds if server hasn't closed
      setTimeout(() => {
        logger.error("Graceful shutdown timed out — forcing exit");
        process.exit(1);
      }, 10_000);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

  } catch (error) {
    logger.error("Startup failed", { message: error.message, stack: error.stack });
    process.exit(1);
  }
};

start();
