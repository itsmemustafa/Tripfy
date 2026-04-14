import { validationResult } from "express-validator";
import { BadRequestError } from "../errors/index.js";


export default function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    return next(new BadRequestError(messages.join(". ")));
  }
  next();
}
