import User from "../../models/user.js";
import config from "../../config/index.js";
import { StatusCodes } from "http-status-codes";
import { UnauthenticatedError } from "../../errors/index.js";
import crypto from "crypto";

const logout = async (req, res) => {
  const refreshToken = req.signedCookies.refreshToken;

  if (!refreshToken) {
    throw new UnauthenticatedError("No refresh token provided");
  }
  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  // Update and check in one operation
  const result = await User.updateOne(
    { refreshToken: hashedRefreshToken },
    {
      $set: {
        refreshToken: null,
      },
    }
  );

  // Check if any document was modified
  if (result.matchedCount === 0) {
    throw new UnauthenticatedError("Invalid refresh token");
  }

  const clearOpts = {
    httpOnly: true,
    expires: new Date(0),
    // Required for cross-domain cookies between Localhost and Railway
    secure: config.isProd || process.env.NODE_ENV === "production",
    sameSite: config.isProd || process.env.NODE_ENV === "production" ? "none" : "lax",
  };
  res.cookie("token", "", clearOpts);
  res.cookie("refreshToken", "", clearOpts);

  res.status(StatusCodes.OK).json({
    msg: "Logged out successfully",
  });
};

export default logout;
