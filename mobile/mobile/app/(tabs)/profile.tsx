import { Alert, Button, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { useAuth } from "../../src/context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    console.log("🔐 Bouton déconnexion cliqué !");
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Se déconnecter",
          onPress: () => {
            console.log("🔐 Option 'Se déconnecter' cliquée, appel de logout()");
            try {
              logout();
              console.log("✅ logout() exécuté avec succès");
            } catch (error) {
              console.error("❌ Erreur lors de logout():", error);
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={{ padding: 20, backgroundColor: '#007BFF' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>
          {"Profil"}
        </Text>
        <Text style={{ fontSize: 14, color: '#e6f3ff', marginTop: 5 }}>
          {"Gérez vos informations personnelles"}
        </Text>
      </View>

      <View style={{ padding: 20 }}>
        <View style={{
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 15,
          marginBottom: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: '#333' }}>
            {"Informations personnelles"}
          </Text>
          
          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>
              {"Nom complet"}
            </Text>
            <Text style={{ fontSize: 16, color: '#333', fontWeight: '500' }}>
              {user?.name || 'Non renseigné'}
            </Text>
          </View>

          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>
              {"Email"}
            </Text>
            <Text style={{ fontSize: 16, color: '#333', fontWeight: '500' }}>
              {user?.email || 'Non renseigné'}
            </Text>
          </View>

          <View>
            <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>
              {"ID Utilisateur"}
            </Text>
            <Text style={{ fontSize: 16, color: '#333', fontWeight: '500' }}>
              {user?.id || 'Non disponible'}
            </Text>
          </View>
        </View>

        <View style={{
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 15,
          marginBottom: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' }}>
            {"Application"}
          </Text>
          
          <TouchableOpacity style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 10,
          }}>
            <Text style={{ fontSize: 16, color: '#333' }}>
              {"Version"}
            </Text>
            <Text style={{ fontSize: 14, color: '#666' }}>
              {"1.0.0"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: '#dc3545',
            padding: 15,
            borderRadius: 10,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
          onPress={handleLogout}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
            {"Se déconnecter"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
