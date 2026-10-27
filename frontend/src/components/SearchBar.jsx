import { Search, X } from "lucide-react";

export default function SearchBar({ value, onChange, onClear, placeholder = "Search recipes by name..." }) {
  return (
    <div className="search-bar-wrapper">
      <div className="search-input-box">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          className="search-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label="Search recipes"
        />
        {value && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={onClear}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
