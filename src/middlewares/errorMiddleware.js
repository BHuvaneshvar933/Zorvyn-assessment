export const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  const requestId = req.id || req.headers["x-request-id"];

  // Mongo duplicate key
  if (err?.code === 11000) {
    return res.status(409).json({
      success: false,
      error: {
        message: "Duplicate key",
        code: "DUPLICATE_KEY",
        details: { key: err?.keyValue }
      },
      requestId
    });
  }

  // Mongoose bad ObjectId
  if (err?.name === "CastError") {
    return res.status(400).json({
      success: false,
      error: { message: "Invalid id", code: "INVALID_ID" },
      requestId
    });
  }

  // Mongoose validation
  if (err?.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      error: {
        message: "Validation failed",
        code: "VALIDATION_FAILED",
        details: {
          errors: Object.values(err.errors || {}).map((e) => e.message)
        }
      },
      requestId
    });
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message: err?.message || "Server error",
      code: statusCode === 404 ? "NOT_FOUND" : "SERVER_ERROR"
    },
    requestId
  });
};
