import { StatusCodes } from "http-status-codes";
import Review from "../../models/review.js";

const getReviews = async (req, res) => {
  const { sort } = req.query;

  const { placeId } = req.params;

  //sorting logic
  let sortOption = {};
  if (sort === "latest") {
    sortOption = { createdAt: -1 };
  } else if (sort === "rating") {
    sortOption = { rating: -1 };
  } else {
    // Default sort
    sortOption = { createdAt: -1 };
  }

  const reviews = await Review.find({ place: placeId })
    .populate("user", "name")
    .sort(sortOption);

  return res.status(StatusCodes.OK).json({
    reviews,
    count: reviews.length,
  });
};
export default getReviews;
