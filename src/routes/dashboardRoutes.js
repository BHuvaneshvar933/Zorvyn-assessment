import express from "express";
import { query } from "express-validator";
import {
  getSummary,
  getCategoryBreakdown,
  getTrends,
  getRecentActivity
} from "../controllers/dashboardController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";

const router = express.Router();

const dateFilters = [
  query("startDate").optional().isISO8601().withMessage("startDate must be ISO8601"),
  query("endDate").optional().isISO8601().withMessage("endDate must be ISO8601")
];

/**
 * @openapi
 * /api/dashboard/summary:
 *   get:
 *     tags: [Dashboard]
 *     security: [{ bearerAuth: [] }]
 *     summary: Dashboard summary totals
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 totalIncome: 0
 *                 totalExpense: 0
 *                 netBalance: 0
 */
router.get(
  "/summary",
  protect,
  allowRoles("VIEWER", "ANALYST", "ADMIN"),
  ...dateFilters,
  query("category").optional().isString().trim().notEmpty(),
  validate,
  getSummary
);

/**
 * @openapi
 * /api/dashboard/categories:
 *   get:
 *     tags: [Dashboard]
 *     security: [{ bearerAuth: [] }]
 *     summary: Category-wise totals (Viewer/Analyst/Admin)
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [INCOME, EXPENSE] }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data: []
 */

router.get(
  "/categories",
  protect,
  allowRoles("VIEWER", "ANALYST", "ADMIN"),
  ...dateFilters,
  query("type").optional().isIn(["INCOME", "EXPENSE"]).withMessage("type must be INCOME or EXPENSE"),
  validate,
  getCategoryBreakdown
);

/**
 * @openapi
 * /api/dashboard/trends:
 *   get:
 *     tags: [Dashboard]
 *     security: [{ bearerAuth: [] }]
 *     summary: Monthly/weekly trends (Viewer/Analyst/Admin)
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: interval
 *         schema: { type: string, enum: [month, week] }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data: []
 */

router.get(
  "/trends",
  protect,
  allowRoles("VIEWER", "ANALYST", "ADMIN"),
  ...dateFilters,
  query("interval").optional().isIn(["month", "week"]).withMessage("interval must be month or week"),
  query("category").optional().isString().trim().notEmpty(),
  validate,
  getTrends
);

/**
 * @openapi
 * /api/dashboard/recent:
 *   get:
 *     tags: [Dashboard]
 *     security: [{ bearerAuth: [] }]
 *     summary: Recent activity (Analyst/Admin)
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [INCOME, EXPENSE] }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 50 }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data: []
 *               meta:
 *                 limit: 10
 */

router.get(
  "/recent",
  protect,
  allowRoles("ANALYST", "ADMIN"),
  ...dateFilters,
  query("type").optional().isIn(["INCOME", "EXPENSE"]).withMessage("type must be INCOME or EXPENSE"),
  query("category").optional().isString().trim().notEmpty(),
  query("limit").optional().isInt({ min: 1, max: 50 }).toInt(),
  validate,
  getRecentActivity
);

export default router;
