import express from "express";
import { body } from "express-validator";
import { register, login } from "../controllers/authController.js";
import { validate } from "../middlewares/validateMiddleware.js";

const router = express.Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 _id: 64b0b84b3b1a2c0012345678
 *                 email: test@example.com
 *                 token: <jwt>
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/register",
  body("name").isString().trim().notEmpty().withMessage("name is required"),
  body("email").isEmail().withMessage("email must be valid").normalizeEmail(),
  body("password")
    .isString()
    .isLength({ min: 6, max: 128 })
    .withMessage("password must be 6-128 characters"),
  validate,
  register
);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login and get JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 _id: 64b0b84b3b1a2c0012345678
 *                 email: test@example.com
 *                 token: <jwt>
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/login",
  body("email").isEmail().withMessage("email must be valid").normalizeEmail(),
  body("password").isString().notEmpty().withMessage("password is required"),
  validate,
  login
);

export default router;
