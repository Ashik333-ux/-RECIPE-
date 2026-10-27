import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Pencil,
  Trash2,
  Calendar,
  Utensils,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { getRecipeById, deleteRecipe } from "../services/api";
import { useToast } from "../context/ToastContext";
import LoadingState from "../components/LoadingState";
import ConfirmDialog from "../components/ConfirmDialog";

export default function RecipeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchRecipe = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getRecipeById(id);
        if (isMounted) {
          setRecipe(data);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to load recipe:", err);
          if (err.response?.status === 404) {
            setError("The requested recipe could not be found.");
          } else if (err.response?.status === 400) {
            setError("Invalid recipe ID format.");
          } else {
            setError(
              err.response?.data?.message || "Failed to load recipe details."
            );
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRecipe();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteRecipe(id);
      showToast(`&ldquo;${recipe.name}&rdquo; was deleted.`);
      navigate("/");
    } catch (err) {
      console.error("Failed to delete recipe:", err);
      showToast(
        err.response?.data?.message || "Failed to delete recipe. Please try again.",
        "error"
      );
      setIsDeleting(false);
      setIsConfirmOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <LoadingState message="Opening recipe page..." />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="page-container">
        <div className="error-card" role="alert">
          <div className="error-icon-box">
            <AlertCircle size={32} />
          </div>
          <h2 className="error-title">Recipe Not Available</h2>
          <p className="error-message">{error || "Recipe not found."}</p>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft size={16} />
            <span>Return to Recipes</span>
          </Link>
        </div>
      </div>
    );
  }

  // Parse ingredients and steps into arrays for structured rendering
  const ingredientList = recipe.ingredients
    ? recipe.ingredients
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
    : [];

  const stepsList = recipe.steps
    ? recipe.steps
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
    : [];

  const createdDate = recipe.createdAt
    ? new Date(recipe.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  const showImage = Boolean(recipe.imageUrl && recipe.imageUrl.trim() && !imageError);

  return (
    <div className="recipe-details-page">
      <div className="page-container">
        {/* Navigation Bar */}
        <div className="details-nav-bar">
          <Link to="/" className="btn btn-secondary btn-sm">
            <ArrowLeft size={16} />
            <span>Back to Recipes</span>
          </Link>
          <div className="details-header-actions">
            <Link
              to={`/recipes/${id}/edit`}
              className="btn btn-secondary btn-sm"
            >
              <Pencil size={15} />
              <span>Edit</span>
            </Link>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => setIsConfirmOpen(true)}
            >
              <Trash2 size={15} />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Hero Banner Card */}
        <article className="details-hero-card">
          <div className="details-media-container">
            {showImage ? (
              <img
                src={recipe.imageUrl}
                alt={recipe.name}
                className="details-hero-img"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="details-fallback-media">
                <Utensils size={48} strokeWidth={1.5} />
                <span>{recipe.category}</span>
              </div>
            )}
          </div>

          <div className="details-hero-body">
            <div className="details-badges">
              <span className="badge badge-category">{recipe.category}</span>
              <span className="badge badge-time">
                <Clock size={14} />
                <span>{recipe.cookingTime} mins</span>
              </span>
              {createdDate && (
                <span className="badge badge-date">
                  <Calendar size={14} />
                  <span>{createdDate}</span>
                </span>
              )}
            </div>

            <h1 className="details-recipe-title">{recipe.name}</h1>
          </div>
        </article>

        {/* Recipe Content: Ingredients & Steps */}
        <div className="details-content-grid">
          {/* Ingredients Column */}
          <section className="details-card ingredients-card" aria-labelledby="ingredients-title">
            <h2 id="ingredients-title" className="section-title">
              Ingredients
            </h2>
            <ul className="ingredients-list">
              {ingredientList.map((item, index) => (
                <li key={index} className="ingredient-item">
                  <CheckCircle size={16} className="ingredient-bullet" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Steps Column */}
          <section className="details-card steps-card" aria-labelledby="steps-title">
            <h2 id="steps-title" className="section-title">
              Preparation Steps
            </h2>
            <ol className="steps-list">
              {stepsList.map((step, index) => {
                // Strip existing step number if present like "1. Boil..." to avoid double numbering
                const cleanedStep = step.replace(/^\d+[.)]\s*/, "");
                return (
                  <li key={index} className="step-item">
                    <div className="step-number">{index + 1}</div>
                    <div className="step-text">{cleanedStep}</div>
                  </li>
                );
              })}
            </ol>
          </section>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Delete Recipe"
        message="Are you sure you want to delete this recipe from your collection?"
        recipeName={recipe.name}
        confirmLabel="Delete Recipe"
        cancelLabel="Keep Recipe"
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmOpen(false)}
        isConfirming={isDeleting}
      />
    </div>
  );
}
