import Place from "../models/place.js";
import logger from "../utils/logger.js";

const findPlaces = async (city, category) => {
    try {
        logger.info("Finding places", { city, category });
        const query = {};

        if (city) {
            // Case-insensitive city match
            query["location.city"] = { $regex: new RegExp(`^${city}$`, 'i') };
        }

        if (category && category.length > 0) {
            query.category = { $in: category };
        }

        const places = await Place.find(query).select('_id name category subcategory location.city description images rating');
        logger.info("Places found", { count: places.length });
        return places;
    } catch (error) {
        logger.error("findPlaces Error", { message: error.message });
        return [];
    }
}

export default findPlaces;
