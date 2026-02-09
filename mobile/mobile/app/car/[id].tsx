import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Car, getStatusText, getStatusColor } from "../../src/types/car";
import { getCarById, processPayment } from "../../src/services/car.service";

export default function CarDetailScreen() {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const router = useRouter();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    if (id) {
      loadCar(Number(id));
    }
  }, [id]);

  const loadCar = async (carId: number) => {
    try {
      const data = await getCarById(carId);
      setCar(data);
    } catch (error) {
      console.error("Erreur lors du chargement de la voiture:", error);
      Alert.alert("Erreur", "Impossible de charger les détails de la voiture");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!car) return;

    setPaymentLoading(true);
    try {
      await processPayment(car.id);
      Alert.alert(
        "Paiement réussi",
        "Le paiement a été effectué avec succès. Vous pouvez récupérer votre voiture.",
        [
          {
            text: "OK",
            onPress: () => {
              loadCar(car.id);
              router.back();
            }
          }
        ]
      );
    } catch (error) {
      console.error("Erreur lors du paiement:", error);
      Alert.alert("Erreur", "Le paiement a échoué. Veuillez réessayer.");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={{ marginTop: 10, color: '#666' }}>{"Chargement des détails..."}</Text>
      </View>
    );
  }

  if (!car) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 16, color: '#666' }}>{"Voiture non trouvée"}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={{ padding: 20, backgroundColor: '#007BFF' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>
          {car.brand} {" "} {car.model}
        </Text>
        <Text style={{ fontSize: 16, color: '#e6f3ff', marginTop: 5 }}>
          {car.license_plate}
        </Text>
      </View>

      <View style={{ padding: 20 }}>
        <View style={{
          backgroundColor: 'white',
          padding: 15,
          borderRadius: 10,
          marginBottom: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#333' }}>
            {"Statut actuel"}
          </Text>
          <Text style={{ fontSize: 12, color: '#999', marginBottom: 5 }}>
            {"Debug: " + car.status}
          </Text>
          <View style={{
            backgroundColor: getStatusColor(car.status),
            paddingHorizontal: 15,
            paddingVertical: 8,
            borderRadius: 20,
            alignSelf: 'flex-start',
          }}>
            <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>
              {getStatusText(car.status)}
            </Text>
          </View>
        </View>

        <View style={{
          backgroundColor: 'white',
          padding: 15,
          borderRadius: 10,
          marginBottom: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#333' }}>
            {"Problème signalé"}
          </Text>
          <Text style={{ fontSize: 14, color: '#666', lineHeight: 20 }}>
            {car.problem_description}
          </Text>
        </View>

        {car.repairs && car.repairs.length > 0 && (
          <View style={{
            backgroundColor: 'white',
            padding: 15,
            borderRadius: 10,
            marginBottom: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#333' }}>
              {"Réparations effectuées"}
            </Text>
            {car.repairs.map((repair, index) => (
              <View key={repair.id} style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 10,
                borderBottomWidth: index < car.repairs.length - 1 ? 1 : 0,
                borderBottomColor: '#eee',
              }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, color: '#333' }}>
                    {repair.description}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
                    {"Durée:"} {repair.duration}{"h"}
                  </Text>
                </View>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#007BFF' }}>
                  {repair.price}{"€"}
                </Text>
              </View>
            ))}
          </View>
        )}

        {car.total_price && car.total_price > 0 && (
          <View style={{
            backgroundColor: '#28A745',
            padding: 20,
            borderRadius: 15,
            marginBottom: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white', marginBottom: 10, textAlign: 'center' }}>
              {"💰 COÛT TOTAL DES RÉPARATIONS"}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>
                {"Total à payer"}
              </Text>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>
                {car.total_price.toFixed(2)}{"€"}
              </Text>
            </View>
            
            {car.status === 'repaired' && (
              <Text style={{ fontSize: 12, color: 'white', marginTop: 10, textAlign: 'center', fontStyle: 'italic' }}>
                {"✅ Réparations terminées - Prêt pour le paiement"}
              </Text>
            )}
            
            {car.status === 'paid' && (
              <Text style={{ fontSize: 12, color: 'white', marginTop: 10, textAlign: 'center', fontStyle: 'italic' }}>
                {"✅ Payé - Voiture récupérable"}
              </Text>
            )}
          </View>
        )}

        {car.estimated_duration && (
          <View style={{
            backgroundColor: 'white',
            padding: 15,
            borderRadius: 10,
            marginBottom: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#333' }}>
              {"Durée estimée"}
            </Text>
            <Text style={{ fontSize: 14, color: '#666' }}>
              {car.estimated_duration} {"heures"}
            </Text>
          </View>
        )}

        {car.status === 'repaired' && car.total_price && car.total_price > 0 && (
          <TouchableOpacity
            style={{
              backgroundColor: '#007BFF',
              padding: 18,
              borderRadius: 15,
              alignItems: 'center',
              marginBottom: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
            onPress={handlePayment}
            disabled={paymentLoading}
          >
            {paymentLoading ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ActivityIndicator color="white" size="small" />
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 10 }}>
                  {"Paiement en cours..."}
                </Text>
              </View>
            ) : (
              <View>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>
                  {"💳 PAYER MAINTENANT"}
                </Text>
                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                  {car.total_price.toFixed(2)}{"€"}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}

        {car.status === 'paid' && (
          <View style={{
            backgroundColor: '#6C757D',
            padding: 15,
            borderRadius: 10,
            alignItems: 'center',
          }}>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
              {"Voiture récupérée"}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
