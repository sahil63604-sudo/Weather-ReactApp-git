import React from "react";

/**
 * The app's signature visual: a full-bleed backdrop whose motion reflects
 * the *actual* current condition rather than being purely decorative.
 *   - clear: a slow-rotating sun glow / twinkling stars at night
 *   - cloudy/partly-cloudy/fog: soft drifting cloud blobs
 *   - rain/drizzle/rain-showers: falling streak lines
 *   - snow/snow-showers: gently falling dots
 *   - storm: drifting clouds plus an occasional soft flash
 *
 * Everything here is CSS-driven (no canvas, no extra deps) and kept subtle
 * so it reads as atmosphere, not noise.
 */
export default function SkyBackdrop({ conditionKey = "clear-day" }) {
  const isNight = conditionKey === "clear-night";
  const showClouds = ["partly-cloudy", "cloudy", "fog", "drizzle", "rain", "rain-showers", "storm", "snow", "snow-showers"].includes(
    conditionKey
  );
  const showRain = ["drizzle", "rain", "rain-showers", "storm"].includes(conditionKey);
  const showSnow = ["snow", "snow-showers"].includes(conditionKey);
  const showSun = conditionKey === "clear-day" || conditionKey === "partly-cloudy";
  const showStars = isNight;
  const showLightning = conditionKey === "storm";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[32px]" aria-hidden="true">
      <style>{`
        @keyframes sky-drift-slow { from { transform: translateX(-10%); } to { transform: translateX(10%); } }
        @keyframes sky-drift-slower { from { transform: translateX(8%); } to { transform: translateX(-8%); } }
        @keyframes sky-fall { from { transform: translateY(-10%); opacity: 0.9; } to { transform: translateY(120%); opacity: 0.4; } }
        @keyframes sky-fall-snow { from { transform: translateY(-10%) translateX(0); } to { transform: translateY(120%) translateX(12px); } }
        @keyframes sky-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes sky-twinkle { 0%, 100% { opacity: 0.25; } 50% { opacity: 0.9; } }
        @keyframes sky-flash { 0%, 92%, 100% { opacity: 0; } 94% { opacity: 0.5; } 96% { opacity: 0; } 97% { opacity: 0.3; } }
        @media (prefers-reduced-motion: reduce) {
          .sky-anim { animation: none !important; }
        }
      `}</style>

      {showSun && (
        <div
          className="sky-anim absolute -top-16 -right-16 h-64 w-64 rounded-full bg-amber-200/30 blur-3xl"
          style={{ animation: "sky-spin 40s linear infinite" }}
        />
      )}

      {showStars &&
        Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="sky-anim absolute rounded-full bg-white"
            style={{
              width: 2 + (i % 3),
              height: 2 + (i % 3),
              top: `${(i * 37) % 90}%`,
              left: `${(i * 53) % 95}%`,
              animation: `sky-twinkle ${3 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}

      {showClouds && (
        <>
          <div
            className="sky-anim absolute top-8 left-[-20%] h-24 w-[70%] rounded-full bg-white/10 blur-2xl"
            style={{ animation: "sky-drift-slow 28s ease-in-out infinite alternate" }}
          />
          <div
            className="sky-anim absolute top-24 left-[-10%] h-28 w-[60%] rounded-full bg-white/10 blur-2xl"
            style={{ animation: "sky-drift-slower 34s ease-in-out infinite alternate" }}
          />
        </>
      )}

      {showRain &&
        Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="sky-anim absolute w-px h-8 bg-white/40"
            style={{
              left: `${(i * 13) % 100}%`,
              top: `${(i * 7) % 100}%`,
              animation: `sky-fall ${0.6 + (i % 5) * 0.15}s linear infinite`,
              animationDelay: `${(i % 10) * 0.1}s`,
            }}
          />
        ))}

      {showSnow &&
        Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="sky-anim absolute rounded-full bg-white/70"
            style={{
              width: 3 + (i % 3),
              height: 3 + (i % 3),
              left: `${(i * 17) % 100}%`,
              top: `${(i * 11) % 100}%`,
              animation: `sky-fall-snow ${4 + (i % 5)}s linear infinite`,
              animationDelay: `${(i % 8) * 0.3}s`,
            }}
          />
        ))}

      {showLightning && (
        <div
          className="sky-anim absolute inset-0 bg-white"
          style={{ animation: "sky-flash 6s ease-in-out infinite" }}
        />
      )}
    </div>
  );
}
