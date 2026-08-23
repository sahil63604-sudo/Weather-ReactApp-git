import React from "react";
import { WiHumidity, WiSunrise, WiSunset, WiBarometer } from "react-icons/wi";
import { FaWind, FaEye, FaSun } from "react-icons/fa";
import { convertWind, getWindDirectionLabel, formatTime } from "../utils/weatherUtils";

/** One small metric tile. Renders nothing if `value` is nullish, so we never show fake data. */
function InfoTile({ icon, label, value, sub }) {
  if (value == null) return null;
  return (
    <div className="bg-white/5 hover:bg-white/10 transition-all rounded-3xl p-5 flex items-center gap-4 border border-white/10 hover:scale-[1.01] duration-300">
      <div className="text-4xl text-white/80 shrink-0">{icon}</div>
      <div>
        <p className="text-white/60 text-sm">{label}</p>
        <h3 className="text-2xl font-bold text-white mt-0.5">{value}</h3>
        {sub && <p className="text-xs text-white/50 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function WeatherInfoGrid({ current, daily, visibility, timezone, unit }) {
  const windDir = getWindDirectionLabel(current.wind_direction_10m);
  const windSpeed = convertWind(current.wind_speed_10m, unit);
  const windUnitLabel = unit === "F" ? "mph" : "km/h";

  return (
    <div className="grid sm:grid-cols-2 gap-4 mt-4">
      <InfoTile icon={<WiHumidity />} label="Humidity" value={current.relative_humidity_2m != null ? `${current.relative_humidity_2m}%` : null} />

      <InfoTile
        icon={<FaWind />}
        label="Wind Speed"
        value={windSpeed != null ? `${windSpeed} ${windUnitLabel}` : null}
        sub={windDir ? `From the ${windDir}` : null}
      />

      <InfoTile
        icon={<WiBarometer />}
        label="Pressure"
        value={current.pressure_msl != null ? `${Math.round(current.pressure_msl)} hPa` : null}
      />

      <InfoTile
        icon={<FaEye />}
        label="Visibility"
        value={visibility != null ? `${(visibility / 1000).toFixed(1)} km` : null}
      />

      <InfoTile
        icon={<FaSun />}
        label="UV Index"
        value={daily?.uv_index_max?.[0] != null ? daily.uv_index_max[0].toFixed(1) : null}
      />

      <InfoTile
        icon={<WiSunrise />}
        label="Sunrise"
        value={daily?.sunrise?.[0] ? formatTime(daily.sunrise[0], timezone) : null}
      />

      <InfoTile
        icon={<WiSunset />}
        label="Sunset"
        value={daily?.sunset?.[0] ? formatTime(daily.sunset[0], timezone) : null}
      />
    </div>
  );
}
