import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export const getRecipes = async () => {
  const response = await api.get("/recipes");
  return response.data;
};

export const getRecipeById = async (id) => {
  const response = await api.get(`/recipes/${id}`);
  return response.data;
};

export const createRecipe = async (recipeData) => {
  const response = await api.post("/recipes", recipeData);
  return response.data;
};

export const updateRecipe = async (id, recipeData) => {
  const response = await api.put(`/recipes/${id}`, recipeData);
  return response.data;
};

export const deleteRecipe = async (id) => {
  const response = await api.delete(`/recipes/${id}`);
  return response.data;
};

export const checkHealth = async () => {
  const response = await api.get("/health");
  return response.data;
};

export default api;
