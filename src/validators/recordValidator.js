import { body } from "express-validator";

export const validateRecord = [
  body("amount").isNumeric().withMessage("Amount must be a number"),
  body("type")
    .isIn(["INCOME", "EXPENSE"])
    .withMessage("Invalid type"),
  body("category").notEmpty().withMessage("Category is required"),
  body("date").isISO8601().withMessage("Invalid date format")
];