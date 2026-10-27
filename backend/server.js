import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import recipeRoutes from "./routes/recipeRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is healthy" });
});

// REST Routes
app.use("/api/recipes", recipeRoutes);

// 404 handler for unknown endpoints
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// Global error handler
app.use((err, req, res, _next) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    if (!MONGO_URI) {
      console.error("MONGO_URI is not defined in environment variables. Please check your .env file.");
      process.exit(1);
    }
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB Atlas successfully");
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  }
};

// Start server only when directly run
if (process.env.NODE_ENV !== "test") {
  startServer();
}

export default app;
