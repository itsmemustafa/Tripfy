import Review from "../../models/review.js";
import { StatusCodes } from "http-status-codes";
import logger from "../../utils/logger.js";

const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find({})
            .populate('user', 'name email')
            .populate('place', 'name');

        res.status(StatusCodes.OK).json({
            success: true,
            count: reviews.length,
            reviews
        });
    } catch (error) {
        logger.error("getAllReviews failed", { message: error.message, stack: error.stack });
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            msg: "Error fetching reviews"
        });
    }
};

export default getAllReviews;
