import { Link } from "react-router-dom";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="page-container">
      <div className="error-card not-found-card" role="alert">
        <div className="error-icon-box">
          <Compass size={36} />
        </div>
        <h1 className="error-title">Page Not Found</h1>
        <p className="error-message">
          The culinary page you are searching for does not exist or may have moved.
        </p>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
