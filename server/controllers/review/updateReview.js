import { StatusCodes } from "http-status-codes";
import Review from "../../models/review.js";

const updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { text, rating } = req.body;

  if (!text || rating === undefined) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Missing text or rating" });
  }
  const review = await Review.findById(reviewId);
  if (!review) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Review not found" });
  }

  if (review.user.toString() !== req.user.userId) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "Not authorized to update this review" });
  }
  review.text = text;
  review.rating = rating;
  await review.save();
  res.status(StatusCodes.OK).json({ review });
};
export default updateReview;
