import { Router } from "express";
import addPlace from "../controllers/places/addPlace.js";
import deletePlace from "../controllers/places/deletePlace.js";
import getPlace from "../controllers/places/getPlace.js";
import listPlaces from "../controllers/places/listPlaces.js";
import updatePlace from "../controllers/places/updatePlace.js";
import role from "../middleware/role.js";
import auth from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import {
  createPlaceValidators,
  updatePlaceValidators,
} from "../validators/placeValidators.js";
import { upload } from "../middleware/upload.js";
import uploadImage from "../controllers/places/uploadImage.js";

const router = Router();

// Image upload route (admin only)
router.post(
  "/upload-image",
  auth,
  role("admin"),
  upload.single("image"),
  uploadImage
);

router
  .route("/")
  .get(listPlaces)
  .post(auth, role("admin"), createPlaceValidators, validate, addPlace);

router
  .route("/:id")
  .get(getPlace)
  .patch(auth, role("admin"), updatePlaceValidators, validate, updatePlace)
  .delete(auth, role("admin"), deletePlace);

export default router;