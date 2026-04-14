import crypto from "crypto";
import User from "../../models/user.js";
import config from "../../config/index.js";
import { StatusCodes } from "http-status-codes";
import { UnauthenticatedError } from "../../errors/index.js";

const refreshToken = async (req, res) => {
  const refreshToken = req.signedCookies.refreshToken;
  if (!refreshToken)
    throw new UnauthenticatedError("No refresh token provided");

  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const user = await User.findOne({ refreshToken: hashedRefreshToken });

  if (!user) {
    const reusedUser = await User.findOne({ previousRefreshToken: hashedRefreshToken });
    if (reusedUser) {
      reusedUser.refreshToken = undefined;
      reusedUser.previousRefreshToken = undefined;
      await reusedUser.save();
      return res.status(403).json({
        msg: "Refresh token was already used. All sessions revoked. Please sign in again.",
      });
    }
    throw new UnauthenticatedError("Invalid refresh token");
  }

  const accessToken = user.createJWT();
  const newRefreshToken = user.createRefreshToken();
  const newHashedRefreshToken = crypto
    .createHash("sha256")
    .update(newRefreshToken)
    .digest("hex");

  user.previousRefreshToken = user.refreshToken;
  user.refreshToken = newHashedRefreshToken;
  await user.save();

  const oneDay = 1000 * 60 * 60 * 24;
  const thirtyDays = 1000 * 60 * 60 * 24 * 30;
  const cookieOpts = {
    httpOnly: true,
    signed: true,
    secure: config.isProd,
    sameSite: config.isProd ? "none" : "lax",
  };
  res.cookie("token", accessToken, { ...cookieOpts, expires: new Date(Date.now() + oneDay) });
  res.cookie("refreshToken", newRefreshToken, { ...cookieOpts, expires: new Date(Date.now() + thirtyDays) });

  // Return new access token and refresh token
  res.status(StatusCodes.OK).json({ msg: 'Token refreshed' });
};

export default refreshToken;
