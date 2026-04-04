import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import helmet from "helmet";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import recordRoutes from "./routes/recordRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

import { protect } from "./middlewares/authMiddleware.js";
import { allowRoles } from "./middlewares/roleMiddleware.js";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import swaggerSpec from "./config/swagger.js";
import { requestLogger } from "./middlewares/requestLogger.js";
import { responseEnvelope } from "./middlewares/responseMiddleware.js";

export const createApp = () => {
  const app = express();

  app.disable("x-powered-by");
  if (process.env.TRUST_PROXY === "1") app.set("trust proxy", 1);

  app.use(requestLogger);

  app.use(
    helmet({
      crossOriginResourcePolicy: false
    })
  );

  app.use(express.json());
  const corsOrigin = process.env.CORS_ORIGIN;
  app.use(
    cors({
      origin: corsOrigin ? corsOrigin.split(",").map((o) => o.trim()) : true,
      credentials: true
    })
  );

  app.use(responseEnvelope);

  if (process.env.NODE_ENV !== "test") {
    app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 100,
        standardHeaders: true,
        legacyHeaders: false
      })
    );

    app.use(
      "/api/auth",
      rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 20,
        standardHeaders: true,
        legacyHeaders: false
      })
    );
  }

  /**
   * @openapi
   * /:
   *   get:
   *     tags: [Misc]
   *     summary: Health check
   *     responses:
   *       200:
   *         description: OK
   */
  app.get("/", (req, res) => {
    res.success({ message: "API running..." });
  });

  app.use("/api/auth", authRoutes);

  /**
   * @openapi
   * /api/test:
   *   get:
   *     tags: [Misc]
   *     security: [{ bearerAuth: [] }]
   *     summary: Protected route test
   *     responses:
   *       200:
   *         description: OK
   *       401:
   *         description: Unauthorized
   */
  app.get("/api/test", protect, (req, res) => {
    res.success({ message: "Protected route working", user: req.user });
  });

  /**
   * @openapi
   * /api/admin:
   *   get:
   *     tags: [Misc]
   *     security: [{ bearerAuth: [] }]
   *     summary: Admin-only route test
   *     responses:
   *       200:
   *         description: OK
   *       403:
   *         description: Forbidden
   */
  app.get("/api/admin", protect, allowRoles("ADMIN"), (req, res) => {
    res.success({ message: "Admin access granted" });
  });

  app.use("/api/users", userRoutes);
  app.use("/api/records", recordRoutes);
  app.use("/api/dashboard", dashboardRoutes);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
