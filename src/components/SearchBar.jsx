import React, { useEffect, useRef, useState } from "react";
import { FaSearch, FaLocationArrow } from "react-icons/fa";

export default function SearchBar({
  onSearch,
  onUseLocation,
  loading,
}) {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  // Used to prevent autocomplete after selecting a suggestion
  const skipAutocompleteRef = useRef(false);

  // Used to ignore old API responses
  const requestIdRef = useRef(0);

  // --------------------------------------------------
  // Autocomplete
  // --------------------------------------------------
  useEffect(() => {
    /*
      If the value was changed because the user selected
      a suggestion, don't run autocomplete again.
    */
    if (skipAutocompleteRef.current) {
      skipAutocompleteRef.current = false;
      return;
    }

    if (value.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      const requestId = ++requestIdRef.current;

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            value
          )}&format=jsonv2&limit=5&addressdetails=1`
        );

        if (!res.ok) {
          return;
        }

        const results = await res.json();

        // Ignore old API responses
        if (requestId !== requestIdRef.current) {
          return;
        }

        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (error) {
        console.error("Autocomplete error:", error);
      }
    }, 400);

    return () => {
      clearTimeout(debounceRef.current);
    };
  }, [value]);

  // --------------------------------------------------
  // Close dropdown when clicking outside
  // --------------------------------------------------
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // --------------------------------------------------
  // Submit search
  // --------------------------------------------------
  function handleSubmit(e) {
    e.preventDefault();

    if (!value.trim() || loading) {
      return;
    }

    // Hide suggestions
    setShowSuggestions(false);
    setSuggestions([]);

    // Invalidate previous autocomplete request
    requestIdRef.current++;

    onSearch(value.trim());
  }

  // --------------------------------------------------
  // Select suggestion
  // --------------------------------------------------
  function handleSuggestionClick(suggestion) {
    const city = suggestion.display_name.split(",")[0];

    /*
      IMPORTANT:
      Tell the autocomplete useEffect that the next
      value change is caused by selecting a suggestion.
    */
    skipAutocompleteRef.current = true;

    // Invalidate any previous request
    requestIdRef.current++;

    // Hide dropdown immediately
    setShowSuggestions(false);
    setSuggestions([]);

    // Put selected city into input
    setValue(city);

    // Search the selected location
    onSearch(suggestion.display_name);
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  return (
    <div ref={containerRef} className="relative">
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 sm:gap-3"
      >
        {/* Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => {
              /*
                Normal typing should trigger autocomplete.
              */
              skipAutocompleteRef.current = false;

              setValue(e.target.value);

              if (e.target.value.trim().length < 3) {
                setSuggestions([]);
                setShowSuggestions(false);
              }
            }}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            placeholder="Search for a city..."
            aria-label="Search for a city"
            disabled={loading}
            autoComplete="off"
            className="w-full bg-white/10 border border-white/20 focus:border-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-2xl pl-4 pr-4 py-3.5 text-white placeholder:text-white/50 backdrop-blur-md transition-colors disabled:opacity-60"
          />

          {/* Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <ul
              role="listbox"
              className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-white/15 bg-slate-900/95 backdrop-blur-xl shadow-2xl"
            >
              {suggestions.map((suggestion) => (
                <li key={suggestion.place_id}>
                  <button
                    type="button"
                    onClick={() =>
                      handleSuggestionClick(suggestion)
                    }
                    className="w-full text-left px-4 py-3 text-sm text-white/90 hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-none transition-colors truncate"
                  >
                    {suggestion.display_name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Search Button */}
        <button
          type="submit"
          disabled={loading}
          aria-label="Search"
          className="shrink-0 bg-white/90 hover:bg-white text-slate-900 transition-all px-4 sm:px-5 rounded-2xl flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <FaSearch />
        </button>

        {/* Location Button */}
        <button
          type="button"
          onClick={onUseLocation}
          disabled={loading}
          aria-label="Use my current location"
          title="Use my current location"
          className="shrink-0 bg-white/10 hover:bg-white/20 border border-white/20 transition-all px-4 sm:px-5 rounded-2xl flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <FaLocationArrow />
        </button>
      </form>
    </div>
  );
}