export const getPlanById = async (req, res) => {
    
  const plan = await Plan.findOne({
    _id: req.params.id,
    user: req.user.userId,
  }).populate("places.place");

  if (!plan) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Plan not found" });
  }

  return res.status(StatusCodes.OK).json({ plan });
};