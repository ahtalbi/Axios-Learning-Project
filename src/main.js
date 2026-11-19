import { AddRecipe, DeleteRecipe, GetRecipes, SearchRecipe } from "./appelsApi.js";
import { CreateRecipeCard } from "./components.js";
import { ValidateRecipe } from "./validation.js";
import "./style.css";

const recipeList = document.querySelector("#recipe-list");
const recipeCount = document.querySelector("#recipe-count");
const loadingMessage = document.querySelector("#loading-message");
const errorMessage = document.querySelector("#error-message");
const errorText = document.querySelector("#error-text");
const retryButton = document.querySelector("#retry-button");
const emptyState = document.querySelector("#empty-state");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const showAllButton = document.querySelector("#show-all-button");
const addRecipeForm = document.querySelector("#add-recipe-form");
const addRecipeButton = document.querySelector("#add-recipe-button");
const addSuccess = document.querySelector("#add-success");
const addError = document.querySelector("#add-error");
const deleteMessage = document.querySelector("#delete-message");
let retryAction = () => LoadRecipes();

function SetLoading(isLoading) {
    loadingMessage.classList.toggle("hidden", !isLoading);
    errorMessage.classList.add("hidden");
}

function ShowError(type, action) {
    const messages = {
        unreachable: "Serveur injoignable. Vérifiez votre connexion.",
        "not-found": "Recette introuvable (404).",
        server: "Erreur du serveur (500)."
    };
    retryAction = action;
    errorText.textContent = messages[type] || messages.server;
    errorMessage.classList.remove("hidden");
}

function DisplayRecipes(recipes) {
    recipeList.replaceChildren(...recipes.map(CreateRecipeCard));
    recipeCount.textContent = `${recipes.length} recette${recipes.length > 1 ? "s" : ""}`;
    emptyState.classList.toggle("hidden", recipes.length !== 0);
}

async function LoadRecipes() {
    SetLoading(true);
    const result = await GetRecipes();
    SetLoading(false);
    if (result.error) {
        recipeCount.textContent = "";
        ShowError(result.error, LoadRecipes);
        return;
    }
    DisplayRecipes(result.data);
}

async function SearchRecipes(query) {
    SetLoading(true);
    const result = await SearchRecipe(query);
    SetLoading(false);
    if (result.error) {
        recipeList.replaceChildren();
        recipeCount.textContent = "0 recette";
        ShowError(result.error, () => SearchRecipes(query));
        return;
    }
    DisplayRecipes(result.data);
}

function ShowAllRecipes() {
    searchInput.value = "";
    showAllButton.classList.add("hidden");
    emptyState.classList.add("hidden");
    LoadRecipes();
}

await LoadRecipes();

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return ShowAllRecipes();
    showAllButton.classList.remove("hidden");
    SearchRecipes(query);
});

showAllButton.addEventListener("click", ShowAllRecipes);
document.querySelector("#empty-show-all-button").addEventListener("click", ShowAllRecipes);
retryButton.addEventListener("click", () => retryAction());

recipeList.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-recipe-id]");
    if (!button || !window.confirm("Voulez-vous vraiment supprimer cette recette ?")) return;

    const recipeId = button.dataset.recipeId;
    const card = button.closest("article");
    await RemoveRecipe(recipeId, card, button);
});

async function RemoveRecipe(recipeId, card, button) {
    button.disabled = true;
    const result = await DeleteRecipe(recipeId);
    if (result.error) {
        button.disabled = false;
        ShowError(result.error, () => RemoveRecipe(recipeId, card, button));
        return;
    }
    card.remove();
    const count = recipeList.querySelectorAll("article").length;
    recipeCount.textContent = `${count} recette${count > 1 ? "s" : ""}`;
    emptyState.classList.toggle("hidden", count !== 0);
    deleteMessage.textContent = "Recette supprimée avec succès.";
    deleteMessage.classList.remove("hidden");
}

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
    const result = await AddRecipe(recipe);
    addRecipeButton.disabled = false;
    addRecipeButton.textContent = "Ajouter la recette";

    if (result.error) {
        addError.textContent = "Impossible d’ajouter la recette. Réessayez.";
        addError.classList.remove("hidden");
        return;
    }
    const createdRecipe = result.data;
    searchInput.value = "";
    showAllButton.classList.add("hidden");
    recipeList.prepend(CreateRecipeCard(createdRecipe));
    const count = recipeList.querySelectorAll("article").length;
    recipeCount.textContent = `${count} recettes`;
    emptyState.classList.add("hidden");
    addRecipeForm.reset();
    addSuccess.textContent = "Recette ajoutée avec succès !";
    addSuccess.classList.remove("hidden");
});
