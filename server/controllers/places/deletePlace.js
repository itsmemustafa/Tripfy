import Place from "../../models/place.js";
import { StatusCodes } from "http-status-codes";
const deletePlace = async (req, res) => {
  const { id } = req.params;
  const place = await Place.findById(id);
  if (!place) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Place not found" });
  }
  const deletedPlace = await Place.findByIdAndDelete(id);
  return res
    .status(StatusCodes.OK)
    .json({ message: "Place deleted successfully", place: deletedPlace });
};

export default deletePlace