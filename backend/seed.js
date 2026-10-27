import dotenv from "dotenv";
import mongoose from "mongoose";
import Recipe from "./models/Recipe.js";

dotenv.config();

const sampleRecipes = [
  {
    name: "Rustic Shakshuka with Feta & Herbs",
    category: "Breakfast",
    cookingTime: 25,
    imageUrl: "https://images.unsplash.com/photo-1590412200988-a436970781fa?w=800&auto=format&fit=crop&q=80",
    ingredients: "4 Large farm eggs\n1 can (400g) Crushed tomatoes\n1 Red bell pepper, diced\n1 Yellow onion, chopped\n2 cloves Garlic, minced\n1 tsp Ground cumin\n1/2 tsp Smoked paprika\n50g Crumbled feta cheese\nFresh cilantro & parsley for garnish\nWarm sourdough bread for serving",
    steps: "1. Heat olive oil in a wide skillet over medium heat. Add diced onion and bell pepper; sauté until softened (approx. 5 minutes).\n2. Stir in minced garlic, cumin, and smoked paprika. Cook for 1 minute until fragrant.\n3. Pour in crushed tomatoes and simmer gently for 10 minutes until sauce thickens.\n4. Use a spoon to make 4 small wells in the sauce. Gently crack an egg into each well.\n5. Cover with a lid and cook on medium-low for 6-8 minutes until whites are set and yolks remain runny.\n6. Remove from heat, scatter crumbled feta and fresh herbs over top, and serve warm with sourdough bread.",
  },
  {
    name: "Mediterranean Quinoa Harvest Bowl",
    category: "Lunch",
    cookingTime: 20,
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80",
    ingredients: "1 cup Quinoa, rinsed\n2 cups Vegetable broth\n1 cup Cherry tomatoes, halved\n1 English cucumber, diced\n1/2 cup Kalamata olives, pitted\n1/2 cup Chickpeas, drained and rinsed\n1/3 cup Red onion, thinly sliced\nFresh mint & dill\nLemon tahini dressing (olive oil, tahini, lemon juice, garlic, sea salt)",
    steps: "1. Cook quinoa in vegetable broth over medium heat for 15 minutes until fluffy; let cool to room temperature.\n2. In a large serving bowl, arrange cooked quinoa alongside diced cucumber, halved cherry tomatoes, chickpeas, and Kalamata olives.\n3. Whisk together extra virgin olive oil, tahini, lemon juice, minced garlic, and salt until smooth and creamy.\n4. Drizzle generous dressing over the harvest bowl and garnish with freshly chopped dill, mint, and cracked black pepper.",
  },
  {
    name: "Pan-Seared Tuscan Salmon with Garlic Spinach",
    category: "Dinner",
    cookingTime: 25,
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80",
    ingredients: "2 Fresh Salmon fillets (skin-on)\n2 tbsp Extra virgin olive oil\n2 cloves Garlic, thinly sliced\n1 cup Baby spinach\n1/2 cup Sun-dried tomatoes, sliced\n1/2 cup Heavy cream or coconut cream\n1/4 cup Grated parmesan cheese\n1 tbsp Fresh lemon juice\nFlaky sea salt & freshly cracked pepper",
    steps: "1. Pat salmon fillets dry with paper towels; season both sides generously with sea salt and black pepper.\n2. Heat olive oil in a skillet over medium-high heat. Place salmon skin-side down and sear for 4-5 minutes until crisp; flip and sear 3 minutes more. Transfer salmon to a plate.\n3. In the same skillet, add sliced garlic and sun-dried tomatoes; sauté for 1 minute.\n4. Pour in heavy cream and bring to a gentle simmer. Stir in parmesan cheese and baby spinach until wilted.\n5. Return salmon fillets to the skillet, spoon rich sauce over top, finish with a squeeze of fresh lemon, and serve immediately.",
  },
  {
    name: "Sourdough Toast with Avocado & Chili Crisp",
    category: "Snack",
    cookingTime: 10,
    imageUrl: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=800&auto=format&fit=crop&q=80",
    ingredients: "2 thick slices Artisan sourdough bread\n1 ripe Haas avocado\n1 tsp Fresh lime juice\n1 tbsp Crunchy chili crisp oil\n1 tsp Toasted white and black sesame seeds\nFlaky Maldon sea salt",
    steps: "1. Toast sourdough slices until golden and crisp.\n2. In a small bowl, roughly mash the ripe avocado with lime juice and a pinch of flaky salt.\n3. Spread mashed avocado generously over the warm toasted sourdough.\n4. Spoon crunchy chili crisp oil over the top and garnish with toasted sesame seeds.",
  },
  {
    name: "Skillet Apple & Blackberry Crisp",
    category: "Dessert",
    cookingTime: 45,
    imageUrl: "https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=800&auto=format&fit=crop&q=80",
    ingredients: "4 Honeycrisp apples, peeled, cored, and sliced\n1 cup Fresh blackberries\n1/4 cup Brown sugar\n1 tsp Ground cinnamon\n1 tbsp Lemon juice\n1 cup Rolled oats\n1/2 cup All-purpose flour\n1/3 cup Cold unsalted butter, cubed\nVanilla bean ice cream for serving",
    steps: "1. Preheat oven to 375°F (190°C).\n2. In a cast iron skillet, toss sliced apples and blackberries with brown sugar, ground cinnamon, and lemon juice.\n3. In a separate bowl, mix rolled oats, flour, remaining brown sugar, and cold butter using your fingertips until crumbly.\n4. Scatter the oat crumble topping evenly over the spiced fruit.\n5. Bake for 30-35 minutes until the fruit is bubbling and the topping is golden and crisp.\n6. Let rest 10 minutes, then serve warm topped with a scoop of vanilla bean ice cream.",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB Atlas for seeding...");

    // Check existing count
    const existingCount = await Recipe.countDocuments();
    if (existingCount > 0) {
      console.log(`Database already has ${existingCount} recipes. Skipping seed to preserve data.`);
    } else {
      await Recipe.insertMany(sampleRecipes);
      console.log(`Successfully seeded ${sampleRecipes.length} recipes to MongoDB Atlas!`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Failed to seed recipes:", err.message);
    process.exit(1);
  }
}

seed();
