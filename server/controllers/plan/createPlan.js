import Plan from "../../models/plan.js";
import { StatusCodes } from "http-status-codes";

const addPlan = async (req, res) => {
  const { planTitle, city, planType, startDate, budget, status, note, days, duration } = req.body;

  if (!planTitle || !city || !startDate || !duration) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide all required fields" });
  }

  const newPlan = await Plan.create({
    planTitle,
    user: req.user.userId,
    city,
    startDate,
    duration,
    planType,
    days: days || [],
    budget,
    status,
    note,

  });

  const populatedPlan = await Plan.findById(newPlan._id).populate(
    "days.places.place"
  );

  return res.status(StatusCodes.CREATED).json({
    message: "Plan added successfully",
    plan: populatedPlan,
  });
};

export default addPlan;