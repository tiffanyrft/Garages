import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { fetchCars } from '../../src/services/car.service';
import { Car } from '../../src/types/car';
import { startAutomaticRepairProcess, updateCarStatus } from '../../src/services/status.service';

export default function Cars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadCars();
  }, []);

  // Rafraîchir quand l'écran devient focus (quand on navigue vers cet écran)
  useFocusEffect(
    useCallback(() => {
      console.log("🔄 Rafraîchissement de la liste des voitures");
      loadCars();
    }, [])
  );

  const loadCars = async () => {
    try {
      const data = await fetchCars();
      setCars(data);
    } catch (error) {
      console.error("Erreur lors du chargement des voitures:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshCars = async () => {
    setLoading(true);
    await loadCars();
  };

  const onRefresh = () => {
    loadCars();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return '#FFA500'; // Orange
      case 'in_repair':
        return '#007BFF'; // Bleu
      case 'repaired':
        return '#28A745'; // Vert
      case 'paid':
        return '#6C757D'; // Gris
      default:
        return '#DC3545'; // Rouge
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'En attente';
      case 'in_repair':
        return 'En préparation';
      case 'repaired':
        return 'Prête';
      case 'paid':
        return 'Récupérée';
      default:
        return 'Inconnu';
    }
  };

  const startAutomaticRepairForTest = (carId: number) => {
    Alert.alert(
      "🔧 Démarrer Préparation",
      "Cette voiture est en attente. Voulez-vous que le garage commence la préparation ?\n\n⏰ Timeline:\n• Immédiat: En préparation (garage travaille)\n• 12s: Prête → 🎉 NOTIFICATION AUTOMATIQUE !\n\nLa voiture doit être en préparation pour être prête.",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Commencer préparation",
          onPress: () => {
            try {
              // Démarrer directement à l'étape "en réparation"
              setTimeout(() => {
                updateCarStatus(carId, 'in_repair');
                console.log(`🔧 Le garage commence la préparation de la voiture ${carId}...`);
              }, 1000);
              
              // Puis la rendre prête après 12 secondes
              setTimeout(() => {
                console.log(`🎉 La préparation de la voiture ${carId} est terminée !`);
                updateCarStatus(carId, 'repaired');
                console.log(`✅ NOTIFICATION AUTOMATIQUE ENVOYÉE pour voiture ${carId} prête !`);
              }, 13000); // 13 secondes total
              
              Alert.alert(
                "🔧 Préparation démarrée !",
                "Le garage a commencé la préparation de votre voiture.\n\n⏳ Dans 12 secondes, vous recevrez la notification que votre voiture est prête !\n\n📱 Restez sur l'application.",
                [{ text: "OK", style: "default" }]
              );
            } catch (error) {
              Alert.alert("Erreur", "Impossible de démarrer la préparation");
            }
          }
        }
      ]
    );
  };

  const renderCar = ({ item }: { item: Car }) => (
    <TouchableOpacity
      style={{
        backgroundColor: 'white',
        margin: 10,
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
      onPress={() => router.push(`/car/${item.id}`)}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>
            {item.brand} {item.model}
          </Text>
          <Text style={{ fontSize: 14, color: '#666', marginTop: 5 }}>
            {item.license_plate}
          </Text>
          <Text style={{ fontSize: 12, color: '#999', marginTop: 5 }}>
            {item.problem_description}
          </Text>
        </View>
        <View style={{
          backgroundColor: getStatusColor(item.status),
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 15,
        }}>
          <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>
      
      {item.total_price && (
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#007BFF', marginTop: 10 }}>
          {"Total:"} {" "} {item.total_price}{"€"}
        </Text>
      )}
      
      {/* Bouton de test pour démarrer processus automatique */}
      {item.status !== 'repaired' && item.status !== 'paid' && (
        <TouchableOpacity
          style={{
            backgroundColor: '#28A745',
            padding: 8,
            borderRadius: 6,
            alignItems: 'center',
            marginTop: 10,
          }}
          onPress={() => startAutomaticRepairForTest(item.id)}
        >
          <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
            {"🔧 Commencer préparation"}
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={{ marginTop: 10, color: '#666' }}>{"Chargement des voitures..."}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={{ padding: 20, backgroundColor: '#007BFF' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>
          {"Mes Voitures"}
        </Text>
        <Text style={{ fontSize: 14, color: '#e6f3ff', marginTop: 5 }}>
          {"Suivez l'état de vos réparations"}
        </Text>
      </View>
      
      <View style={{ padding: 20 }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#28A745',
            padding: 15,
            borderRadius: 10,
            alignItems: 'center',
            marginBottom: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
          onPress={() => router.push("/add-car")}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
            ➕ Ajouter une voiture
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: '#007BFF',
            padding: 12,
            borderRadius: 8,
            alignItems: 'center',
            marginBottom: 20,
          }}
          onPress={refreshCars}
        >
          <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>
            🔄 Rafraîchir la liste
          </Text>
        </TouchableOpacity>
      </View>
      
      {cars.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 }}>
          <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 20 }}>
            {"Aucune voiture trouvée"}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: '#007BFF',
              padding: 15,
              borderRadius: 10,
              alignItems: 'center',
              paddingHorizontal: 30,
            }}
            onPress={() => router.push("/add-car")}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
              {"Déposer ma première voiture"}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={cars}
          renderItem={renderCar}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}
