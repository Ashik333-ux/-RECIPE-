import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  BookPlus,
  Pencil,
  Image as ImageIcon,
  Clock,
  AlertCircle,
} from "lucide-react";
import { createRecipe, getRecipeById, updateRecipe } from "../services/api";
import { useToast } from "../context/ToastContext";
import LoadingState from "../components/LoadingState";

const CATEGORIES = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snack",
  "Dessert",
  "Other",
];

export default function RecipeFormPage() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    category: "Breakfast",
    cookingTime: "",
    imageUrl: "",
    ingredients: "",
    steps: "",
  });

  const [errors, setErrors] = useState({});
  const [loadingRecipe, setLoadingRecipe] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    if (!isEditMode) return;

    let isMounted = true;
    const loadRecipe = async () => {
      setLoadingRecipe(true);
      try {
        const recipe = await getRecipeById(id);
        if (isMounted) {
          setFormData({
            name: recipe.name || "",
            category: recipe.category || "Breakfast",
            cookingTime: recipe.cookingTime !== undefined ? String(recipe.cookingTime) : "",
            imageUrl: recipe.imageUrl || "",
            ingredients: recipe.ingredients || "",
            steps: recipe.steps || "",
          });
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to load recipe for editing:", err);
          setServerError("Failed to load recipe details. It may have been removed.");
        }
      } finally {
        if (isMounted) setLoadingRecipe(false);
      }
    };

    loadRecipe();
    return () => {
      isMounted = false;
    };
  }, [id, isEditMode]);

  const validate = () => {
    const newErrors = {};

    // 1. Recipe name
    if (!formData.name || !formData.name.trim()) {
      newErrors.name = "Recipe name is required and cannot be whitespace only.";
    }

    // 2. Category
    if (!CATEGORIES.includes(formData.category)) {
      newErrors.category = "Please select a valid category.";
    }

    // 3. Cooking Time
    const timeNum = Number(formData.cookingTime);
    if (
      formData.cookingTime === "" ||
      isNaN(timeNum) ||
      !Number.isInteger(timeNum) ||
      timeNum < 1
    ) {
      newErrors.cookingTime =
        "Cooking time must be a positive whole number (minimum 1 minute).";
    }

    // 4. Image URL (optional, but if provided must be http/https)
    if (formData.imageUrl && formData.imageUrl.trim()) {
      try {
        const url = new URL(formData.imageUrl.trim());
        if (url.protocol !== "http:" && url.protocol !== "https:") {
          newErrors.imageUrl = "Image URL must begin with http:// or https://";
        }
      } catch {
        newErrors.imageUrl = "Please enter a valid web URL (e.g., https://example.com/image.jpg)";
      }
    }

    // 5. Ingredients
    if (!formData.ingredients || !formData.ingredients.trim()) {
      newErrors.ingredients = "Please enter at least one ingredient.";
    }

    // 6. Steps
    if (!formData.steps || !formData.steps.trim()) {
      newErrors.steps = "Please describe the preparation steps.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Reset preview error if imageUrl changed
    if (name === "imageUrl") {
      setPreviewError(false);
    }

    // Clear specific field error as user types
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);
    setServerError(null);

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      cookingTime: parseInt(formData.cookingTime, 10),
      imageUrl: formData.imageUrl.trim(),
      ingredients: formData.ingredients.trim(),
      steps: formData.steps.trim(),
    };

    try {
      if (isEditMode) {
        await updateRecipe(id, payload);
        showToast(`&ldquo;${payload.name}&rdquo; updated successfully!`);
        navigate(`/recipes/${id}`);
      } else {
        const created = await createRecipe(payload);
        showToast(`&ldquo;${payload.name}&rdquo; added to your cookbook!`);
        navigate(`/recipes/${created._id}`);
      }
    } catch (err) {
      console.error("Submission failed:", err);
      const msg =
        err.response?.data?.message ||
        "An unexpected error occurred while saving the recipe.";
      setServerError(msg);
      showToast(msg, "error");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingRecipe) {
    return (
      <div className="page-container">
        <LoadingState message="Loading recipe details..." />
      </div>
    );
  }

  return (
    <div className="recipe-form-page">
      <div className="page-container page-container-narrow">
        {/* Navigation */}
        <div className="form-nav-bar">
          <Link
            to={isEditMode ? `/recipes/${id}` : "/"}
            className="btn btn-secondary btn-sm"
          >
            <ArrowLeft size={16} />
            <span>{isEditMode ? "Cancel Editing" : "Back to Recipes"}</span>
          </Link>
        </div>

        {/* Form Card */}
        <div className="form-card">
          <div className="form-header">
            <div className="form-header-icon">
              {isEditMode ? <Pencil size={24} /> : <BookPlus size={24} />}
            </div>
            <div>
              <h1 className="form-title">
                {isEditMode ? "Edit Recipe" : "Create New Recipe"}
              </h1>
              <p className="form-subtitle">
                {isEditMode
                  ? "Update ingredients, cooking time, and preparation steps."
                  : "Fill in the details below to add a new dish to your collection."}
              </p>
            </div>
          </div>

          {serverError && (
            <div className="form-alert-error" role="alert">
              <AlertCircle size={20} />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Recipe Name */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Recipe Name <span className="required-star">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className={`form-input ${errors.name ? "input-error" : ""}`}
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Classic Margherita Pizza"
                disabled={submitting}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            {/* Category and Cooking Time Row */}
            <div className="form-row">
              <div className="form-group form-col">
                <label htmlFor="category" className="form-label">
                  Category <span className="required-star">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  className={`form-select ${errors.category ? "input-error" : ""}`}
                  value={formData.category}
                  onChange={handleChange}
                  disabled={submitting}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <span className="field-error">{errors.category}</span>
                )}
              </div>

              <div className="form-group form-col">
                <label htmlFor="cookingTime" className="form-label">
                  Cooking Time (minutes) <span className="required-star">*</span>
                </label>
                <div className="input-with-icon">
                  <Clock size={16} className="input-inner-icon" />
                  <input
                    id="cookingTime"
                    name="cookingTime"
                    type="number"
                    min="1"
                    step="1"
                    className={`form-input form-input-with-icon ${
                      errors.cookingTime ? "input-error" : ""
                    }`}
                    value={formData.cookingTime}
                    onChange={handleChange}
                    placeholder="e.g. 25"
                    disabled={submitting}
                  />
                </div>
                {errors.cookingTime && (
                  <span className="field-error">{errors.cookingTime}</span>
                )}
              </div>
            </div>

            {/* Image URL & Live Preview */}
            <div className="form-group">
              <label htmlFor="imageUrl" className="form-label">
                Image URL <span className="optional-tag">(Optional)</span>
              </label>
              <div className="input-with-icon">
                <ImageIcon size={16} className="input-inner-icon" />
                <input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  className={`form-input form-input-with-icon ${
                    errors.imageUrl ? "input-error" : ""
                  }`}
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/photo-..."
                  disabled={submitting}
                />
              </div>
              {errors.imageUrl && (
                <span className="field-error">{errors.imageUrl}</span>
              )}

              {/* Image Preview Box */}
              {formData.imageUrl && !errors.imageUrl && (
                <div className="image-preview-box">
                  {!previewError ? (
                    <img
                      src={formData.imageUrl}
                      alt="Recipe Preview"
                      className="image-preview-thumbnail"
                      onError={() => setPreviewError(true)}
                    />
                  ) : (
                    <div className="image-preview-fallback">
                      <AlertCircle size={18} />
                      <span>Preview unavailable (image link may be broken)</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Ingredients */}
            <div className="form-group">
              <label htmlFor="ingredients" className="form-label">
                Ingredients <span className="required-star">*</span>
              </label>
              <p className="form-hint">
                List each ingredient on a new line (e.g. 2 cups flour).
              </p>
              <textarea
                id="ingredients"
                name="ingredients"
                rows={5}
                className={`form-textarea ${errors.ingredients ? "input-error" : ""}`}
                value={formData.ingredients}
                onChange={handleChange}
                placeholder={"200g Pasta\n2 cloves Garlic, minced\n2 tbsp Olive Oil\nSalt & Pepper to taste"}
                disabled={submitting}
              />
              {errors.ingredients && (
                <span className="field-error">{errors.ingredients}</span>
              )}
            </div>

            {/* Steps */}
            <div className="form-group">
              <label htmlFor="steps" className="form-label">
                Preparation Steps <span className="required-star">*</span>
              </label>
              <p className="form-hint">
                Describe the instructions step-by-step on separate lines.
              </p>
              <textarea
                id="steps"
                name="steps"
                rows={6}
                className={`form-textarea ${errors.steps ? "input-error" : ""}`}
                value={formData.steps}
                onChange={handleChange}
                placeholder={"Bring a large pot of salted water to a rolling boil.\nAdd pasta and cook until al dente (approx 9 minutes).\nMeanwhile, gently saute garlic in olive oil until golden.\nToss pasta with garlic oil and season with salt and pepper."}
                disabled={submitting}
              />
              {errors.steps && (
                <span className="field-error">{errors.steps}</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  navigate(isEditMode ? `/recipes/${id}` : "/")
                }
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                <Save size={16} />
                <span>
                  {submitting
                    ? isEditMode
                      ? "Updating Recipe..."
                      : "Saving Recipe..."
                    : isEditMode
                    ? "Update Recipe"
                    : "Save Recipe"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
