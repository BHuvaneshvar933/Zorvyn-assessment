import { validationResult } from "express-validator";

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Invalid request",
        code: "INVALID_REQUEST",
        details: { errors: errors.array() }
      },
      requestId: req.id || req.headers["x-request-id"]
    });
  }

  next();
};
