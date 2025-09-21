"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getWeather = async () => {
    if (!city.trim()) return;
    setLoading(true);
    setError("");
    setWeather(null);

    try {
      // <- Make sure your Laravel backend is running at this address
      const res = await fetch(`http://127.0.0.1:8000/api/weather/${encodeURIComponent(city)}`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "City not found");
      }
      const data = await res.json();
      setWeather(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-center">
      <motion.div
        className="w-full max-w-2xl card p-6 md:p-8"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45 }}
      >
        <div className="mb-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">🌦 Weather App</h1>
          <p className="text-sm text-white/80 mt-1">Search any city — powered by  Laravel backend</p>
        </div>

        {/* Search bar: input + button combined (rounded) */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center bg-white rounded-full shadow-lg overflow-hidden w-1">
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && getWeather()}
              placeholder="Enter city (e.g., Delhi)"
              className="flex-1  px-4 py-3 text-gray-700 text-base focus:outline-none"
            />
            <button
              onClick={getWeather}
              className="bg-blue-100 text-white px-6 py-3 font-medium hover:bg-blue-100 transition-colors"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.6)" strokeWidth="4" />
                    <path d="M22 12a10 10 0 00-10-10" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                  Searching...
                </span>
              ) : (
                <span>Search</span>
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && <p className="mt-4 text-sm text-red-300">{error}</p>}

        {/* Weather card */}
        {weather && weather.main && (
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.12, duration: 0.45 }}
            className="mt-6 rounded-2xl bg-white/10 p-6 backdrop-blur-md"
          >
            <div className="flex items-center justify-center">
              <div>
                <h2 className="text-2xl font-bold ">{weather.name}{weather.sys?.country ? `, ${weather.sys.country}` : ""}</h2>
                <p className="text-sm text-white/80 capitalize ">{weather.weather?.[0]?.description}</p>
              </div>

              {/* icon from openweathermap (optional) */}
              {weather.weather?.[0]?.icon && (
                <img
                  src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt="icon"
                  className="w-20 h-20"
                />
              )}
            </div>

         
             
              <div className="flex justify-center mt-8">
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 w-full max-w-md text-center">
      <h2 className="text-2xl font-semibold mb-4">{weather.name}</h2>
      <p className="text-lg">🌡 Temp: {weather.main.temp}°C</p>
      <p className="text-lg">💧 Humidity: {weather.main.humidity}%</p>
      <p className="text-lg">🌬 Wind: {weather.wind.speed} m/s</p>
    </div>

            </div>
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}
