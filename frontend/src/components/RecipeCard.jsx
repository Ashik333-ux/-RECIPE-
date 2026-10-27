import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clock, Eye, Pencil, Trash2, Utensils } from "lucide-react";

export default function RecipeCard({ recipe, onDelete }) {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const { _id, name, category, cookingTime, imageUrl } = recipe;

  const handleCardClick = () => {
    navigate(`/recipes/${_id}`);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    navigate(`/recipes/${_id}/edit`);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(recipe);
  };

  const showImage = Boolean(imageUrl && imageUrl.trim() && !imageError);

  return (
    <article
      className="recipe-card"
      onClick={handleCardClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={`View details for ${name}`}
    >
      <div className="recipe-card-media">
        {showImage ? (
          <img
            src={imageUrl}
            alt={name}
            className="recipe-card-img"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="recipe-card-fallback" aria-hidden="true">
            <div className="fallback-pattern" />
            <div className="fallback-badge">
              <Utensils size={32} strokeWidth={1.6} />
              <span className="fallback-category">{category}</span>
            </div>
          </div>
        )}
        <span className="recipe-badge-category">{category}</span>
      </div>

      <div className="recipe-card-content">
        <h3 className="recipe-card-title" title={name}>
          {name}
        </h3>

        <div className="recipe-card-meta">
          <div className="recipe-meta-item">
            <Clock size={15} />
            <span>{cookingTime} min{cookingTime === 1 ? "" : "s"}</span>
          </div>
        </div>

        <div className="recipe-card-actions">
          <Link
            to={`/recipes/${_id}`}
            className="btn btn-secondary btn-sm"
            onClick={(e) => e.stopPropagation()}
            aria-label={`View details for ${name}`}
          >
            <Eye size={15} />
            <span>View</span>
          </Link>
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-icon"
            onClick={handleEditClick}
            aria-label={`Edit ${name}`}
            title="Edit recipe"
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            className="btn btn-ghost-danger btn-sm btn-icon"
            onClick={handleDeleteClick}
            aria-label={`Delete ${name}`}
            title="Delete recipe"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}
