import helmet from "helmet";

import morgan from "morgan";
import rateLimite from "express-rate-limit";
import env from "dotenv";
import ConnectsDB from "./DB/connect.js";
import cors from "cors";
import path from "path";
import express from "express";
import notFound from "./middleware/notFound.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import authRoutes from "./routes/auth.js";
import placesRouter from './routes/place.js'
import reviewsRouter from './routes/reviews.js'
import cookieParser from "cookie-parser";
const app = express();

env.config();
app.use(helmet());

app.use(morgan("dev"));
app.use(
  rateLimite({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/place", placesRouter);
app.use('/api/v1/reviews', reviewsRouter);
app.use(notFound);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await ConnectsDB(process.env.MONGO_URL);
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
