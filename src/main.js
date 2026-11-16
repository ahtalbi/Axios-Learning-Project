import { AddRecipe, DeletRecipe, GetRecipes, SearchRecipe } from "./appelsApi.js";

console.log(await GetRecipes());
console.log(await SearchRecipe("Marg"));
let recipe = await AddRecipe({
    name: "Chicken Pasta",
    ingredients: ["Chicken", "Pasta", "Cream", "Garlic"],
    instructions: [
        "Cook the pasta.",
        "Fry the chicken.",
        "Add cream and garlic.",
        "Mix everything together."
    ],
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    servings: 2,
    difficulty: "Easy",
    cuisine: "Italian"
});
console.log(recipe);
console.log(await DeletRecipe(1));
