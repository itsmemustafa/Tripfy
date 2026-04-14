import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import config from "../config/index.js";
import logger from "../utils/logger.js";

const auth = async (req, res, next) => {
  let token = req.signedCookies?.token;
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Access denied. No token provided." });
  }

  try {
    const payload = jwt.verify(token, config.jwt.secret);

    req.user = {
      userId: payload.userId,
      name: payload.name,
      role: payload.role,
    };

    next();
  } catch (error) {
    // here the front should use refresh token to get a new access token
    if (error.name === "TokenExpiredError") {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Access token expired" });
    }

    // Log JWT errors server-side for debugging (without logging token contents).
    logger.warn("Auth error", { name: error.name, message: error.message });

    // In development show a bit more information to help debug quickly
    if (!config.isProd) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Invalid access token", error: error.name });
    }

    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Invalid access token" });
  }
};

export default auth;
