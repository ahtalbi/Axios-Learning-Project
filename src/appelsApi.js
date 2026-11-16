import axios from "axios";

// Configuration of axios Inctance
const RecipesApi = axios.create({
    baseURL: "https://dummyjson.com/",
    timeout: 5000,
    maxContentLength: 10 * 1024 * 1024,
    maxBodyLength: 10 * 1024 * 1024
});

RecipesApi.interceptors.request.use((config) => {
  console.log(`→ ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

export async function GetRecipes() {
    try {
        let res = await RecipesApi.get("/recipes", {params: {limit : 12}});
        return res.data.recipes;
    } catch (err) {
        console.error(err.message);
        return null;
    }
}

export async function SearchRecipe(search) {
    try {
        let res = await RecipesApi.get("/recipes/search", { params: { q: search } });
        return res.data.recipes;
    } catch (err) {
        console.error(err.message);
        return null;
    }
}

export async function AddRecipe(recipe) {
    try {
        let res = await RecipesApi.post("/recipes/add", recipe);
        return res.data;
    } catch (err) {
        console.error(err.message);
        return null;
    }
}

export async function DeletRecipe(id) {
    try {
        let res = await RecipesApi.delete(`/recipes/${id}`);
        return res.data;
    } catch (err) {
        console.error(err.message);
        return null;
    }
}