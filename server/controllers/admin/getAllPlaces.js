import Place from "../../models/place.js";
import { StatusCodes } from "http-status-codes";

const getAllPlaces = async (req, res) => {
    try {
        const places = await Place.find({});

        res.status(StatusCodes.OK).json({
            success: true,
            count: places.length,
            places
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            msg: "Error fetching places"
        });
    }
};

export default getAllPlaces;
