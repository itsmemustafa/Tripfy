import Plan from "../../models/plan.js";
import { StatusCodes } from "http-status-codes";

const addPlan = async (req, res) => {
  const { planTitle, city, planType, startDate, endDate, places } = req.body;

  if (!planTitle || !city || !startDate) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide all required fields" });
  }

  const newPlan = await Plan.create({
    planTitle,
    user: req.user.userId,
    city,
    planType,
    startDate,
    endDate,
    places: places || [],
  });

  const populatedPlan = await Plan.findById(newPlan._id).populate(
    "places.place"
  );

  return res.status(StatusCodes.CREATED).json({
    message: "Plan added successfully",
    plan: populatedPlan,
  });
};

export default addPlan;