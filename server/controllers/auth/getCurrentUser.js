import { StatusCodes } from "http-status-codes";

// Get current authenticated user from JWT in cookie
const getCurrentUser = async (req, res) => {
    // auth middleware has already attached req.user from the JWT
    const { userId, name, role } = req.user;

    res.status(StatusCodes.OK).json({
        user: {
            userId,
            name,
            role
        }
    });
};

export default getCurrentUser;
