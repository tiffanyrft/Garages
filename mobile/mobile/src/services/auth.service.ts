import { api } from "./api";
import { mockApi } from "./mock.service";

export const loginRequest = async (email: string, password: string) => {
  try {
    const response = await api.post("/login", {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    console.log("API Error:", error.response?.status);
    
    // Si l'API répond avec une erreur 401 ou 400, utiliser le vrai message d'erreur
    if (error.response?.status === 401 || error.response?.status === 400) {
      console.log("Message d'erreur du backend:", error.response.data.error);
      throw new Error(error.response.data.error || "Identifiants incorrects");
    }
    
    // Si c'est une erreur réseau (API vraiment indisponible), utiliser le mock
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      console.log("API non disponible, utilisation du mock pour login");
      return await mockApi.login(email, password);
    }
    
    // Pour les autres erreurs, utiliser le message du backend
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    
    // Erreur par défaut
    throw new Error("Erreur de connexion. Veuillez réessayer.");
  }
};

export const registerRequest = async (name: string, email: string, password: string) => {
  try {
    const response = await api.post("/register", {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    console.log("API Error:", error.response?.status);
    
    // Si l'API répond avec une erreur 400 ou 500, utiliser le vrai message d'erreur
    if (error.response?.status === 400 || error.response?.status === 500) {
      console.log("Message d'erreur du backend:", error.response.data.error);
      throw new Error(error.response.data.error || "Erreur lors de l'inscription");
    }
    
    // Si c'est une erreur réseau (API vraiment indisponible), utiliser le mock
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      console.log("API non disponible, utilisation du mock pour register");
      return await mockApi.register(name, email, password);
    }
    
    // Pour les autres erreurs, utiliser le message du backend
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    
    // Erreur par défaut
    throw new Error("Erreur lors de l'inscription. Veuillez réessayer.");
  }
};
