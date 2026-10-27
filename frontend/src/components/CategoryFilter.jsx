const CATEGORIES = [
  "All",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snack",
  "Dessert",
  "Other",
];

export default function CategoryFilter({ selectedCategory, onSelectCategory }) {
  return (
    <div className="category-filter-wrapper" role="radiogroup" aria-label="Filter by category">
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat;
        return (
          <button
            key={cat}
            type="button"
            role="radio"
            aria-checked={isSelected}
            className={`category-pill ${isSelected ? "active" : ""}`}
            onClick={() => onSelectCategory(cat)}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
