import { body } from "express-validator";

export const createReviewValidators = [
  body("placeId").trim().notEmpty().withMessage("placeId is required"),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("rating must be an integer between 1 and 5"),
  body("comment").trim().notEmpty().withMessage("comment is required"),
];

export const updateReviewValidators = [
  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("rating must be an integer between 1 and 5"),
  body("comment")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("comment cannot be empty"),
];

