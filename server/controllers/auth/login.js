import User from "../../models/user.js";
import { UnauthenticatedError } from "../../errors/index.js";
import config from "../../config/index.js";
import { StatusCodes } from "http-status-codes";
import crypto from "crypto";

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const existUser = await User.findOne({ email });

  if (!existUser) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const isMatchedPassword = await existUser.comparePassword(password);

  if (!isMatchedPassword) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const accessToken = existUser.createJWT();
  const refreshToken = existUser.createRefreshToken();

  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  existUser.refreshToken = hashedRefreshToken;
  await existUser.save();

  /* Attach cookies */
  const oneDay = 1000 * 60 * 60 * 24;
  const thirtyDays = 1000 * 60 * 60 * 24 * 30;

  const cookieOpts = {
    httpOnly: true,
    signed: true,
    secure: config.isProd,
    sameSite: config.isProd ? "none" : "lax",
  };
  res.cookie("token", accessToken, { ...cookieOpts, expires: new Date(Date.now() + oneDay) });
  res.cookie("refreshToken", refreshToken, { ...cookieOpts, expires: new Date(Date.now() + thirtyDays) });

  res.status(StatusCodes.OK).json({
    msg: "Login successful",

    user: { name: existUser.name, email: existUser.email, role: existUser.role },
    accessToken,

  });
};
export default login;
