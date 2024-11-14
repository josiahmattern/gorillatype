"use client";
import { useState, useEffect, useRef } from "react";
import { themeChange } from "theme-change";

const ThemeSwitcher = () => {
  const themes = [
    "cmyk",
    "darkcmyk",
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    // Add all your theme names here
  ];
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "cmyk");
  const [search, setSearch] = useState("");
  const [filteredThemes, setFilteredThemes] = useState(themes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const searchInputRef = useRef(null);

  useEffect(() => {
    // Initialize theme change
    themeChange(false);

    // Set theme on load
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    // Filter themes based on the search input
    const filtered = themes.filter((t) =>
      t.toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredThemes(filtered);
    setHighlightedIndex(0); // Reset highlight on new search
  }, [search]);

  const handleThemeSelect = (selectedTheme) => {
    setTheme(selectedTheme);
    localStorage.setItem("theme", selectedTheme);
    document.documentElement.setAttribute("data-theme", selectedTheme);
    setIsModalOpen(false); // Close modal after selecting
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex + 1 < filteredThemes.length ? prevIndex + 1 : 0,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex - 1 >= 0 ? prevIndex - 1 : filteredThemes.length - 1,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredThemes[highlightedIndex]) {
        handleThemeSelect(filteredThemes[highlightedIndex]);
      }

      setSearch("");
      setFilteredThemes("");
    } else if (e.key === "Escape") {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    if (isModalOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isModalOpen]);

  return (
    <div>
      <button
        className="btn btn-primary btn-sm"
        onClick={() => setIsModalOpen(true)}
      >
        Change Theme
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-base-100 p-6 rounded-lg shadow-lg max-w-md w-full">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search themes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="input input-bordered w-full mb-4"
            />

            <div className="max-h-60 overflow-y-auto">
              {filteredThemes.length > 0 ? (
                filteredThemes.map((t, index) => (
                  <div
                    key={t}
                    onClick={() => handleThemeSelect(t)}
                    className={`px-4 py-2 cursor-pointer rounded ${
                      index === highlightedIndex
                        ? "bg-primary text-primary-content"
                        : ""
                    }`}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    {t}
                  </div>
                ))
              ) : (
                <p className="px-4 py-2">No themes found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
