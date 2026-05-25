import User from "../../models/user.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundError, BadRequestError } from "../../errors/index.js";

const deleteUser = async (req, res) => {
    const { id } = req.params;

    // Prevent deleting self (optional, assuming req.user is set by auth middleware)
    if (req.user && req.user.userId === id) {
        throw new BadRequestError("You cannot delete your own account");
    }

    const user = await User.findOne({ _id: id });

    if (!user) {
        throw new NotFoundError(`No user with id : ${id}`);
    }

    await user.deleteOne();

    res.status(StatusCodes.OK).json({ msg: "User deleted successfully" });
};

export default deleteUser;
