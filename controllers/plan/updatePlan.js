export const updatePlan = async (req, res) => {
  const { planTitle, city, planType, startDate, endDate, status, places } =
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
  if (places) plan.places = places;

  await plan.save();

  const updatedPlan = await Plan.findById(plan._id).populate("places.place");

  return res.status(StatusCodes.OK).json({
    message: "Plan updated successfully",
    plan: updatedPlan,
  });
};