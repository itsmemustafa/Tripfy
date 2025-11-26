import Place from "../../models/place.js";
import { StatusCodes } from "http-status-codes";

const updatePlace = async (req, res) => { 
  const { id } = req.params;
  const updateData = req.body;

  const updatedPlace = await Place.findByIdAndUpdate(
    id,
    updateData,
    { 
      new: true,
      runValidators: true
    }
  );

  if (!updatedPlace) { 
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Place not found" });
  }

  return res
    .status(StatusCodes.OK)
    .json({ 
      message: "Place updated successfully",
      place: updatedPlace 
    });
};

export default updatePlace; 