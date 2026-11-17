import { AddRecipe, GetRecipes, SearchRecipe } from "./appelsApi.js";
import { CreateRecipeCard } from "./components.js";
import { ValidateRecipe } from "./validation.js";
import "./style.css";

const recipeList = document.querySelector("#recipe-list");
const recipeCount = document.querySelector("#recipe-count");
const errorMessage = document.querySelector("#error-message");
const emptyState = document.querySelector("#empty-state");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const showAllButton = document.querySelector("#show-all-button");
const addRecipeForm = document.querySelector("#add-recipe-form");
const addRecipeButton = document.querySelector("#add-recipe-button");
const addSuccess = document.querySelector("#add-success");
const addError = document.querySelector("#add-error");

function DisplayRecipes(recipes) {
    recipeList.replaceChildren(...recipes.map(CreateRecipeCard));
    recipeCount.textContent = `${recipes.length} recette${recipes.length > 1 ? "s" : ""}`;
    emptyState.classList.toggle("hidden", recipes.length !== 0);
}

function ShowAllRecipes() {
    searchInput.value = "";
    showAllButton.classList.add("hidden");
    emptyState.classList.add("hidden");
    errorMessage.classList.add("hidden");
    GetRecipes().then((recipes) => {
        if (recipes) DisplayRecipes(recipes);
        else errorMessage.classList.remove("hidden");
    });
}

const recipes = await GetRecipes();
if (recipes) DisplayRecipes(recipes);
else {
    recipeCount.textContent = "0 recette";
    errorMessage.classList.remove("hidden");
}

searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (!query) {
        ShowAllRecipes();
        return;
    }
    showAllButton.classList.remove("hidden");
    errorMessage.classList.add("hidden");
    const results = await SearchRecipe(query);
    if (results) DisplayRecipes(results);
    else {
        recipeList.replaceChildren();
        recipeCount.textContent = "0 recette";
        emptyState.classList.remove("hidden");
    }
});

showAllButton.addEventListener("click", ShowAllRecipes);
document.querySelector("#empty-show-all-button").addEventListener("click", ShowAllRecipes);

addRecipeForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    addSuccess.classList.add("hidden");
    addError.classList.add("hidden");

    const recipe = {
        name: addRecipeForm.elements.name.value.trim(),
        cuisine: addRecipeForm.elements.cuisine.value.trim(),
        difficulty: addRecipeForm.elements.difficulty.value,
        prepTimeMinutes: Number(addRecipeForm.elements.prepTimeMinutes.value)
    };
    const errors = ValidateRecipe(recipe);
    for (const field of ["name", "cuisine", "difficulty", "prepTimeMinutes"]) {
        const error = document.querySelector(`#${field}-error`);
        error.textContent = errors[field] || "";
        error.classList.toggle("hidden", !errors[field]);
    }
    if (Object.keys(errors).length) return;

    addRecipeButton.disabled = true;
    addRecipeButton.textContent = "Envoi…";
    const createdRecipe = await AddRecipe(recipe);
    addRecipeButton.disabled = false;
    addRecipeButton.textContent = "Ajouter la recette";

    if (!createdRecipe) {
        addError.textContent = "Impossible d’ajouter la recette. Réessayez.";
        addError.classList.remove("hidden");
        return;
    }

    searchInput.value = "";
    showAllButton.classList.add("hidden");
    recipeList.prepend(CreateRecipeCard(createdRecipe));
    const count = Number.parseInt(recipeCount.textContent, 10) || 0;
    recipeCount.textContent = `${count + 1} recettes`;
    emptyState.classList.add("hidden");
    addRecipeForm.reset();
    addSuccess.textContent = "Recette ajoutée avec succès !";
    addSuccess.classList.remove("hidden");
});
