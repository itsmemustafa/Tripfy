import Place from "../../models/place.js";
import { StatusCodes } from "http-status-codes";
import logger from "../../utils/logger.js";

const getPlace = async (req, res) => {
    const id = req.params.id.trim();

    try {
        let place = await Place.findById(id);

        if (!place) {
            const allPlaces = await Place.find({});
            place = allPlaces.find(p => p._id.toString() === id);
        }

        if (!place) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Place not found" });
        }
        return res.status(StatusCodes.OK).json({ place, success: true });
    } catch (error) {
        logger.error("[getPlace] Error", { message: error.message, id });
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}

export default getPlace;