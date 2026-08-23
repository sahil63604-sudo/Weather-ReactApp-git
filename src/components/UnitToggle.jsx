import React from "react";

/** A two-way segmented toggle between Celsius and Fahrenheit. */
export default function UnitToggle({ unit, onChange }) {
  return (
    <div
      role="group"
      aria-label="Temperature unit"
      className="inline-flex rounded-full bg-white/10 border border-white/20 p-1 backdrop-blur-md"
    >
      {["C", "F"].map((u) => (
        <button
          key={u}
          type="button"
          onClick={() => onChange(u)}
          aria-pressed={unit === u}
          className={`px-3 py-1 text-sm font-semibold rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${
            unit === u ? "bg-white text-slate-900 shadow" : "text-white/70 hover:text-white"
          }`}
        >
          °{u}
        </button>
      ))}
    </div>
  );
}
