import Plan from "../../models/plan.js";
import { StatusCodes } from "http-status-codes";

export const getPlans = async (req, res) => {
    const { page = 1, limit = 6 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter = { user: req.user.userId };
    const plans = await Plan.find(filter)
        .sort("-createdAt")
        .skip(skip)
        .limit(Number(limit));

    const total = await Plan.countDocuments(filter);

    return res.status(StatusCodes.OK).json({
        plans,
        count: plans.length,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit))
    });
};
