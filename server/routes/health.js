import { Router } from "express";
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";

const router = Router();

router.get("/", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const healthy = dbState === 1;

  res
    .status(healthy ? StatusCodes.OK : StatusCodes.SERVICE_UNAVAILABLE)
    .json({
      status: healthy ? "ok" : "degraded",
      db: dbState === 1 ? "connected" : "disconnected",
      timestamp: new Date().toISOString(),
    });
});

export default router;
