import Router from "express";
import getAllUsers from "../controllers/admin/getAllUsers.js";
import getAllPlaces from "../controllers/admin/getAllPlaces.js";
import getAllReviews from "../controllers/admin/getAllReviews.js";
import updateUserRole from "../controllers/admin/updateUserRole.js";
import createUser from "../controllers/admin/createUser.js";
import deleteUser from "../controllers/admin/deleteUser.js";
import deletePlace from "../controllers/places/deletePlace.js";
import deleteReview from "../controllers/review/deleteReview.js";
import auth from "../middleware/auth.js";
import authorizeRole from "../middleware/role.js";

const router = Router();

// All admin routes require authentication and admin role
router.use(auth, authorizeRole('admin'));

// Admin routes
router.get("/users", getAllUsers);
router.post("/users", createUser);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/role", updateUserRole);

router.get("/places", getAllPlaces);
router.delete("/places/:id", deletePlace);

router.get("/reviews", getAllReviews);
router.delete("/reviews/:id", deleteReview);

export default router;
