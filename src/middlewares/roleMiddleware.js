export const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { message: "Access denied", code: "FORBIDDEN" },
        requestId: req.id || req.headers["x-request-id"]
      });
    }
    next();
  };
};
