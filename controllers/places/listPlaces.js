import Place from "../../models/place.js";
import { StatusCodes } from "http-status-codes";

const getPlaces = async (req, res) => {
  // Extract query parameters
  const {
    category,
    subcategory,
    location,
    city,
    search,
    minRating,
    maxRating,
    tags,
    sort = "-createdAt",
    page = 1,
    limit = 10,
    fields,
  } = req.query;

  // Build filter object
  const filter = {};

  if (category) filter.category = category;
  if (subcategory) filter.subcategory = subcategory;

  // support `city` (used elsewhere) and `location` query names
  const cityQuery = city || location;
  if (cityQuery) {
    filter["location.city"] = { $regex: cityQuery, $options: "i" };
  }

  if (minRating || maxRating) {
    filter.rating = {};
    if (minRating) filter.rating.$gte = Number(minRating);
    if (maxRating) filter.rating.$lte = Number(maxRating);
  }

  // Note: model doesn't include `tags` field — ignore unknown tag queries

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Build query
  let query = Place.find(filter);

  // Sorting
  const sortBy = sort.split(",").join(" ");
  query = query.sort(sortBy);

  // Field selection
  if (fields) {
    const selectedFields = fields.split(",").join(" ");
    query = query.select(selectedFields);
  }

  // Pagination
  const skip = (Number(page) - 1) * Number(limit);
  query = query.skip(skip).limit(Number(limit));

  // Execute
  const places = await query;
  const total = await Place.countDocuments(filter);

  res.status(StatusCodes.OK).json({
    success: true,
    count: places.length,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
    places,
  });
};

export default getPlaces;
