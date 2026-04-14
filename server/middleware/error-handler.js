import { StatusCodes } from "http-status-codes";
import logger from "../utils/logger.js";

const errorHandlerMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  let message = err.message || "Something went wrong, try again later";

  if (err.name === "ValidationError") {
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
    statusCode = StatusCodes.BAD_REQUEST;
  }
  if (err.code && err.code === 11000) {
    message = `Duplicate value for ${Object.keys(err.keyValue).join(", ")}`;
    statusCode = StatusCodes.BAD_REQUEST;
  }
  if (err.name === "CastError") {
    message = `No item found with id: ${err.value}`;
    statusCode = StatusCodes.NOT_FOUND;
  }

  if (statusCode >= 500) {
    logger.error(message, {
      requestId: req.id,
      stack: err.stack,
      name: err.name,
    });
  }

  return res.status(statusCode).json({
    code: statusCode,
    message,
    msg: message,
  });
};

export default errorHandlerMiddleware;
