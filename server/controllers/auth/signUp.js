import User from "../../models/user.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../../errors/index.js";
import crypto from "crypto";

const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validation
  if (!name || !email || !password) {
    throw new BadRequestError("Please provide all values");
  }



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
  /* Attach cookies */
  const oneDay = 1000 * 60 * 60 * 24;
  const thirtyDays = 1000 * 60 * 60 * 24 * 30;

  res.cookie('token', accessToken, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + thirtyDays),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });

  // Send to client
  res.status(StatusCodes.CREATED).json({
    msg: "User registered successfully",
    user: { name: newUser.name, email: newUser.email, role: newUser.role },
  });
};

export default signup;
