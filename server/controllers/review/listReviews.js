import { StatusCodes } from "http-status-codes";
import Review from "../../models/review.js";

const getReviews = async (req, res) => {
  const { sort, page = 1, limit = 5 } = req.query;

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

  const skip = (Number(page) - 1) * Number(limit);

  const reviews = await Review.find({ place: placeId })
    .populate("user", "name")
    .sort(sortOption)
    .skip(skip)
    .limit(Number(limit));

  const total = await Review.countDocuments({ place: placeId });

  return res.status(StatusCodes.OK).json({
    reviews,
    count: reviews.length,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit))
  });
};
export default getReviews;
