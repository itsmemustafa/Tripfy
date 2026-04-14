import express from "express";
import rateLimit from "express-rate-limit";
import login from "../controllers/auth/login.js";
import signup from "../controllers/auth/signUp.js";
import logout from "../controllers/auth/logout.js";
import refreshToken from "../controllers/auth/refreshToken.js";
import getCurrentUser from "../controllers/auth/getCurrentUser.js";
import auth from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import { issueCsrfToken } from "../middleware/csrf.js";
import {
  loginValidators,
  signupValidators,
} from "../validators/authValidators.js";

const router = express.Router();

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { msg: "Too many attempts; try again later." },
});

router.get("/csrf-token", issueCsrfToken);
router.post("/login", authRateLimit, loginValidators, validate, login);
router.post("/signup", authRateLimit, signupValidators, validate, signup);
router.post("/logout", logout);
router.post("/refresh-token", authRateLimit, refreshToken);
router.get("/me", auth, getCurrentUser);
export default router;
