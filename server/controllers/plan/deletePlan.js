export const deletePlan = async (req, res) => {
  const result = await Plan.deleteOne({
    _id: req.params.id,
    user: req.user.userId,
  });

  if (result.deletedCount === 0) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Plan not found" });
  }

  return res.status(StatusCodes.OK).json({
    message: "Plan deleted successfully",
  });
};

