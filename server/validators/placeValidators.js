import { body } from "express-validator";

export const createPlaceValidators = [
  body("name").trim().notEmpty().withMessage("Place name is required"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("location.city")
    .trim()
    .notEmpty()
    .withMessage("Location.city is required"),
  body("location.coordinates.lat")
    .isFloat()
    .withMessage("Location.coordinates.lat must be a number"),
  body("location.coordinates.lng")
    .isFloat()
    .withMessage("Location.coordinates.lng must be a number"),
];

export const updatePlaceValidators = [
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
  body("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category cannot be empty"),
];

