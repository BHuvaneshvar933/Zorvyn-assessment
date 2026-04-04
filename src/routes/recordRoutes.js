import express from "express";
import { body, param, query } from "express-validator";
import {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord
} from "../controllers/recordController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";

const router = express.Router();

/**
 * @openapi
 * /api/records:
 *   post:
 *     tags: [Records]
 *     security: [{ bearerAuth: [] }]
 *     summary: Create a financial record (Admin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, type, category, date]
 *             properties:
 *               amount: { type: number }
 *               type: { type: string, enum: [INCOME, EXPENSE] }
 *               category: { type: string }
 *               date: { type: string, format: date-time }
 *               notes: { type: string }
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 _id: 64b0b84b3b1a2c0012345678
 *                 amount: 100
 *                 type: INCOME
 *                 category: Salary
 *                 date: 2026-01-01T00:00:00.000Z
 *                 notes: January salary
 */
router.post(
  "/",
  protect,
  allowRoles("ADMIN"),
  body("amount").isFloat({ gt: 0 }).withMessage("amount must be a number > 0"),
  body("type").isIn(["INCOME", "EXPENSE"]).withMessage("type must be INCOME or EXPENSE"),
  body("category").isString().trim().notEmpty().withMessage("category is required"),
  body("date").isISO8601().withMessage("date must be a valid ISO8601 date"),
  body("notes").optional().isString().trim().isLength({ max: 1000 }).withMessage("notes too long"),
  validate,
  createRecord
);

/**
 * @openapi
 * /api/records:
 *   get:
 *     tags: [Records]
 *     security: [{ bearerAuth: [] }]
 *     summary: List records (Analyst/Admin)
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [INCOME, EXPENSE] }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100 }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data: []
 *               meta:
 *                 total: 0
 *                 page: 1
 *                 pages: 0
 *                 limit: 10
 */
router.get(
  "/",
  protect,
  allowRoles("ANALYST", "ADMIN"),
  query("search").optional().isString().trim().isLength({ min: 1, max: 100 }),
  query("type").optional().isIn(["INCOME", "EXPENSE"]),
  query("category").optional().isString().trim().notEmpty(),
  query("startDate").optional().isISO8601(),
  query("endDate").optional().isISO8601(),
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  validate,
  getRecords
);

/**
 * @openapi
 * /api/records/{id}:
 *   get:
 *     tags: [Records]
 *     security: [{ bearerAuth: [] }]
 *     summary: Get record by id (Analyst/Admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 _id: 64b0b84b3b1a2c0012345678
 *                 amount: 100
 *                 type: INCOME
 *                 category: Salary
 *                 date: 2026-01-01T00:00:00.000Z
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/:id",
  protect,
  allowRoles("ANALYST", "ADMIN"),
  param("id").isMongoId().withMessage("invalid id"),
  validate,
  getRecordById
);

/**
 * @openapi
 * /api/records/{id}:
 *   patch:
 *     tags: [Records]
 *     security: [{ bearerAuth: [] }]
 *     summary: Update a record (Admin)
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
 *             properties:
 *               amount: { type: number }
 *               type: { type: string, enum: [INCOME, EXPENSE] }
 *               category: { type: string }
 *               date: { type: string, format: date-time }
 *               notes: { type: string }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 _id: 64b0b84b3b1a2c0012345678
 *                 amount: 120
 *                 type: INCOME
 *                 category: Salary
 *       404:
 *         description: Not found
 */

router.patch(
  "/:id",
  protect,
  allowRoles("ADMIN"),
  param("id").isMongoId().withMessage("invalid id"),
  body("amount").optional().isFloat({ gt: 0 }).withMessage("amount must be a number > 0"),
  body("type").optional().isIn(["INCOME", "EXPENSE"]).withMessage("type must be INCOME or EXPENSE"),
  body("category").optional().isString().trim().notEmpty(),
  body("date").optional().isISO8601().withMessage("date must be a valid ISO8601 date"),
  body("notes").optional().isString().trim().isLength({ max: 1000 }).withMessage("notes too long"),
  validate,
  updateRecord
);

/**
 * @openapi
 * /api/records/{id}:
 *   delete:
 *     tags: [Records]
 *     security: [{ bearerAuth: [] }]
 *     summary: Soft delete a record (Admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 message: Record deleted (soft)
 *       404:
 *         description: Not found
 */

router.delete(
  "/:id",
  protect,
  allowRoles("ADMIN"),
  param("id").isMongoId().withMessage("invalid id"),
  validate,
  deleteRecord
);

export default router;
