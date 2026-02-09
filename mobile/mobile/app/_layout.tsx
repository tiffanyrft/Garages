import { Slot } from "expo-router";
import { AuthProvider } from "../src/context/AuthContext";
import { initializeNotifications } from "../src/services/notification.service";
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    // Initialiser le service de notifications au démarrage
    initializeNotifications();
  }, []);

  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
