import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, BookOpen, AlertCircle, RefreshCw, XCircle } from "lucide-react";
import { getRecipes, deleteRecipe } from "../services/api";
import { useToast } from "../context/ToastContext";
import RecipeCard from "../components/RecipeCard";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";

export default function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { showToast } = useToast();

  const fetchRecipesList = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRecipes();
      setRecipes(data);
    } catch (err) {
      console.error("Failed to load recipes:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load recipes. Please ensure the backend server and MongoDB connection are running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipesList();
  }, []);

  // Filter recipes by case-insensitive name and category
  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesSearch =
        !searchQuery.trim() ||
        recipe.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || recipe.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [recipes, searchQuery, selectedCategory]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
  };

  const hasActiveFilters = searchQuery.trim() !== "" || selectedCategory !== "All";

  const handleDeleteConfirm = async () => {
    if (!recipeToDelete) return;
    setIsDeleting(true);
    try {
      await deleteRecipe(recipeToDelete._id);
      setRecipes((prev) => prev.filter((r) => r._id !== recipeToDelete._id));
      showToast(`&ldquo;${recipeToDelete.name}&rdquo; has been deleted.`);
      setRecipeToDelete(null);
    } catch (err) {
      console.error("Failed to delete recipe:", err);
      showToast(
        err.response?.data?.message || "Failed to delete recipe. Please try again.",
        "error"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-pill">
            <BookOpen size={15} />
            <span>Curated Culinary Journal</span>
          </div>
          <h1 className="hero-title">Your personal recipe collection.</h1>
          <p className="hero-subtitle">
            Organize, cook, and treasure your favorite recipes in one refined space.
          </p>
          <div className="hero-actions">
            <Link to="/recipes/add" className="btn btn-primary btn-lg">
              <Plus size={18} strokeWidth={2.5} />
              <span>Add New Recipe</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Control Panel: Search & Categories */}
      <section className="controls-section" aria-label="Recipe filters">
        <div className="controls-container">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery("")}
            placeholder="Search recipes by name..."
          />
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {hasActiveFilters && (
            <div className="active-filters-bar">
              <span className="results-count">
                Showing {filteredRecipes.length} of {recipes.length} recipe
                {recipes.length === 1 ? "" : "s"}
              </span>
              <button
                type="button"
                className="btn-clear-filters"
                onClick={handleClearFilters}
              >
                <XCircle size={15} />
                <span>Clear filters</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <main className="recipes-content" id="recipe-list">
        {loading ? (
          <LoadingState message="Fetching recipes from your cookbook..." />
        ) : error ? (
          <div className="error-card" role="alert">
            <div className="error-icon-box">
              <AlertCircle size={28} />
            </div>
            <h3 className="error-title">Could not load recipes</h3>
            <p className="error-message">{error}</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={fetchRecipesList}
            >
              <RefreshCw size={16} />
              <span>Retry</span>
            </button>
          </div>
        ) : recipes.length === 0 ? (
          <EmptyState
            title="Your cookbook is empty"
            description="Start curating your personal collection by creating your very first recipe."
            actionLabel="Add Your First Recipe"
            onAction={() => window.location.assign("/recipes/add")}
          />
        ) : filteredRecipes.length === 0 ? (
          <EmptyState
            title="No matching recipes found"
            description="No recipes match your current search or category filter. Try clearing or adjusting them."
            actionLabel="Clear Filters"
            onAction={handleClearFilters}
          />
        ) : (
          <div className="recipes-grid">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                onDelete={(rec) => setRecipeToDelete(rec)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(recipeToDelete)}
        title="Delete Recipe"
        message="Are you sure you want to delete this recipe from your collection?"
        recipeName={recipeToDelete?.name}
        confirmLabel="Delete Recipe"
        cancelLabel="Keep Recipe"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setRecipeToDelete(null)}
        isConfirming={isDeleting}
      />
    </div>
  );
}
