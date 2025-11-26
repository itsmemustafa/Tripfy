
// not used : keep it for future , if we gonna add user profile review fetching

// import { StatusCodes } from "http-status-codes";
// import Review from "../../models/review";

// const getReview = async (req, res) => {
//   const { reviewId } = req.params;
//   if (!reviewId) {
//     return res
//       .status(StatusCodes.NOT_FOUND)
//       .json({ message: "need to provide id" });
//   }
//   const review =await Review.findById(reviewId);
// if(!review)
//     {
//          return  res.status(StatusCodes.NOT_FOUND).json({message:"review not found"});
//     }
// res.status(StatusCodes.OK).json({ review });

// };
// export default getReview;