import { body } from "express-validator";

export const createPlanValidators = [
  body("planTitle").trim().notEmpty().withMessage("planTitle is required"),
  body("city").trim().notEmpty().withMessage("city is required"),
  body("startDate").trim().notEmpty().withMessage("startDate is required"),
  body("duration")
    .isInt({ min: 1 })
    .withMessage("duration must be a positive integer"),
];

export const updatePlanValidators = [
  body("planTitle")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("planTitle cannot be empty"),
  body("duration")
    .optional()
    .isInt({ min: 1 })
    .withMessage("duration must be a positive integer"),
];

