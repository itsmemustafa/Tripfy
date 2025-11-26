import express from "express";
import login from "../controllers/auth/login.js";
import signup from "../controllers/auth/signUp.js";
import logout from "../controllers/auth/logout.js";
import refreshToken from "../controllers/auth/refreshToken.js";
const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
export default router;
