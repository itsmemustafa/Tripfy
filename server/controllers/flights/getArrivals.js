import { StatusCodes } from "http-status-codes";
import logger from "../../utils/logger.js";

// Simple in-memory cache
const cache = {
  data: null,
  timestamp: null,
  ttl: 5 * 60 * 1000, // 5 minutes in milliseconds
};

const getArrivals = async (req, res) => {
  try {
    const { airportCode } = req.params;

    // Check cache first
    const now = Date.now();
    if (cache.data && cache.timestamp && now - cache.timestamp < cache.ttl) {
      let cachedData = cache.data;

      // Filter by airport if specified
      if (airportCode) {
        cachedData = cachedData.filter(
          (flight) => flight.arrival?.iata === airportCode.toUpperCase()
        );
      }

      return res.status(StatusCodes.OK).json({
        success: true,
        flights: cachedData,
        cached: true,
      });
    }

    // If no API key, return error
    if (!process.env.FLIGHT_API_KEY) {
      return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
        success: false,
        message: "Flight API key not configured",
      });
    }

    // Kurdistan airports
    const kurdistanAirports = ["EBL", "ISU"]; // Erbil, Sulaymaniyah

    // Fetch arrivals for all Kurdistan airports
    const allFlights = [];

    for (const airport of kurdistanAirports) {
      try {
        const response = await fetch(
          `http://api.aviationstack.com/v1/flights?access_key=${process.env.FLIGHT_API_KEY}&arr_iata=${airport}&flight_status=active,landed&limit=100`
        );

        if (!response.ok) {
          logger.warn("Flight API error", { airport, status: response.status });
          continue;
        }

        const data = await response.json();

        if (data.data && Array.isArray(data.data)) {
          // Filter only arrivals (not departures)
          const arrivals = data.data.filter(
            (flight) => flight.arrival?.iata === airport
          );
          allFlights.push(...arrivals);
        }
      } catch (err) {
        logger.error("Error fetching flights for airport", { airport, message: err.message });
        // Continue with other airports
      }
    }

    // Sort by scheduled arrival time
    allFlights.sort((a, b) => {
      const timeA = new Date(a.arrival?.scheduled || 0);
      const timeB = new Date(b.arrival?.scheduled || 0);
      return timeA - timeB;
    });

    // Update cache
    cache.data = allFlights;
    cache.timestamp = now;

    // Filter by airport if specified
    let filteredFlights = allFlights;
    if (airportCode) {
      filteredFlights = allFlights.filter(
        (flight) => flight.arrival?.iata === airportCode.toUpperCase()
      );
    }

    res.status(StatusCodes.OK).json({
      success: true,
      flights: filteredFlights,
      cached: false,
    });
  } catch (error) {
    logger.error("Error fetching flight arrivals", { message: error.message });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch flight arrivals",
      error: error.message,
    });
  }
};

export default getArrivals;
