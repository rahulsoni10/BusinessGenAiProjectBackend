// models/user.model.js
import mongoose from "mongoose";

/**
 * User Schema
 * @typedef {Object} User
 * @property {String} name - User's name
 * @property {String} email - User's email (unique, lowercase)
 * @property {String} password - Hashed password
 * @property {String} role - User role ('user' or 'admin')
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
