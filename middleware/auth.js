import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import Dotenv from "dotenv";
Dotenv.config();

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

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
    console.warn("Auth error:", error.name, error.message);

    // In development show a bit more information to help debug quickly
    if (process.env.NODE_ENV !== "production") {
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
