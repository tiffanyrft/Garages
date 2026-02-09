import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const api = axios.create({
  baseURL: "http://192.168.88.24:8000/api", // Votre IP locale
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API Error:", error.message);
    if (error.response?.status === 401) {
      // Token expiré, rediriger vers login
      SecureStore.deleteItemAsync("token");
    }
    return Promise.reject(error);
  }
);
