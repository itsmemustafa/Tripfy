import { Router } from "express";

import getReviews from "../controllers/review/listReviews.js";
import deleteReview from "../controllers/review/deleteReview.js";
import updateReview from "../controllers/review/updateReview.js";
import addReview from "../controllers/review/addReview.js";
import authenticateUser from "../middleware/auth.js";

const router = Router();
router.post("/", authenticateUser, addReview);
router.get("/:placeId", getReviews);
router.delete("/:reviewId", authenticateUser, deleteReview);
router.put("/:reviewId", authenticateUser, updateReview);
export default router;
