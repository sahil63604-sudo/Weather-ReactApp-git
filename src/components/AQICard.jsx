import React from "react";
import { FaGauge } from "react-icons/fa6";
import { getAQIInfo } from "../utils/weatherUtils";

export default function AQICard({ aqi }) {
  if (aqi == null) return null;
  const info = getAQIInfo(aqi);

  return (
    <div className="bg-white/5 hover:bg-white/10 transition-all rounded-3xl p-5 border border-white/10 hover:scale-[1.01] duration-300 sm:col-span-2">
      <div className="flex items-center gap-4">
        <FaGauge className={`text-4xl ${info.color}`} />
        <div className="flex-1">
          <p className="text-white/60 text-sm">Air Quality Index</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-white">{aqi}</h3>
            {/* Status is also conveyed as text, not just color, for accessibility. */}
            <span className={`text-sm font-semibold ${info.color}`}>{info.label}</span>
          </div>
        </div>
      </div>

      <div
        className="mt-3 h-2 w-full rounded-full bg-white/10 overflow-hidden"
        role="progressbar"
        aria-valuenow={aqi}
        aria-valuemin={0}
        aria-valuemax={300}
        aria-label={`Air quality index ${aqi}, ${info.label}`}
      >
        <div
          className={`h-full rounded-full ${info.bar} transition-all duration-700`}
          style={{ width: `${Math.min(info.fill, 100)}%` }}
        />
      </div>
    </div>
  );
}
