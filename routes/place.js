import { Router } from "express";
import addPlace from "../controllers/places/addPlace.js";
import deletePlace from "../controllers/places/deletePlace.js";
import getPlace from "../controllers/places/getPlace.js";
import listPlaces from "../controllers/places/listPlaces.js";
import updatePlace from "../controllers/places/updatePlace.js";
import role from "../middleware/role.js";
import auth from "../middleware/auth.js";
const router = Router();

// /places routes
router.route("/")
  .get(listPlaces)   
  .post(auth,role('admin'), addPlace);     

// /places/:id routes
router.route("/:id")
  .get(getPlace)      
  .patch(auth,role('admin'),updatePlace)  
  .delete(auth,role('admin'),deletePlace);

export default router; 