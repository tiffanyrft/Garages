import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Car } from "../../src/types/car";
import { getCarById, processPayment } from "../../src/services/car.service";

export default function PaymentScreen() {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
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

    setProcessing(true);
    try {
      await processPayment(car.id);
      Alert.alert(
        "Paiement réussi !",
        "Votre paiement a été traité avec succès. Vous pouvez maintenant récupérer votre voiture au garage.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)/cars")
          }
        ]
      );
    } catch (error) {
      console.error("Erreur lors du paiement:", error);
      Alert.alert("Erreur de paiement", "Le paiement a échoué. Veuillez réessayer.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={{ marginTop: 10, color: '#666' }}>{"Chargement..."}</Text>
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
          {"Paiement"}
        </Text>
        <Text style={{ fontSize: 14, color: '#e6f3ff', marginTop: 5 }}>
          {"Finalisez le paiement pour récupérer votre voiture"}
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
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' }}>
            {"Détails du véhicule"}
          </Text>
          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 14, color: '#666' }}>{"Véhicule"}</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
              {car.brand} {" "} {car.model}
            </Text>
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 14, color: '#666' }}>{"Immatriculation"}</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
              {car.license_plate}
            </Text>
          </View>
        </View>

        {car.repairs && car.repairs.length > 0 && (
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

        <View style={{
          backgroundColor: '#28A745',
          padding: 20,
          borderRadius: 15,
          marginBottom: 30,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
          <Text style={{ fontSize: 16, color: 'white', marginBottom: 5 }}>
            {"Montant total à payer"}
          </Text>
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'white' }}>
            {car.total_price}{"€"}
          </Text>
        </View>

        <View style={{
          backgroundColor: 'white',
          padding: 15,
          borderRadius: 10,
          marginBottom: 20,
          borderLeftWidth: 4,
          borderLeftColor: '#FFA500',
        }}>
          <Text style={{ fontSize: 14, color: '#666', fontStyle: 'italic' }}>
            {"💡"} {"Simulation de paiement : Cliquez sur"} {"Payer maintenant"} {"pour simuler le traitement du paiement. Aucune transaction réelle ne sera effectuée."}
          </Text>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: processing ? '#ccc' : '#007BFF',
            padding: 18,
            borderRadius: 10,
            alignItems: 'center',
            marginBottom: 15,
          }}
          onPress={handlePayment}
          disabled={processing}
        >
          {processing ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ActivityIndicator color="white" size="small" />
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 10 }}>
                {"Traitement en cours..."}
              </Text>
            </View>
          ) : (
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
              {"Payer maintenant"} {" "} {car.total_price}{"€"}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: '#f8f9fa',
            padding: 15,
            borderRadius: 10,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#dee2e6',
          }}
          onPress={() => router.back()}
        >
          <Text style={{ color: '#6c757d', fontSize: 14, fontWeight: 'bold' }}>
            {"Annuler"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
