import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, View, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import { useAuth } from "../../src/context/AuthContext";

export default function Register() {
  const { login } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!name || !email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    try {
      // Pour l'inscription, on utilise la fonction registerRequest
      const { registerRequest } = require("../../src/services/auth.service");
      const response = await registerRequest(name, email, password);
      
      // Après l'inscription, on connecte directement l'utilisateur
      await login(email, password);
      router.replace("/(tabs)");
    } catch (e: any) {
      console.log("Erreur d'inscription:", e);
      Alert.alert("Erreur d'inscription", e.message || "Impossible de créer le compte");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f5f5f5" }}>
      <View style={{ backgroundColor: "white", padding: 30, borderRadius: 15, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
        <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 10, textAlign: "center", color: "#007BFF" }}>
          {"Créer un compte"}
        </Text>
        <Text style={{ fontSize: 14, color: "#666", marginBottom: 30, textAlign: "center" }}>
          {"Rejoignez notre garage"}
        </Text>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, marginBottom: 8, color: "#333", fontWeight: "500" }}>
            {"Nom complet"}
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              backgroundColor: "#f9f9f9",
            }}
            placeholder="Votre nom"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, marginBottom: 8, color: "#333", fontWeight: "500" }}>
            {"Email"}
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              backgroundColor: "#f9f9f9",
            }}
            placeholder="votre@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={{ marginBottom: 30 }}>
          <Text style={{ fontSize: 16, marginBottom: 8, color: "#333", fontWeight: "500" }}>
            {"Mot de passe"}
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              backgroundColor: "#f9f9f9",
            }}
            placeholder="Votre mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: "#007BFF",
            padding: 15,
            borderRadius: 8,
            alignItems: "center",
            marginBottom: 15,
          }}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
              {"S'inscrire"}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: "#007BFF",
            padding: 15,
            borderRadius: 8,
            alignItems: "center",
          }}
          onPress={() => router.back()}
        >
          <Text style={{ color: "#007BFF", fontSize: 16, fontWeight: "500" }}>
            {"Retour à la connexion"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
