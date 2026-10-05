"use client";

import { useEffect, useState } from "react";
import { getWeather } from "../services/weatherApi";

export default function WeatherCard({ city }: any) {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");

  async function fetchWeather() {
    try {
      setLoading(true);
      setError(false);

      const data = await getWeather(
        city.latitude,
        city.longitude
      );

      setWeather(data);

      setLastUpdated(
        new Date().toLocaleTimeString()
      );
    } catch {
      setError(true);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <div className="rounded-xl bg-white/10 p-6">
      <h2 className="text-2xl font-bold mb-5">
        {city.name}
      </h2>

      {loading && <p>Loading...</p>}

      {error && (
        <p className="text-red-400">
          Failed to load weather
        </p>
      )}

      {!loading && !error && weather && (
        <div>
          <div className="text-center mb-5">
            <p className="text-6xl">
              {weather.weather_code === 0
                ? "☀️"
                : weather.weather_code <= 3
                ? "⛅"
                : weather.weather_code <= 67
                ? "🌧️"
                : weather.weather_code <= 77
                ? "❄️"
                : "⛈️"}
            </p>

            <p className="mt-2">
              {weather.weather_code === 0
                ? "Clear"
                : weather.weather_code <= 3
                ? "Cloudy"
                : weather.weather_code <= 67
                ? "Rainy"
                : weather.weather_code <= 77
                ? "Snowy"
                : "Stormy"}
            </p>
          </div>

          <p>
            Temperature:{" "}
            <b>{weather.temperature_2m}°C</b>
          </p>

          <p className="mt-2">
            Wind Speed:{" "}
            <b>{weather.wind_speed_10m} km/h</b>
          </p>

          <p className="mt-3 text-sm text-gray-400">
            Last updated: {lastUpdated}
          </p>
        </div>
      )}

      <button
        onClick={fetchWeather}
        className="mt-6 w-full rounded-lg bg-white py-2 text-black"
      >
        Refresh Weather
      </button>
    </div>
  );
}