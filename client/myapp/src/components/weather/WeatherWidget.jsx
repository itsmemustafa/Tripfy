import React, { useState, useEffect } from "react";
import { getWeatherByPlaceId } from "../../api/weather";
import "./WeatherWidget.css";

//  Temperature conversion 
const toF = (c) => Math.round((c * 9) / 5 + 32);

//  Day name formatter 
const getDayName = (dateStr, index) => {
  if (index === 0) return "Today";
  const date = new Date(dateStr + "T00:00:00"); // avoid timezone shift
  return date.toLocaleDateString("en-US", { weekday: "short" });
};

//  Skeleton loader 
const WeatherSkeleton = () => (
  <div className="weather-widget weather-widget--loading">
    <div className="weather-widget__skeleton-header">
      <div>
        <div className="skeleton-block skeleton-block--title" />
        <div className="skeleton-block skeleton-block--sub" />
      </div>
      <div className="skeleton-block skeleton-block--toggle" />
    </div>
    <div className="weather-widget__skeleton-row">
      {[...Array(7)].map((_, i) => (
        <div key={i} className="skeleton-day" />
      ))}
    </div>
  </div>
);

//  Main component 
const WeatherWidget = ({ placeId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("C"); // "C" | "F"

  useEffect(() => {
    if (!placeId) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    getWeatherByPlaceId(placeId)
      .then((res) => {
        if (!cancelled) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Unable to load weather data.");
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [placeId]);

  if (loading) return <WeatherSkeleton />;

  if (error) {
    return (
      <div className="weather-widget weather-widget--error">
        <div className="weather-widget__header">
          <div className="weather-widget__title-block">
            <h3 className="heading-3">7-Day Forecast</h3>
          </div>
        </div>
        <div className="weather-widget__error">
          <span className="weather-widget__error-emoji">🌩️</span>
          <p className="weather-widget__error-text">{error}</p>
        </div>
      </div>
    );
  }

  if (!data?.forecast?.length) return null;

  const displayTemp = (celsius) =>
    unit === "C" ? `${celsius}°` : `${toF(celsius)}°`;

  return (
    <div className="weather-widget">
      {/* Header */}
      <div className="weather-widget__header">
        <div className="weather-widget__title-block">
          <h3 className="heading-3">7-Day Forecast</h3>
          <span className="weather-widget__city">{data.city}</span>
        </div>

        {/* Unit toggle */}
        <div className="weather-widget__unit-toggle">
          <button
            id="weather-unit-celsius"
            className={`weather-widget__unit-btn ${unit === "C" ? "is-active" : ""}`}
            onClick={() => setUnit("C")}
            aria-label="Switch to Celsius"
          >
            °C
          </button>
          <button
            id="weather-unit-fahrenheit"
            className={`weather-widget__unit-btn ${unit === "F" ? "is-active" : ""}`}
            onClick={() => setUnit("F")}
            aria-label="Switch to Fahrenheit"
          >
            °F
          </button>
        </div>
      </div>

      {/* Forecast cards */}
      <div className="weather-widget__forecast">
        {data.forecast.map((day, index) => (
          <div
            key={day.date}
            className={`weather-day ${index === 0 ? "is-today" : ""}`}
            title={`${day.label} — High: ${displayTemp(day.maxTemp)}, Low: ${displayTemp(day.minTemp)}`}
          >
            <span className="weather-day__name">{getDayName(day.date, index)}</span>
            <span className="weather-day__emoji">{day.emoji}</span>
            <span className="weather-day__max">{displayTemp(day.maxTemp)}</span>
            <span className="weather-day__min">{displayTemp(day.minTemp)}</span>
            {day.precipitationProbability > 0 && (
              <span className="weather-day__rain">
                <span className="weather-day__rain-icon">💧</span>
                {day.precipitationProbability}%
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Attribution */}
      <div className="weather-widget__footer">
        <span className="weather-widget__attribution">
          Powered by Open-Meteo
        </span>
      </div>
    </div>
  );
};

export default WeatherWidget;
