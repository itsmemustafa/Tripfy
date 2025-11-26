import Review from "../../models/review.js";
import { StatusCodes } from "http-status-codes";
const deleteReview = async (req, res) => {
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Review not found" });
  }
  if (review.user.toString() !== req.user.userId) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "Not authorized to delete this review" });
  }
  await review.deleteOne();
  res.status(StatusCodes.OK).json({ message: "Review deleted successfully" });
};

export default deleteReview; 

