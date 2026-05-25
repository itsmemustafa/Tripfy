import { Router } from "express";
import rateLimit from "express-rate-limit";
import aiPlanner from "../controllers/plan/aiPlanner.js";
import auth from "../middleware/auth.js";

const router = Router();

const aiPlannerLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { msg: "Too many AI requests; try again later." },
});

router.route("/").post(aiPlannerLimit, auth, aiPlanner);
export default router;