import express from "express";
import mongoose from "mongoose";
import Recipe from "../models/Recipe.js";

const router = express.Router();

// Helper to validate and format Mongoose error messages
const formatValidationError = (err) => {
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return messages.join("; ");
  }
  return err.message || "Invalid request data";
};

// POST /api/recipes - Create a new recipe
router.post("/", async (req, res) => {
  try {
    const { name, category, ingredients, steps, cookingTime, imageUrl } = req.body;

    const recipe = new Recipe({
      name,
      category,
      ingredients,
      steps,
      cookingTime,
      imageUrl: imageUrl !== undefined ? imageUrl : "",
    });

    const saved = await recipe.save();
    return res.status(201).json(saved);
  } catch (err) {
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({ message: formatValidationError(err) });
    }
    return res.status(500).json({ message: "An unexpected error occurred while saving the recipe" });
  }
});

// GET /api/recipes - Retrieve all recipes
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    return res.status(200).json(recipes);
  } catch (err) {
    return res.status(500).json({ message: "Failed to retrieve recipes" });
  }
});

// GET /api/recipes/:id - Retrieve a recipe by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid recipe ID format" });
    }

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    return res.status(200).json(recipe);
  } catch (err) {
    return res.status(500).json({ message: "Failed to retrieve the recipe" });
  }
});

// PUT /api/recipes/:id - Update an existing recipe
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid recipe ID format" });
    }

    const { name, category, ingredients, steps, cookingTime, imageUrl } = req.body;

    // Check if recipe exists first
    const existing = await Recipe.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Apply updates
    if (name !== undefined) existing.name = name;
    if (category !== undefined) existing.category = category;
    if (ingredients !== undefined) existing.ingredients = ingredients;
    if (steps !== undefined) existing.steps = steps;
    if (cookingTime !== undefined) existing.cookingTime = cookingTime;
    if (imageUrl !== undefined) existing.imageUrl = imageUrl;

    const updated = await existing.save();
    return res.status(200).json(updated);
  } catch (err) {
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({ message: formatValidationError(err) });
    }
    return res.status(500).json({ message: "Failed to update the recipe" });
  }
});

// DELETE /api/recipes/:id - Delete a recipe
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid recipe ID format" });
    }

    const deleted = await Recipe.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    return res.status(200).json({ message: "Recipe deleted successfully", id });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete the recipe" });
  }
});

export default router;
