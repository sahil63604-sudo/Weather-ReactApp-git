// weatherUtils.js
// Small, dependency-free helpers for turning raw Open-Meteo values into
// display-ready data (icons, labels, colors, gradients, formatted numbers).

import {
  WiDaySunny,
  WiNightClear,
  WiDayCloudyHigh,
  WiCloud,
  WiCloudy,
  WiFog,
  WiRain,
  WiShowers,
  WiThunderstorm,
  WiSnow,
  WiSleet,
} from "react-icons/wi";

/**
 * Open-Meteo "weather_code" follows the WMO code table. We collapse the
 * ~30 possible codes into a handful of conditions that drive both the
 * icon we show and the background theme of the app.
 *
 * Reference: https://open-meteo.com/en/docs (WMO Weather interpretation codes)
 */
export function getWeatherCondition(code, isDay = true) {
  const day = isDay !== 0 && isDay !== false;

  if (code === 0) {
    return day
      ? { key: "clear-day", label: "Clear sky", Icon: WiDaySunny }
      : { key: "clear-night", label: "Clear sky", Icon: WiNightClear };
  }
  if (code === 1 || code === 2) {
    return { key: "partly-cloudy", label: "Partly cloudy", Icon: WiDayCloudyHigh };
  }
  if (code === 3) {
    return { key: "cloudy", label: "Overcast", Icon: WiCloudy };
  }
  if (code === 45 || code === 48) {
    return { key: "fog", label: "Foggy", Icon: WiFog };
  }
  if ([51, 53, 55, 56, 57].includes(code)) {
    return { key: "drizzle", label: "Drizzle", Icon: WiShowers };
  }
  if ([61, 63, 65, 66, 67].includes(code)) {
    return { key: "rain", label: "Rain", Icon: WiRain };
  }
  if ([71, 73, 75, 77].includes(code)) {
    return { key: "snow", label: "Snow", Icon: WiSnow };
  }
  if ([80, 81, 82].includes(code)) {
    return { key: "rain-showers", label: "Rain showers", Icon: WiShowers };
  }
  if ([85, 86].includes(code)) {
    return { key: "snow-showers", label: "Snow showers", Icon: WiSleet };
  }
  if ([95, 96, 99].includes(code)) {
    return { key: "storm", label: "Thunderstorm", Icon: WiThunderstorm };
  }
  return { key: "cloudy", label: "Overcast", Icon: WiCloud };
}

/**
 * Background theme tokens per condition. Each returns Tailwind gradient
 * classes plus an accent color used for small highlights (progress bars,
 * active icons, etc). Keeping this as one lookup table means adding a new
 * theme later is a one-line change.
 */
export const WEATHER_THEMES = {
  "clear-day": {
    gradient: "from-sky-500 via-sky-400 to-amber-200",
    accent: "text-amber-300",
    ring: "ring-amber-300/40",
  },
  "clear-night": {
    gradient: "from-indigo-950 via-indigo-900 to-slate-800",
    accent: "text-indigo-200",
    ring: "ring-indigo-300/30",
  },
  "partly-cloudy": {
    gradient: "from-sky-600 via-slate-500 to-slate-300",
    accent: "text-sky-200",
    ring: "ring-sky-300/30",
  },
  cloudy: {
    gradient: "from-slate-700 via-slate-600 to-slate-400",
    accent: "text-slate-200",
    ring: "ring-slate-300/30",
  },
  fog: {
    gradient: "from-slate-500 via-slate-400 to-slate-300",
    accent: "text-slate-100",
    ring: "ring-slate-200/30",
  },
  drizzle: {
    gradient: "from-slate-700 via-cyan-800 to-cyan-600",
    accent: "text-cyan-200",
    ring: "ring-cyan-300/30",
  },
  rain: {
    gradient: "from-slate-800 via-cyan-900 to-cyan-700",
    accent: "text-cyan-300",
    ring: "ring-cyan-300/40",
  },
  "rain-showers": {
    gradient: "from-slate-800 via-cyan-900 to-cyan-700",
    accent: "text-cyan-300",
    ring: "ring-cyan-300/40",
  },
  snow: {
    gradient: "from-slate-500 via-slate-300 to-white",
    accent: "text-slate-700",
    ring: "ring-white/50",
  },
  "snow-showers": {
    gradient: "from-slate-500 via-slate-300 to-white",
    accent: "text-slate-700",
    ring: "ring-white/50",
  },
  storm: {
    gradient: "from-slate-900 via-violet-950 to-slate-700",
    accent: "text-violet-300",
    ring: "ring-violet-300/40",
  },
};

/** AQI (US EPA scale) label, color, and 0-100 fill % for a progress bar. */
export function getAQIInfo(aqi) {
  if (aqi == null) return null;
  if (aqi <= 50)
    return { label: "Good", color: "text-emerald-400", bar: "bg-emerald-400", fill: (aqi / 50) * 20 };
  if (aqi <= 100)
    return { label: "Moderate", color: "text-yellow-400", bar: "bg-yellow-400", fill: 20 + ((aqi - 50) / 50) * 20 };
  if (aqi <= 150)
    return { label: "Unhealthy (sensitive)", color: "text-orange-400", bar: "bg-orange-400", fill: 40 + ((aqi - 100) / 50) * 20 };
  if (aqi <= 200)
    return { label: "Unhealthy", color: "text-red-400", bar: "bg-red-400", fill: 60 + ((aqi - 150) / 50) * 20 };
  if (aqi <= 300)
    return { label: "Very Unhealthy", color: "text-purple-400", bar: "bg-purple-400", fill: 80 + ((aqi - 200) / 100) * 20 };
  return { label: "Hazardous", color: "text-rose-600", bar: "bg-rose-600", fill: 100 };
}

/** Compass label for a wind direction in degrees. */
export function getWindDirectionLabel(deg) {
  if (deg == null) return null;
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return directions[Math.round(deg / 22.5) % 16];
}

/** Format an ISO time string as a short local time, e.g. "6:42 AM". */
export function formatTime(iso, timezone) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: timezone,
    });
  } catch {
    return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }
}

/** Format an ISO date as "Mon, 12 Aug". */
export function formatDay(iso, index) {
  const date = new Date(iso);
  if (index === 0) return "Today";
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { day: "2-digit", month: "short" });
}

/** Celsius <-> Fahrenheit conversions, rounded to whole degrees for display. */
export function convertTemp(celsius, unit) {
  if (celsius == null) return null;
  if (unit === "F") return Math.round((celsius * 9) / 5 + 32);
  return Math.round(celsius);
}

/** km/h <-> mph */
export function convertWind(kmh, unit) {
  if (kmh == null) return null;
  if (unit === "F") return Math.round(kmh * 0.621371); // mph alongside Fahrenheit
  return Math.round(kmh);
}
