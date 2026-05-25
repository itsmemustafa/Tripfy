import express from "express";
import addPlan from "../controllers/plan/createPlan.js";
import { getPlans } from "../controllers/plan/listPlans.js";
import { getPlanById } from "../controllers/plan/getPlan.js";
import { getSharedPlan } from "../controllers/plan/getSharedPlan.js";
import { deletePlan } from "../controllers/plan/deletePlan.js";
import { updatePlan } from "../controllers/plan/updatePlan.js";
import auth from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import {
  createPlanValidators,
  updatePlanValidators,
} from "../validators/planValidators.js";

const router = express.Router();

// Public route (no auth)  for shared plan links 
router.get("/shared/:id", getSharedPlan);

// All routes below require authentication 
router.use(auth);

router.route("/").post(createPlanValidators, validate, addPlan).get(getPlans);

router
  .route("/:id")
  .get(getPlanById)
  .delete(deletePlan)
  .patch(updatePlanValidators, validate, updatePlan);

export default router;
