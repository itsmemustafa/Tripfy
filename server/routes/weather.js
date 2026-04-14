import { Router } from "express";
import getWeather from "../controllers/weather/getWeather.js";

const router = Router();

// GET /api/v1/weather/:placeId   public, no auth required
router.get("/:placeId", getWeather);

export default router;
