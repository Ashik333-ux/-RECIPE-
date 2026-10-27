export default function LoadingState({ message = "Gathering recipes..." }) {
  return (
    <div className="loading-container" role="status" aria-live="polite">
      <div className="loading-spinner-ring" />
      <p className="loading-text">{message}</p>
    </div>
  );
}
