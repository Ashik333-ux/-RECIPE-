import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

export default function ConfirmDialog({
  isOpen,
  title = "Delete Recipe",
  message,
  recipeName,
  confirmLabel = "Delete Recipe",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isConfirming = false,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === "Escape" && !isConfirming) {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel, isConfirming]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={() => {
        if (!isConfirming) onCancel();
      }}
      role="presentation"
    >
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <button
          type="button"
          className="modal-close"
          onClick={onCancel}
          disabled={isConfirming}
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        <div className="modal-header">
          <div className="modal-icon-badge">
            <AlertTriangle size={24} />
          </div>
          <h3 id="modal-title" className="modal-title">
            {title}
          </h3>
        </div>

        <div id="modal-description" className="modal-body">
          <p>{message || "Are you sure you want to delete this recipe?"}</p>
          {recipeName && (
            <div className="modal-highlight-box">
              <span className="modal-highlight-name">&ldquo;{recipeName}&rdquo;</span>
            </div>
          )}
          <p className="modal-subtext">This action is permanent and cannot be undone.</p>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isConfirming}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isConfirming}
          >
            {isConfirming ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
