import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";
import { router } from "expo-router";
import { loginRequest } from "../services/auth.service";

type AuthContextType = {
  user: any;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    console.log("🔄 Chargement de l'utilisateur...");
    const storedUser = await SecureStore.getItemAsync("user");
    const storedToken = await SecureStore.getItemAsync("token");
    
    console.log("📝 Token trouvé:", storedToken);
    console.log("👤 User trouvé:", storedUser);
    
    // Forcer la déconnexion si c'est un token mock
    if (storedToken && storedToken.startsWith("mock-token")) {
      console.log("🗑️ Token mock détecté, suppression...");
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("user");
      setLoading(false);
      return;
    }
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }

  async function login(email: string, password: string) {
    try {
      const res = await loginRequest(email, password);

      await SecureStore.setItemAsync("token", res.token);
      await SecureStore.setItemAsync("user", JSON.stringify(res.user));

      setUser(res.user);
      setToken(res.token);
    } catch (error) {
      console.error("Erreur de connexion:", error);
      throw error;
    }
  }

  async function logout() {
    console.log("🔐 Déconnexion en cours...");
    try {
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("user");
      setUser(null);
      setToken(null);
      console.log("✅ Déconnexion réussie !");
      
      // Forcer la redirection vers la page de connexion
      console.log("🔄 Redirection forcée vers /(auth)/login");
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("❌ Erreur lors de la déconnexion:", error);
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  console.log("🔐 useAuth appelé - user:", context.user, "token:", context.token, "loading:", context.loading);
  return context;
}
