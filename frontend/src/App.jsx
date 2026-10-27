import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import RecipeDetailsPage from "./pages/RecipeDetailsPage";
import RecipeFormPage from "./pages/RecipeFormPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="app-layout">
          <Navbar />
          <div className="app-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/recipes/add" element={<RecipeFormPage />} />
              <Route path="/recipes/:id" element={<RecipeDetailsPage />} />
              <Route path="/recipes/:id/edit" element={<RecipeFormPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
          <footer className="app-footer">
            <div className="footer-container">
              <p className="footer-text">
                &copy; {new Date().getFullYear()} The Recipe Book &mdash; Curated Culinary Journal. Stored securely on MongoDB Atlas.
              </p>
            </div>
          </footer>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
