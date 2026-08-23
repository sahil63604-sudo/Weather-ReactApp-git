import React from "react";
import { WiRain } from "react-icons/wi";
import { getWeatherCondition, convertTemp, formatDay, formatDate } from "../utils/weatherUtils";

export default function ForecastSection({ daily, unit }) {
  // Skip index 0 (today, already shown in the hero card) and show the next 5 days.
  const days = daily.time.slice(1, 6);

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <WiRain className="text-3xl text-cyan-300" />
        <h3 className="text-xl font-bold text-white">5-Day Forecast</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {days.map((day, i) => {
          const index = i + 1; // offset back into the original daily arrays
          const condition = getWeatherCondition(daily.weather_code[index], true);
          const Icon = condition.Icon;
          const rainChance = daily.precipitation_probability_max?.[index];

          return (
            <div
              key={day}
              tabIndex={0}
              className="bg-white/5 hover:bg-white/10 focus-visible:bg-white/10 border border-white/10 transition-all rounded-2xl p-4 text-center hover:scale-[1.04] focus-visible:scale-[1.04] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <p className="text-sm font-semibold text-white">{formatDay(day, index)}</p>
              <p className="text-xs text-white/50">{formatDate(day)}</p>

              <Icon className="text-4xl mx-auto my-2 text-cyan-200" title={condition.label} />

              <h4 className="text-xl font-bold text-white">
                {convertTemp(daily.temperature_2m_max[index], unit)}°
              </h4>
              <p className="text-xs text-white/60 mt-0.5">
                Low {convertTemp(daily.temperature_2m_min[index], unit)}°
              </p>

              {rainChance != null && (
                <p className="text-[11px] text-cyan-300 mt-1.5 font-mono">💧 {rainChance}%</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
