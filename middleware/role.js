import { StatusCodes } from "http-status-codes";

const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ msg: "Access denied. You are not authorized to do that ." });
    }

    next();
  };
};

export default authorizeRole;
