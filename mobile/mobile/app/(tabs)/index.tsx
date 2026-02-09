import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { fetchCars } from '../../src/services/car.service';
import { Car } from '../../src/types/car';
import { useAuth } from '../../src/context/AuthContext';

export default function Home() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    loadCars();
  }, []);

  // Rafraîchir quand l'écran devient focus
  useFocusEffect(
    useCallback(() => {
      console.log("🔄 Rafraîchissement de l'accueil");
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
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadCars();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
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
      case 'pending':
        return 'En attente';
      case 'in_repair':
        return 'En réparation';
      case 'repaired':
        return 'Terminée';
      case 'paid':
        return 'Récupérée';
      default:
        return 'Inconnu';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'in_repair':
        return '🔧';
      case 'repaired':
        return '✅';
      case 'paid':
        return '🚗';
      default:
        return '❓';
    }
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
        borderLeftWidth: 4,
        borderLeftColor: getStatusColor(item.status),
      }}
      onPress={() => router.push(`/car/${item.id}`)}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>
            {item.brand} {" "} {item.model}
          </Text>
          <Text style={{ fontSize: 14, color: '#666', marginTop: 2 }}>
            {item.license_plate}
          </Text>
        </View>
        <View style={{
          backgroundColor: getStatusColor(item.status),
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 15,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Text style={{ color: 'white', fontSize: 12, marginRight: 5 }}>
            {getStatusIcon(item.status)}
          </Text>
          <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>
      
      <Text style={{ fontSize: 12, color: '#999', fontStyle: 'italic', marginBottom: 10 }}>
        {item.problem_description}
      </Text>
      
      {item.total_price && item.total_price > 0 && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 14, color: '#666' }}>
            {"Coût estimé"}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#007BFF' }}>
            {item.total_price}{"€"}
          </Text>
        </View>
      )}
      
      {item.status === 'repaired' && (
        <TouchableOpacity
          style={{
            backgroundColor: '#28A745',
            padding: 10,
            borderRadius: 8,
            alignItems: 'center',
            marginTop: 10,
          }}
          onPress={() => router.push(`/payment/${item.id}`)}
        >
          <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>
            {"Voir le coût et payer"}
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  // Grouper les voitures par statut
  const waitingCars = cars.filter(car => car.status === 'pending');
  const inRepairCars = cars.filter(car => car.status === 'in_repair');
  const repairedCars = cars.filter(car => car.status === 'repaired');

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 16, color: '#666' }}>{"Chargement..."}</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: '#f5f5f5' }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={{ padding: 20, backgroundColor: '#007BFF' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>
              {"Bonjour"} {" "} {user?.name?.split(' ')[0] || ''} ! 👋
            </Text>
            <Text style={{ fontSize: 14, color: '#e6f3ff', marginTop: 5 }}>
              {"Suivez l'état de vos véhicules"}
            </Text>
          </View>
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            padding: 15,
            borderRadius: 50,
          }}>
            <Text style={{ fontSize: 24 }}>🚗</Text>
          </View>
        </View>
      </View>

      {/* Statistiques */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginTop: -10 }}>
        <View style={{
          backgroundColor: 'white',
          flex: 1,
          padding: 15,
          borderRadius: 15,
          marginHorizontal: 5,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FFA500' }}>
            {waitingCars.length}
          </Text>
          <Text style={{ fontSize: 11, color: '#666', textAlign: 'center' }}>
            {"En attente"}
          </Text>
        </View>
        
        <View style={{
          backgroundColor: 'white',
          flex: 1,
          padding: 15,
          borderRadius: 15,
          marginHorizontal: 5,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#007BFF' }}>
            {inRepairCars.length}
          </Text>
          <Text style={{ fontSize: 11, color: '#666', textAlign: 'center' }}>
            {"En réparation"}
          </Text>
        </View>
        
        <View style={{
          backgroundColor: 'white',
          flex: 1,
          padding: 15,
          borderRadius: 15,
          marginHorizontal: 5,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#28A745' }}>
            {repairedCars.length}
          </Text>
          <Text style={{ fontSize: 11, color: '#666', textAlign: 'center' }}>
            {"Terminées"}
          </Text>
        </View>
      </View>

      {/* Bouton pour ajouter une voiture */}
      <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#007BFF',
            padding: 15,
            borderRadius: 15,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
          onPress={() => router.push("/add-car")}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
            {"➕ Déposer une nouvelle voiture"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Section des voitures */}
      <View style={{ paddingHorizontal: 20, marginTop: 30 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 15 }}>
          {"🚗 Mes voitures"}
        </Text>
        
        {cars.length === 0 ? (
          <View style={{
            backgroundColor: 'white',
            padding: 40,
            borderRadius: 15,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}>
            <Text style={{ fontSize: 48, marginBottom: 10 }}>🚙</Text>
            <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 20 }}>
              {"Aucune voiture déposée pour le moment"}
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: '#007BFF',
                padding: 12,
                borderRadius: 8,
                paddingHorizontal: 20,
              }}
              onPress={() => router.push("/add-car")}
            >
              <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>
                {"Déposer ma première voiture"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={cars}
            renderItem={renderCar}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        )}
      </View>

      {/* Espace en bas */}
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}
