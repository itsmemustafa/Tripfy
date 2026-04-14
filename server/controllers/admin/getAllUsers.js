import User from "../../models/user.js";
import { StatusCodes } from "http-status-codes";

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password -refreshToken');

        res.status(StatusCodes.OK).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            msg: "Error fetching users"
        });
    }
};

export default getAllUsers;
