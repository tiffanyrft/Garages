import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import { addCar } from "../../src/services/car.service";

export default function AddCarScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [loading, setLoading] = useState(false);

  // États pour les réparations
  const [selectedRepairs, setSelectedRepairs] = useState<{[key: string]: boolean}>({});

  // Liste des réparations disponibles avec prix
  const repairs = [
    { id: 'frein', name: 'Frein', price: 120.00 },
    { id: 'vidange', name: 'Vidange', price: 45.50 },
    { id: 'filtre', name: 'Filtre', price: 25.00 },
    { id: 'batterie', name: 'Batterie', price: 150.00 },
    { id: 'amortisseurs', name: 'Amortisseurs', price: 300.00 },
    { id: 'embrayage', name: 'Embrayage', price: 450.00 },
    { id: 'pneus', name: 'Pneus', price: 200.00 },
    { id: 'refroidissement', name: 'Système de refroidissement', price: 350.00 },
  ];

  // Calculer le prix total
  const totalPrice = repairs.reduce((sum, repair) => {
    return sum + (selectedRepairs[repair.id] ? repair.price : 0);
  }, 0);

  // Gérer la sélection/désélection d'une réparation
  const toggleRepair = (repairId: string) => {
    setSelectedRepairs(prev => ({
      ...prev,
      [repairId]: !prev[repairId]
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!brand.trim()) {
      Alert.alert("Erreur", "Veuillez renseigner la marque de la voiture");
      return;
    }

    if (!model.trim()) {
      Alert.alert("Erreur", "Veuillez renseigner le modèle de la voiture");
      return;
    }

    if (!licensePlate.trim()) {
      Alert.alert("Erreur", "Veuillez renseigner l'immatriculation");
      return;
    }

    // Vérifier qu'au moins une réparation est sélectionnée
    const selectedRepairsList = Object.keys(selectedRepairs).filter(key => selectedRepairs[key]);
    if (selectedRepairsList.length === 0) {
      Alert.alert("Erreur", "Veuillez sélectionner au moins une réparation");
      return;
    }

    setLoading(true);
    try {
      const carData = {
        brand,
        model,
        license_plate: licensePlate.toUpperCase(),
        problem_description: `Réparations: ${selectedRepairsList.map(id => 
          repairs.find(r => r.id === id)?.name
        ).join(', ')}`,
        client_id: user?.id || 1,
        selected_repairs: selectedRepairsList, // Envoyer les réparations sélectionnées
        estimated_price: totalPrice, // Envoyer le prix estimé
      };

      const newCar = await addCar(carData);
      
      Alert.alert(
        "✅ Voiture enregistrée !",
        "Votre voiture a été enregistrée avec succès.\n\n⏳ Elle est maintenant en attente de prise en charge par le garage.\n\n🔧 Le garage la prendra en charge rapidement pour commencer la préparation.",
        [
          {
            text: "Voir mes voitures",
            onPress: () => {
              router.replace("/(tabs)/");
            }
          },
          {
            text: "Ajouter une autre voiture",
            onPress: () => {
              // Réinitialiser le formulaire
              setBrand("");
              setModel("");
              setLicensePlate("");
              setSelectedRepairs({});
              setLoading(false);
            }
          }
        ]
      );
    } catch (error) {
      console.error("Erreur lors de l'ajout de la voiture:", error);
      Alert.alert(
        "Erreur",
        error instanceof Error ? error.message : "Une erreur est survenue lors de l'ajout de la voiture"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={{ padding: 20, backgroundColor: '#007BFF' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>
          {"Ajouter une voiture"}
        </Text>
        <Text style={{ fontSize: 14, color: '#e6f3ff', marginTop: 5 }}>
          {"Déposez votre voiture pour réparation"}
        </Text>
      </View>

      <View style={{ padding: 20 }}>
        {/* Informations du véhicule */}
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
            {"Informations sur le véhicule"}
          </Text>

          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>
              {"Marque *"}
            </Text>
            <TextInput
              value={brand}
              onChangeText={setBrand}
              placeholder="Ex: Renault, Peugeot, BMW..."
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
                backgroundColor: '#f9f9f9',
              }}
            />
          </View>

          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>
              {"Modèle *"}
            </Text>
            <TextInput
              value={model}
              onChangeText={setModel}
              placeholder="Ex: Clio, 308, Série 3..."
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
                backgroundColor: '#f9f9f9',
              }}
            />
          </View>

          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>
              {"Immatriculation *"}
            </Text>
            <TextInput
              value={licensePlate}
              onChangeText={setLicensePlate}
              placeholder="Ex: AB-123-CD"
              autoCapitalize="characters"
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
                backgroundColor: '#f9f9f9',
              }}
            />
            <Text style={{ fontSize: 12, color: '#999', marginTop: 5 }}>
              {"Format: AB-123-CD"}
            </Text>
          </View>
        </View>

        {/* Section des réparations */}
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
            {"Réparations nécessaires *"}
          </Text>
          
          <Text style={{ fontSize: 12, color: '#666', marginBottom: 15 }}>
            {"Sélectionnez une ou plusieurs réparations :"}
          </Text>

          {repairs.map((repair) => (
            <TouchableOpacity
              key={repair.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 12,
                marginBottom: 8,
                backgroundColor: selectedRepairs[repair.id] ? '#e6f3ff' : '#f9f9f9',
                borderRadius: 8,
                borderWidth: 1,
                borderColor: selectedRepairs[repair.id] ? '#007BFF' : '#ddd',
              }}
              onPress={() => toggleRepair(repair.id)}
            >
              <View style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                borderWidth: 2,
                borderColor: selectedRepairs[repair.id] ? '#007BFF' : '#ccc',
                backgroundColor: selectedRepairs[repair.id] ? '#007BFF' : 'transparent',
                marginRight: 12,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                {selectedRepairs[repair.id] && (
                  <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>✓</Text>
                )}
              </View>
              
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, color: '#333', fontWeight: '500' }}>
                  {repair.name}
                </Text>
              </View>
              
              <Text style={{ fontSize: 16, color: '#007BFF', fontWeight: 'bold' }}>
                {repair.price.toFixed(2)}€
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Section du prix total */}
        {totalPrice > 0 && (
          <View style={{
            backgroundColor: '#28A745',
            padding: 15,
            borderRadius: 10,
            marginBottom: 20,
            alignItems: 'center',
          }}>
            <Text style={{ fontSize: 14, color: 'white', marginBottom: 5 }}>
              {"Prix total estimé"}
            </Text>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>
              {totalPrice.toFixed(2)}€
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={{
            backgroundColor: loading ? '#ccc' : '#007BFF',
            padding: 18,
            borderRadius: 10,
            alignItems: 'center',
            marginBottom: 15,
          }}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ActivityIndicator color="white" size="small" />
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 10 }}>
                {"Enregistrement en cours..."}
              </Text>
            </View>
          ) : (
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
              {"Déposer ma voiture"}
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
