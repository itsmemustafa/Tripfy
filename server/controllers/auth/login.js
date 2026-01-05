// this is the login controller that handles the login logic

import User from "../../models/user.js";
import { BadRequestError, UnauthenticatedError } from "../../errors/index.js";

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

  res.status(StatusCodes.OK).json({
    msg: "Login successful",
    user: { name: existUser.name, email: existUser.email , role: existUser.role},
    accessToken,
    refreshToken,
  });
};
export default login;
