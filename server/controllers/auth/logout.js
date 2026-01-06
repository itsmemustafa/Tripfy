import User from "../../models/user.js";
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

  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie('refreshToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({
    msg: "Logged out successfully",
  });
};

export default logout;
