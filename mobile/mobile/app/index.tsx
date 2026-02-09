import { Redirect } from "expo-router";
import { useAuth } from "../src/context/AuthContext";
import { useFocusEffect } from "expo-router";

export default function Index() {
  const { token, loading } = useAuth();

  console.log("📱 Écran Index - token:", token, "loading:", loading);

  // Rafraîchir quand l'écran devient focus (quand on navigue vers cet écran)
  useFocusEffect(() => {
    console.log("🔄 Écran Index focus - token:", token, "loading:", loading);
  });

  if (loading) return null;

  if (token) {
    console.log("🔐 Token présent, redirection vers /(tabs)");
    return <Redirect href="/(tabs)" />;
  }

  console.log("🔐 Pas de token, redirection vers /(auth)/login");
  return <Redirect href="/(auth)/login" />;
}
