import pinoHttp from "pino-http";
import { randomUUID } from "crypto";

import { logger } from "../utils/logger.js";

export const requestLogger = pinoHttp({
  logger,
  genReqId: (req, res) => {
    const existing = req.headers["x-request-id"];
    const id = (Array.isArray(existing) ? existing[0] : existing) || randomUUID();
    res.setHeader("X-Request-Id", id);
    return id;
  },
  customProps: (req) => ({
    userId: req.user?._id,
    role: req.user?.role
  })
});
