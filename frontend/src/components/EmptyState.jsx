import { ChefHat } from "lucide-react";

export default function EmptyState({
  title = "No Recipes Found",
  description = "Start curating your personal collection of treasured recipes.",
  actionLabel,
  onAction,
  icon: Icon = ChefHat,
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={42} strokeWidth={1.5} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          className="btn btn-primary"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
