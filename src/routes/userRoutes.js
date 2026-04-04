import express from "express";
import { body, param } from "express-validator";
import {
  getUsers,
  updateUserRole,
  updateUserStatus
} from "../controllers/userController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";

const router = express.Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     summary: List all users (Admin)
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/", protect, allowRoles("ADMIN"), getUsers);

/**
 * @openapi
 * /api/users/{id}/role:
 *   patch:
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     summary: Update a user's role (Admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role: { type: string, enum: [VIEWER, ANALYST, ADMIN] }
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not found
 */
router.patch(
  "/:id/role",
  protect,
  allowRoles("ADMIN"),
  param("id").isMongoId().withMessage("invalid id"),
  body("role")
    .isIn(["VIEWER", "ANALYST", "ADMIN"])
    .withMessage("role must be VIEWER, ANALYST, or ADMIN"),
  validate,
  updateUserRole
);

/**
 * @openapi
 * /api/users/{id}/status:
 *   patch:
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     summary: Update a user's status (Admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [ACTIVE, INACTIVE] }
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not found
 */
router.patch(
  "/:id/status",
  protect,
  allowRoles("ADMIN"),
  param("id").isMongoId().withMessage("invalid id"),
  body("status")
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage("status must be ACTIVE or INACTIVE"),
  validate,
  updateUserStatus
);

export default router;
