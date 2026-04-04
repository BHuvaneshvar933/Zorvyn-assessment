import User from "../models/User.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

// GET all users
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.success(users);
});

// UPDATE role
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      error: { message: "User not found", code: "NOT_FOUND" },
      requestId: req.id || req.headers["x-request-id"]
    });
  }

  res.success({ message: "Role updated", user });
});

// UPDATE status
export const updateUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      error: { message: "User not found", code: "NOT_FOUND" },
      requestId: req.id || req.headers["x-request-id"]
    });
  }

  res.success({ message: "Status updated", user });
});
