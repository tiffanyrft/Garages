import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function NotFoundScreen() {
  const router = useRouter();

  useEffect(() => {
    console.log("Page non trouvée - redirection vers l'accueil");
  }, []);

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: "center", 
      alignItems: "center", 
      backgroundColor: "#f5f5f5",
      padding: 20 
    }}>
      <Text style={{ fontSize: 48, marginBottom: 20 }}>{"🔍"}</Text>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center", color: "#333" }}>
        {"Page introuvable"}
      </Text>
      <Text style={{ fontSize: 16, textAlign: "center", color: "#666", marginBottom: 30 }}>
        {"La page que vous recherchez n'existe pas ou a été déplacée."}
      </Text>
      
      <TouchableOpacity
        style={{
          backgroundColor: "#007BFF",
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderRadius: 8,
        }}
        onPress={() => router.replace("/(tabs)")}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
          {"Retour à l'accueil"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
