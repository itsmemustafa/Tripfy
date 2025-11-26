import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Dotenv from "dotenv";
Dotenv.config();

// User schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please provide valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
  },
  role:{
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  refreshToken: {
    type: String, 
  },
  
},
{ timestamps: true });

// Hash password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Methods

// Get user name
UserSchema.methods.getName = function () {
  return this.name;
};

// Create Access JWT
UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name , role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME
    }
  );
};

// Compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create Refresh Token
UserSchema.methods.createRefreshToken = function () {
  const refreshToken = crypto.randomBytes(40).toString("hex"); // random string
  this.refreshToken = refreshToken; 
  return refreshToken;
};

// Verify Refresh Token
UserSchema.methods.verifyRefreshToken = function (token) {
  return token === this.refreshToken;
};

const User = mongoose.model("Users", UserSchema);
export default User;
