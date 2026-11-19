import axios from "axios";

// Configuration of axios Inctance
const RecipesApi = axios.create({
    baseURL: "https://dummyjson.com/",
    timeout: 5000,
    maxContentLength: 10 * 1024 * 1024,
    maxBodyLength: 10 * 1024 * 1024
});

function ApiError(err) {
    if (!err.response) return "unreachable";
    if (err.response.status === 404) return "not-found";
    if (err.response.status >= 500) return "server";
    return "server";
}

RecipesApi.interceptors.request.use((config) => {
  console.log(`→ ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

export async function GetRecipes() {
    try {
        let res = await RecipesApi.get("/recipes", {params: {limit : 12}});
        return { data: res.data.recipes };
    } catch (err) {
        console.error(err.message);
        return { error: ApiError(err) };
    }
}

export async function SearchRecipe(search) {
    try {
        let res = await RecipesApi.get("/recipes/search", { params: { q: search } });
        return { data: res.data.recipes };
    } catch (err) {
        console.error(err.message);
        return { error: ApiError(err) };
    }
}

export async function AddRecipe(recipe) {
    try {
        let res = await RecipesApi.post("/recipes/add", recipe);
        return { data: res.data };
    } catch (err) {
        console.error(err.message);
        return { error: ApiError(err) };
    }
}

export async function DeleteRecipe(id) {
    try {
        let res = await RecipesApi.delete(`/recipes/${id}`);
        return { data: res.data };
    } catch (err) {
        console.error(err.message);
        return { error: ApiError(err) };
    }
}
