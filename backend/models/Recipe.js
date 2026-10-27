import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Recipe name is required"],
      trim: true,
      validate: {
        validator: function (v) {
          return typeof v === "string" && v.trim().length > 0;
        },
        message: "Recipe name cannot be empty or whitespace-only",
      },
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      enum: {
        values: ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert", "Other"],
        message: "Category must be one of Breakfast, Lunch, Dinner, Snack, Dessert, Other",
      },
    },
    ingredients: {
      type: String,
      required: [true, "Ingredients are required"],
      trim: true,
      validate: {
        validator: function (v) {
          return typeof v === "string" && v.trim().length > 0;
        },
        message: "Ingredients cannot be empty or whitespace-only",
      },
    },
    steps: {
      type: String,
      required: [true, "Preparation steps are required"],
      trim: true,
      validate: {
        validator: function (v) {
          return typeof v === "string" && v.trim().length > 0;
        },
        message: "Preparation steps cannot be empty or whitespace-only",
      },
    },
    cookingTime: {
      type: Number,
      required: [true, "Cooking time is required"],
      min: [1, "Cooking time must be at least 1 minute"],
      validate: {
        validator: function (v) {
          return Number.isInteger(v) && v > 0;
        },
        message: "Cooking time must be a positive whole number",
      },
    },
    imageUrl: {
      type: String,
      trim: true,
      default: "",
      validate: {
        validator: function (v) {
          if (!v || v.trim() === "") return true;
          try {
            const parsed = new URL(v);
            return parsed.protocol === "http:" || parsed.protocol === "https:";
          } catch {
            return false;
          }
        },
        message: "Image URL must be a valid HTTP or HTTPS URL",
      },
    },
  },
  { timestamps: true }
);

const Recipe = mongoose.model("Recipe", RecipeSchema);
export default Recipe;
