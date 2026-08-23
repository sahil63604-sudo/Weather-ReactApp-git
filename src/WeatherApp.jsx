import React, { useEffect, useState } from "react";
import { WiDaySunny } from "react-icons/wi";
import { FaExclamationTriangle, FaRedoAlt } from "react-icons/fa";

import SearchBar from "./components/SearchBar";
import UnitToggle from "./components/UnitToggle";
import CurrentWeatherCard from "./components/CurrentWeatherCard";
import ForecastSection from "./components/ForecastSection";
import WeatherInfoGrid from "./components/WeatherInfoGrid";
import AQICard from "./components/AQICard";
import { useWeather } from "./hooks/useWeather";

const LAST_CITY_KEY = "weather-app:last-city";
const UNIT_KEY = "weather-app:unit";

function WeatherApp() {
  const { data, loading, error, search, searchByCoords, setError } = useWeather();
  const [unit, setUnit] = useState(() => localStorage.getItem(UNIT_KEY) || "C");
  const [lastQuery, setLastQuery] = useState(null); // remembers how to refresh (city name or coords)

  // Remember the unit choice across visits.
  useEffect(() => {
    localStorage.setItem(UNIT_KEY, unit);
  }, [unit]);

  // On first load, restore the last searched city (if any).
  useEffect(() => {
    const savedCity = localStorage.getItem(LAST_CITY_KEY);
    if (savedCity) {
      setLastQuery({ type: "city", value: savedCity });
      search(savedCity);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearch(cityName) {
    setLastQuery({ type: "city", value: cityName });
    localStorage.setItem(LAST_CITY_KEY, cityName);
    search(cityName);
  }

  function handleUseLocation() {
    if (!navigator.geolocation) {
      setError("Your browser doesn't support location access.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLastQuery({ type: "coords", value: [latitude, longitude] });
        searchByCoords(latitude, longitude);
      },
      () => setError("Couldn't access your location. Please allow location access or search manually."),
      { timeout: 10000 }
    );
  }

  function handleRefresh() {
    if (!lastQuery) return;
    if (lastQuery.type === "city") search(lastQuery.value);
    else searchByCoords(lastQuery.value[0], lastQuery.value[1]);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex justify-center items-start sm:items-center p-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <WiDaySunny className="text-7xl text-amber-300 drop-shadow-lg" />
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-1 tracking-tight text-white">Weather</h1>
          <p className="text-slate-400 mt-1 text-sm">Real-time forecasts, wherever you are</p>
        </div>

        {/* Search + unit toggle */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[28px] p-4 sm:p-5 shadow-xl">
          <SearchBar onSearch={handleSearch} onUseLocation={handleUseLocation} loading={loading} />

          <div className="flex items-center justify-between mt-3 px-1">
            <UnitToggle unit={unit} onChange={setUnit} />
            {data && !loading && (
              <button
                onClick={handleRefresh}
                aria-label="Refresh weather"
                className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-full px-2 py-1"
              >
                <FaRedoAlt className="text-xs" /> Refresh
              </button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mt-4 flex items-center gap-3 bg-red-500/15 border border-red-500/30 text-red-200 py-3 px-4 rounded-2xl"
          >
            <FaExclamationTriangle className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center gap-3 mt-10">
            <div
              className="h-9 w-9 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin"
              role="status"
              aria-label="Loading weather"
            />
            <span className="text-slate-300 text-lg">Loading weather...</span>
          </div>
        )}

        {/* Empty state before the first search */}
        {!data && !loading && !error && (
          <div className="mt-10 text-center text-slate-400">
            <p className="text-lg">Search for a city, or use your location, to see the forecast.</p>
          </div>
        )}

        {/* Weather data */}
        {data && !loading && (
          <div className="mt-6 space-y-4">
            <CurrentWeatherCard data={data} unit={unit} />
            <ForecastSection daily={data.daily} unit={unit} />
            <WeatherInfoGrid
              current={data.current}
              daily={data.daily}
              visibility={data.visibility}
              timezone={data.timezone}
              unit={unit}
            />
            <AQICard aqi={data.aqi} />
          </div>
        )}
      </div>
    </div>
  );
}

export default WeatherApp;
