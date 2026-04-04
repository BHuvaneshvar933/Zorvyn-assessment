import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({
          success: false,
          error: { message: "Not authorized", code: "UNAUTHORIZED" },
          requestId: req.id || req.headers["x-request-id"]
        });
      }

      if (user.status !== "ACTIVE") {
        return res.status(403).json({
          success: false,
          error: { message: "User is inactive", code: "USER_INACTIVE" },
          requestId: req.id || req.headers["x-request-id"]
        });
      }

      req.user = user;

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: { message: "Not authorized", code: "UNAUTHORIZED" },
        requestId: req.id || req.headers["x-request-id"]
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { message: "No token provided", code: "NO_TOKEN" },
      requestId: req.id || req.headers["x-request-id"]
    });
  }
};
