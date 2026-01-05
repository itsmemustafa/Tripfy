import Review from "../../models/review.js";
import { StatusCodes } from "http-status-codes";

const addReview = async (req, res) => {
  const { placeId, rating, comment } = req.body;
  if (!placeId || !rating || !comment) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide all required fields" });
  }
  const newReview = await Review.create({
    user: req.user.userId,
    place: placeId,
    text: comment,
    rating,
  });
  return res.status(StatusCodes.CREATED).json({ review: newReview });
};
export default addReview;