import React from "react";
import { WEATHER_THEMES, getWeatherCondition, convertTemp, formatTime } from "../utils/weatherUtils";
import SkyBackdrop from "./SkyBackdrop";

export default function CurrentWeatherCard({ data, unit }) {
  const { place, current, timezone } = data;
  const condition = getWeatherCondition(current.weather_code, current.is_day);
  const theme = WEATHER_THEMES[condition.key];
  const Icon = condition.Icon;

  const cityLine = place.display_name
    ? place.display_name.split(",")[0]
    : place.name || "Your location";
  const regionLine = place.display_name
    ? place.display_name.split(",").slice(1, 3).join(",").trim()
    : "";

  return (
    <div
      className={`relative overflow-hidden rounded-[32px] p-8 sm:p-10 text-center shadow-2xl bg-gradient-to-br ${theme.gradient} transition-colors duration-700`}
    >
      <SkyBackdrop conditionKey={condition.key} />

      <div className="relative z-10">
        <p className="text-sm font-medium tracking-wide text-white/80 font-mono">
          Updated {formatTime(current.time, timezone)}
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold mt-3 text-white drop-shadow-sm">{cityLine}</h2>
        {regionLine && <p className="text-white/70 text-sm mt-1">{regionLine}</p>}

        <Icon className="text-8xl sm:text-9xl mx-auto my-4 text-white drop-shadow-lg" />

        <div className="flex items-start justify-center">
          <span className="text-7xl sm:text-8xl font-extrabold text-white leading-none tracking-tight" style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>
            {convertTemp(current.temperature_2m, unit)}
          </span>
          <span className="text-3xl sm:text-4xl font-bold text-white/90 mt-1">°{unit}</span>
        </div>

        <p className="text-white/90 text-lg mt-2 font-medium">{condition.label}</p>
        <p className="text-white/70 text-sm mt-1">
          Feels like {convertTemp(current.apparent_temperature, unit)}°{unit}
        </p>
      </div>
    </div>
  );
}
