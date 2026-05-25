import User from "../../models/user.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../../errors/index.js";

const updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
        throw new BadRequestError("Invalid role. Must be 'user' or 'admin'");
    }

    const user = await User.findByIdAndUpdate(
        id,
        { role },
        { new: true, runValidators: true }
    ).select('-password -refreshToken');

    if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            msg: "User not found"
        });
    }

    res.status(StatusCodes.OK).json({
        success: true,
        msg: "User role updated successfully",
        user
    });
};

export default updateUserRole;
