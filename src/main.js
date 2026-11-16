import { GetRecipes } from "./appelsApi.js";
import { CreateRecipeCard } from "./components.js";
import "./style.css";

const recipeList = document.querySelector("#recipe-list");
const recipeCount = document.querySelector("#recipe-count");
const errorMessage = document.querySelector("#error-message");
const recipes = await GetRecipes();

if (recipes) {
    recipeCount.textContent = `${recipes.length} recettes`;
    recipeList.append(...recipes.map(CreateRecipeCard));
} else {
    recipeCount.textContent = "0 recettes";
    errorMessage.classList.remove("hidden");
}
