import crypto from "crypto";
import User from "../../models/user.js";
import { StatusCodes } from "http-status-codes";
import { UnauthenticatedError } from "../../errors/index.js";

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    throw new UnauthenticatedError("No refresh token provided");

  // Hash the incoming refresh token to match how it's stored in the database
  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");


  // Find user by hashed refresh token
  const user = await User.findOne({ refreshToken: hashedRefreshToken });
  if (!user) throw new UnauthenticatedError("Invalid refresh token");

  // Generate new access token
  const accessToken = user.createJWT();


  const newRefreshToken = user.createRefreshToken();
  const newHashedRefreshToken = crypto
    .createHash("sha256")
    .update(newRefreshToken)
    .digest("hex");
  user.refreshToken = newHashedRefreshToken;
  await user.save();

  // Return new access token and refresh token
  res.status(StatusCodes.OK).json({
    accessToken,
    newRefreshToken, // Return the new Refresh token 
  });
};

export default refreshToken;
