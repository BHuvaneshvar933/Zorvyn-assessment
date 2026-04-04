import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({
      success: false,
      error: { message: "User already exists", code: "USER_EXISTS" },
      requestId: req.id || req.headers["x-request-id"]
    });
  }

  const user = await User.create({ name, email, password });

  res.status(201).success(
    {
      _id: user._id,
      email: user.email,
      token: generateToken(user._id)
    },
    { requestId: req.id || req.headers["x-request-id"] }
  );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.success(
      {
        _id: user._id,
        email: user.email,
        token: generateToken(user._id)
      },
      { requestId: req.id || req.headers["x-request-id"] }
    );
  } else {
    res.status(401).json({
      success: false,
      error: { message: "Invalid credentials", code: "INVALID_CREDENTIALS" },
      requestId: req.id || req.headers["x-request-id"]
    });
  }
});
