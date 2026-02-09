import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, View, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import { useAuth } from "../../src/context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);

  // Fonction pour vider le cache et forcer la déconnexion
  const clearCache = async () => {
    try {
      const SecureStore = require("expo-secure-store");
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("user");
      Alert.alert("Cache vidé", "Veuillez redémarrer l'application");
    } catch (error) {
      console.error("Erreur lors du vidage du cache:", error);
    }
  };

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.replace("/(tabs)");
    } catch (e: any) {
      console.log("Erreur de connexion:", e);
      Alert.alert("Erreur de connexion", e.message || "Identifiants incorrects");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f5f5f5" }}>
      <View style={{
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#007BFF' }}>
          {"Connexion"}
        </Text>
        <Text style={{ fontSize: 14, color: '#666', marginBottom: 20, textAlign: 'center' }}>
          {"Accédez à votre garage"}
        </Text>

        <Text style={{ fontSize: 16, marginBottom: 5, color: '#333' }}>{"Email"}</Text>
        <TextInput 
          value={email} 
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Entrez votre email"
          style={{
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 8,
            padding: 12,
            marginBottom: 15,
            fontSize: 16,
          }}
        />

        <Text style={{ fontSize: 16, marginBottom: 5, color: '#333' }}>{"Mot de passe"}</Text>
        <TextInput 
          value={password} 
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Entrez votre mot de passe"
          style={{
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 8,
            padding: 12,
            marginBottom: 20,
            fontSize: 16,
          }}
        />

        <TouchableOpacity 
          style={{
            backgroundColor: loading ? '#ccc' : '#007BFF',
            padding: 15,
            borderRadius: 8,
            alignItems: 'center',
            marginBottom: 15,
          }}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ActivityIndicator color="white" size="small" />
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 10 }}>
                {"Connexion..."}
              </Text>
            </View>
          ) : (
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
              {"Se connecter"}
            </Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 10 }} />
        <TouchableOpacity 
          style={{
            backgroundColor: 'transparent',
            padding: 12,
            borderRadius: 8,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#666',
          }}
          onPress={() => router.push("/(auth)/register")}
        >
          <Text style={{ color: '#666', fontSize: 14, fontWeight: '500' }}>
            {"Pas de compte ? S'inscrire"}
          </Text>
        </TouchableOpacity>

        <View style={{ marginTop: 20, padding: 15, backgroundColor: '#f8f9fa', borderRadius: 8 }}>
          <Text style={{ fontSize: 12, color: '#666', textAlign: 'center', marginBottom: 5 }}>
            {"📱 Mode démo - Identifiants de test :"}
          </Text>
          <Text style={{ fontSize: 11, color: '#999', textAlign: 'center' }}>
            test@test.com / password
          </Text>
          <Text style={{ fontSize: 11, color: '#999', textAlign: 'center' }}>
            jean@email.com / password
          </Text>
          <Text style={{ fontSize: 11, color: '#999', textAlign: 'center' }}>
            demo@demo.com / demo
          </Text>
        </View>

        <TouchableOpacity 
          style={{
            backgroundColor: '#dc3545',
            padding: 10,
            borderRadius: 8,
            alignItems: 'center',
            marginTop: 10,
          }}
          onPress={clearCache}
        >
          <Text style={{ color: 'white', fontSize: 12, fontWeight: '500' }}>
            {"🗑️ Vider le cache (si bloqué)"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
