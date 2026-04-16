import User from "../../models/user.js";
import config from "../../config/index.js";
import { StatusCodes } from "http-status-codes";
import crypto from "crypto";

const signup = async (req, res) => {
  const { name, email, password, role } = req.body;



  // Create user
  const newUser = await User.create({ name, email, password, role });

  // Generate tokens

  const accessToken = newUser.createJWT();
  const refreshToken = newUser.createRefreshToken();
  // Hash refresh token before storing in DB (for security)
  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  // Save hashed refresh token in DB
  newUser.refreshToken = hashedRefreshToken;
  await newUser.save();

  // Send tokens to client
  const oneDay = 1000 * 60 * 60 * 24;
  const thirtyDays = 1000 * 60 * 60 * 24 * 30;
  const cookieOpts = {
    httpOnly: true,
    signed: true,
    // Required for cross-domain cookies between Localhost and Railway
    secure: config.isProd || process.env.NODE_ENV === "production",
    sameSite: config.isProd || process.env.NODE_ENV === "production" ? "none" : "lax",
  };
  res.cookie("token", accessToken, { ...cookieOpts, expires: new Date(Date.now() + oneDay) });
  res.cookie("refreshToken", refreshToken, { ...cookieOpts, expires: new Date(Date.now() + thirtyDays) });

  // Send to client
  res.status(StatusCodes.CREATED).json({
    msg: "User registered successfully",
    user: { name: newUser.name, email: newUser.email, role: newUser.role },
  });
};

export default signup;
