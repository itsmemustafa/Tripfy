import Review from "../../models/review.js";
import { StatusCodes } from "http-status-codes";
import logger from "../../utils/logger.js";

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Review not found" });
  }
  if (review.user.toString() !== req.user.userId && req.user.role !== 'admin') {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "Not authorized to delete this review" });
  }
  await review.deleteOne();
  res.status(StatusCodes.OK).json({ message: "Review deleted successfully" });
};

export default deleteReview;
