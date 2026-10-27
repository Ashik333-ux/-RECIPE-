import { Link, useLocation } from "react-router-dom";
import { BookOpen, Plus } from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" aria-label="Recipe Book Home">
          <div className="navbar-logo-icon">
            <BookOpen size={22} strokeWidth={2.2} />
          </div>
          <div className="navbar-brand-text">
            <span className="navbar-title">The Recipe Book</span>
            <span className="navbar-tagline">Culinary Journal</span>
          </div>
        </Link>

        <nav className="navbar-nav" aria-label="Main Navigation">
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
          >
            Home
          </Link>
          <Link to="/recipes/add" className="btn btn-primary btn-sm">
            <Plus size={16} strokeWidth={2.4} />
            <span>Add Recipe</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
