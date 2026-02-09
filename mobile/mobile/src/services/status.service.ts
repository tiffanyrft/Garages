import { Car } from '../types/car';
import { mockCars } from './mock.service';
import { sendCarReadyNotification } from './notification.service';

// Fonction pour simuler le changement de statut d'une voiture (pour les tests)
export const updateCarStatus = (carId: number, newStatus: 'pending' | 'in_repair' | 'repaired' | 'paid'): Car => {
  const carIndex = mockCars.findIndex(car => car.id === carId);
  if (carIndex === -1) {
    throw new Error("Voiture non trouvée");
  }

  // Mettre à jour le statut
  mockCars[carIndex].status = newStatus;
  mockCars[carIndex].updated_at = new Date().toISOString();

  // Si la voiture est réparée, ajouter un coût et des réparations ET envoyer une notification
  if (newStatus === 'repaired') {
    mockCars[carIndex].total_price = Math.floor(Math.random() * 500) + 150; // 150-650€
    mockCars[carIndex].repairs = [
      {
        id: 1,
        car_id: carId,
        description: "Diagnostic complet",
        duration: 1,
        price: 50
      },
      {
        id: 2,
        car_id: carId,
        description: "Réparation moteur",
        duration: 3,
        price: Math.floor(Math.random() * 300) + 100
      },
      {
        id: 3,
        car_id: carId,
        description: "Pièces et main d'œuvre",
        duration: 2,
        price: Math.floor(Math.random() * 200) + 50
      }
    ];

    // 🎉 ENVOYER LA NOTIFICATION AUTOMATIQUEMENT
    const updatedCar = mockCars[carIndex];
    console.log(`🔔 ENVOI NOTIFICATION: Voiture ${updatedCar.brand} ${updatedCar.model} prête !`);
    sendCarReadyNotification(updatedCar);
  }

  // Si la voiture est payée, marquer comme récupérée
  if (newStatus === 'paid') {
    mockCars[carIndex].status = 'paid';
  }

  console.log(`Mock: Voiture ${carId} mise à jour -> ${newStatus}`);
  return mockCars[carIndex];
};

// 🚀 Processus réaliste de réparation (plus lent pour le test)
export const startAutomaticRepairProcess = (carId: number) => {
  console.log(`🔧 Démarrage processus RÉALISTE pour voiture ${carId}`);
  
  // Étape 1: La voiture reste en attente (garage doit la prendre)
  setTimeout(() => {
    try {
      console.log(`⏳ Voiture ${carId} en attente de prise en charge par le garage...`);
      // La voiture reste en statut 'waiting' - le garage doit l'accepter
    } catch (error) {
      console.error("Erreur lors de l'attente:", error);
    }
  }, 2000); // 2 secondes

  // Étape 2: Le garage prend la voiture et commence la réparation
  setTimeout(() => {
    try {
      updateCarStatus(carId, 'in_repair');
      console.log(`🔧 Le garage a pris la voiture ${carId} et commence la réparation...`);
    } catch (error) {
      console.error("Erreur lors du passage en réparation:", error);
    }
  }, 8000); // 8 secondes après l'ajout

  // Étape 3: La réparation est terminée → NOTIFICATION AUTOMATIQUE
  setTimeout(() => {
    try {
      console.log(`🎉 La réparation de la voiture ${carId} est terminée !`);
      updateCarStatus(carId, 'repaired');
      console.log(`✅ NOTIFICATION AUTOMATIQUE ENVOYÉE pour voiture ${carId} prête !`);
    } catch (error) {
      console.error("Erreur lors du passage à 'prête':", error);
    }
  }, 20000); // 20 secondes après l'ajout (réparation réaliste)
};

// Fonctions utilitaires pour les tests
export const simulateCarReady = (carId: number) => updateCarStatus(carId, 'repaired');
export const simulateCarPaid = (carId: number) => updateCarStatus(carId, 'paid');
