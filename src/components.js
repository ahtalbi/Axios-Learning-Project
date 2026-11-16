export function CreateRecipeCard(recipe) {
    const card = document.createElement("article");
    card.className = "overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:cursor-pointer";

    const image = document.createElement("img");
    image.className = "h-48 w-full object-cover";
    image.src = recipe.image;
    image.alt = recipe.name;
    image.loading = "lazy";

    const info = document.createElement("div");
    info.className = "space-y-2 p-4";

    const name = document.createElement("h3");
    name.className = "text-lg font-semibold";
    name.textContent = recipe.name;

    const cuisine = document.createElement("p");
    cuisine.className = "text-sm text-gray-600";
    cuisine.textContent = recipe.cuisine;

    const details = document.createElement("div");
    details.className = "flex justify-between text-sm text-gray-700";

    const difficulty = document.createElement("span");
    difficulty.textContent = `Difficulté : ${recipe.difficulty}`;
    const prepTime = document.createElement("span");
    prepTime.textContent = `${recipe.prepTimeMinutes} min`;

    details.append(difficulty, prepTime);
    info.append(name, cuisine, details);
    card.append(image, info);
    return card;
}