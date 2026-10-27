import dotenv from "dotenv";
import mongoose from "mongoose";
import Recipe from "./models/Recipe.js";

dotenv.config();

async function runTests() {
  console.log("Starting backend verification tests...");

  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is missing in .env");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("✓ Connected to MongoDB Atlas");

  // Test 1: Empty name validation
  try {
    const invalid = new Recipe({
      name: "   ",
      category: "Lunch",
      ingredients: "salt",
      steps: "mix",
      cookingTime: 10,
    });
    await invalid.save();
    console.error("✗ Failed: whitespace-only name should be rejected");
    process.exit(1);
  } catch {
    console.log("✓ Whitespace-only recipe name rejected");
  }

  // Test 2: Invalid cooking time (non-integer / negative)
  try {
    const invalidTime = new Recipe({
      name: "Soup",
      category: "Lunch",
      ingredients: "salt",
      steps: "mix",
      cookingTime: 0,
    });
    await invalidTime.save();
    console.error("✗ Failed: 0 cooking time should be rejected");
    process.exit(1);
  } catch {
    console.log("✓ Zero cooking time rejected");
  }

  // Test 3: Invalid category
  try {
    const badCat = new Recipe({
      name: "Soup",
      category: "UnknownCategory",
      ingredients: "salt",
      steps: "mix",
      cookingTime: 15,
    });
    await badCat.save();
    console.error("✗ Failed: invalid category should be rejected");
    process.exit(1);
  } catch {
    console.log("✓ Invalid category rejected");
  }

  // Test 4: Invalid imageUrl format
  try {
    const badUrl = new Recipe({
      name: "Soup",
      category: "Lunch",
      ingredients: "salt",
      steps: "mix",
      cookingTime: 15,
      imageUrl: "ftp://not-an-http-url.com",
    });
    await badUrl.save();
    console.error("✗ Failed: non-http/https URL should be rejected");
    process.exit(1);
  } catch {
    console.log("✓ Invalid imageUrl format rejected");
  }

  // Test 5: Full CRUD lifecycle
  const testRecipe = new Recipe({
    name: "Automated Test Recipe",
    category: "Dinner",
    ingredients: "Ingredient 1\nIngredient 2",
    steps: "Step 1\nStep 2",
    cookingTime: 30,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
  });

  const created = await testRecipe.save();
  console.log("✓ Recipe created:", created._id.toString());

  const found = await Recipe.findById(created._id);
  if (!found || found.name !== "Automated Test Recipe") {
    console.error("✗ Failed: created recipe not found");
    process.exit(1);
  }
  console.log("✓ Recipe retrieved by ID");

  found.cookingTime = 45;
  await found.save();
  const updated = await Recipe.findById(created._id);
  if (updated.cookingTime !== 45) {
    console.error("✗ Failed: update failed");
    process.exit(1);
  }
  console.log("✓ Recipe updated successfully");

  await Recipe.findByIdAndDelete(created._id);
  const deletedCheck = await Recipe.findById(created._id);
  if (deletedCheck) {
    console.error("✗ Failed: recipe not deleted");
    process.exit(1);
  }
  console.log("✓ Recipe deleted successfully");

  await mongoose.disconnect();
  console.log("All backend verification tests passed!");
  process.exit(0);
}

runTests().catch((err) => {
  console.error("Test execution failed:", err.message);
  process.exit(1);
});
