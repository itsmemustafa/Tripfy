import Place from "../../models/place.js";
import { StatusCodes } from "http-status-codes";
import logger from "../../utils/logger.js";

//  Simple in-memory cache (placeId → { data, expiresAt }) 
const cache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes


const wmoCodeToMeta = (code) => {
  if (code === 0) return { label: "Clear sky", emoji: "☀️" };
  if (code === 1) return { label: "Mainly clear", emoji: "🌤️" };
  if (code === 2) return { label: "Partly cloudy", emoji: "⛅" };
  if (code === 3) return { label: "Overcast", emoji: "☁️" };
  if (code >= 45 && code <= 48) return { label: "Foggy", emoji: "🌫️" };
  if (code >= 51 && code <= 55) return { label: "Drizzle", emoji: "🌦️" };
  if (code >= 56 && code <= 57) return { label: "Freezing drizzle", emoji: "🌧️" };
  if (code >= 61 && code <= 65) return { label: "Rain", emoji: "🌧️" };
  if (code >= 66 && code <= 67) return { label: "Freezing rain", emoji: "🌨️" };
  if (code >= 71 && code <= 77) return { label: "Snow", emoji: "❄️" };
  if (code >= 80 && code <= 82) return { label: "Rain showers", emoji: "🌦️" };
  if (code >= 85 && code <= 86) return { label: "Snow showers", emoji: "🌨️" };
  if (code === 95) return { label: "Thunderstorm", emoji: "⛈️" };
  if (code >= 96 && code <= 99) return { label: "Thunderstorm + hail", emoji: "⛈️" };
  return { label: "Unknown", emoji: "🌡️" };
};

/**
 * GET /api/v1/weather/:placeId
 * Returns a 7-day forecast for the given place using Open-Meteo (free, no key).
 */
const getWeather = async (req, res) => {
  const { placeId } = req.params;

  //  1. Check cache 
  const cached = cache.get(placeId);
  if (cached && cached.expiresAt > Date.now()) {
    return res.status(StatusCodes.OK).json(cached.data);
  }

  //  2. Look up place 
  let place;
  try {
    place = await Place.findById(placeId.trim()).lean();
    if (!place) {
      const all = await Place.find({}).lean();
      place = all.find((p) => p._id.toString() === placeId.trim());
    }
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Database error: " + err.message });
  }

  if (!place) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "Place not found" });
  }

  const { lat, lng } = place.location?.coordinates || {};
  if (lat == null || lng == null) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Place has no coordinates" });
  }

  //  3. Call Open-Meteo 
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lng}` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode` +
    `&timezone=auto&forecast_days=7`;

  let raw;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Open-Meteo responded with ${response.status}`);
    }
    raw = await response.json();
  } catch (err) {
    logger.error("Open-Meteo fetch error", { message: err.message, placeId });
    return res
      .status(StatusCodes.BAD_GATEWAY)
      .json({ message: "Weather service unavailable. Please try again later." });
  }

  //  4. Parse into clean format 
  const { daily, timezone } = raw;
  const forecast = daily.time.map((date, i) => {
    const code = daily.weathercode[i];
    const meta = wmoCodeToMeta(code);
    return {
      date,                                                          // "2025-01-01"
      maxTemp: Math.round(daily.temperature_2m_max[i]),             // °C
      minTemp: Math.round(daily.temperature_2m_min[i]),             // °C
      precipitationProbability: daily.precipitation_probability_max[i], // %
      weatherCode: code,
      emoji: meta.emoji,
      label: meta.label,
    };
  });

  const responseData = {
    success: true,
    city: place.location.city,
    timezone,
    lat,
    lng,
    forecast,
  };

  //  5. Store in cache 
  cache.set(placeId, { data: responseData, expiresAt: Date.now() + CACHE_TTL_MS });

  return res.status(StatusCodes.OK).json(responseData);
};

export default getWeather;
