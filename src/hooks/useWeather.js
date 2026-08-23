import { useCallback, useRef, useState } from "react";

/**
 * Encapsulates every network call the app needs:
 *   1. Geocode a city name (or raw lat/lon) via Nominatim
 *   2. Fetch current + daily weather and air quality in parallel
 *
 * Why a hook: the component tree just calls `search(cityName)` or
 * `searchByCoords(lat, lon)` and reads back `{ data, loading, error }`.
 * All the fetch plumbing, and the trickier "don't let an old slow
 * request overwrite a newer one" logic, lives in one place.
 */
export function useWeather() {
  const [data, setData] = useState(null); // { place, current, daily, air, unit-independent celsius/kmh }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Tracks the most recent request so a slower, older request can't
  // clobber the result of a newer one (classic race condition when a
  // user searches twice quickly).
  const requestIdRef = useRef(0);

  const fetchWeatherForCoords = useCallback(async (lat, lon, place, requestId) => {
    const params = new URLSearchParams({
      latitude: lat,
      longitude: lon,
      current: [
        "temperature_2m",
        "relative_humidity_2m",
        "apparent_temperature",
        "is_day",
        "precipitation",
        "weather_code",
        "pressure_msl",
        "wind_speed_10m",
        "wind_direction_10m",
        "wind_gusts_10m",
      ].join(","),
      daily: [
        "weather_code",
        "temperature_2m_max",
        "temperature_2m_min",
        "sunrise",
        "sunset",
        "uv_index_max",
        "precipitation_probability_max",
      ].join(","),
      hourly: "visibility",
      timezone: "auto",
    });

    const aqiParams = new URLSearchParams({
      latitude: lat,
      longitude: lon,
      current: "us_aqi",
    });

    const [weatherRes, airRes] = await Promise.all([
      fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`),
      fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${aqiParams.toString()}`),
    ]);

    if (!weatherRes.ok) throw new Error("Weather service unavailable. Please try again.");
    if (!airRes.ok) throw new Error("Air quality service unavailable. Please try again.");

    const [weather, air] = await Promise.all([weatherRes.json(), airRes.json()]);

    // Bail out silently if a newer search has started since this one began.
    if (requestId !== requestIdRef.current) return;

    // "visibility" comes back hourly; find the entry matching the current hour.
    let visibility = null;
    if (weather.hourly?.time && weather.hourly?.visibility) {
      const nowIndex = weather.hourly.time.findIndex((t) => t === weather.current.time.slice(0, 13) + ":00");
      visibility = nowIndex >= 0 ? weather.hourly.visibility[nowIndex] : weather.hourly.visibility[0];
    }

    setData({
      place,
      current: weather.current,
      daily: weather.daily,
      visibility,
      timezone: weather.timezone,
      aqi: air.current?.us_aqi ?? null,
    });
  }, []);

  const runSearch = useCallback(
    async (resolvePlace) => {
      const requestId = ++requestIdRef.current;
      setLoading(true);
      setError("");
      try {
        const { lat, lon, place } = await resolvePlace();
        await fetchWeatherForCoords(lat, lon, place, requestId);
      } catch (err) {
        if (requestId !== requestIdRef.current) return; // stale request, ignore
        setError(err.message || "Something went wrong. Please try again.");
      } finally {
        if (requestId === requestIdRef.current) setLoading(false);
      }
    },
    [fetchWeatherForCoords]
  );

  /** Search by free-text city name (uses OpenStreetMap Nominatim for geocoding). */
  const search = useCallback(
    (cityName) => {
      if (!cityName || !cityName.trim()) {
        setError("Please enter a city name");
        return;
      }
      return runSearch(async () => {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=jsonv2&limit=1`
        );
        if (!res.ok) throw new Error("Location service unavailable. Please try again.");
        const results = await res.json();
        if (!results.length) throw new Error(`Couldn't find "${cityName}". Check the spelling and try again.`);
        return { lat: results[0].lat, lon: results[0].lon, place: results[0] };
      });
    },
    [runSearch]
  );

  /** Search using raw coordinates (browser geolocation), reverse-geocoding for a display name. */
  const searchByCoords = useCallback(
    (lat, lon) => {
      return runSearch(async () => {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=jsonv2`
        );
        const place = res.ok ? await res.json() : { display_name: "Your location" };
        return { lat, lon, place };
      });
    },
    [runSearch]
  );

  return { data, loading, error, search, searchByCoords, setError };
}
