import Plan from "../../models/plan.js";
import { StatusCodes } from "http-status-codes";

export const updatePlan = async (req, res) => {
  const { planTitle, city, planType, startDate, duration, status, days, budget, note } =
    req.body;

  const plan = await Plan.findOne({
    _id: req.params.id,
    user: req.user.userId,
  });

  if (!plan) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Plan not found" });
  }

  // Update fields
  if (planTitle) plan.planTitle = planTitle;
  if (city) plan.city = city;
  if (planType) plan.planType = planType;
  if (startDate) plan.startDate = startDate;
  if (duration) plan.duration = duration;
  if (days) plan.days = days;
  if (budget) plan.budget = budget;
  if (status) plan.status = status;
  if (note !== undefined) plan.note = note;

  await plan.save();

  const updatedPlan = await Plan.findById(plan._id).populate("days.places.place");

  return res.status(StatusCodes.OK).json({
    message: "Plan updated successfully",
    plan: updatedPlan,
  });
};