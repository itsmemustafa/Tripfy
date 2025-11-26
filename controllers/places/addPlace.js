import Place from "../../models/place.js";
import { StatusCodes } from "http-status-codes";
const addPlace = async (req, res) => {
  const { name, category, subcategory, location, description, images } =
    req.body;

  // only enforce minimum required fields
  if (!name || !category || !location) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "name, category and location are required" });
  }

  // ensure location has city and coordinates
  if (
    !location.city ||
    !location.coordinates ||
    location.coordinates.lat === undefined ||
    location.coordinates.lng === undefined
  ) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({
        message: "location must include city and coordinates { lat, lng }",
      });
  }

  const newPlace = await Place.create({
    name,
    category,
    subcategory,
    location,
    description,
    images: Array.isArray(images) ? images : [],
  });

  return res
    .status(201)
    .json({ message: "Place added successfully", place: newPlace });
};
export default addPlace;
