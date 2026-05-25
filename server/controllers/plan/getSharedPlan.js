import Plan from "../../models/plan.js";
import { StatusCodes } from "http-status-codes";

export const getSharedPlan = async (req, res) => {
  const plan = await Plan.findOne({
    _id: req.params.id,
    status: "published",
  }).populate("days.places.place");

  if (!plan) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "Plan not found or is not publicly shared. Only published plans can be shared.",
    });
  }

  return res.status(StatusCodes.OK).json({ plan });
};
