import { Alert, Platform } from 'react-native';

// Service de notifications locales (sans dépendances externes)
export class NotificationService {
  private static instance: NotificationService;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Envoyer une notification quand une voiture est prête
  async sendCarReadyNotification(car: any) {
    try {
      // Calculer le prix total si non défini
      const totalPrice = car.total_price || car.estimated_price || 0;
      const formattedPrice = totalPrice > 0 ? `${totalPrice.toFixed(2)}€` : 'Coût à déterminer';
      
      // Afficher une alerte immédiate dans l'app
      Alert.alert(
        "🎉 Votre voiture est prête !",
        `Votre ${car.brand} ${car.model} (${car.license_plate}) est terminée et prête à être récupérée.\n\n💰 Coût : ${formattedPrice}\n\n📱 Allez dans l'onglet Notifications pour payer.`,
        [
          {
            text: "Voir maintenant",
            onPress: () => {
              console.log("Navigation vers les notifications");
              // La navigation sera gérée par l'écran appelant
            }
          },
          {
            text: "Plus tard",
            style: "cancel"
          }
        ],
        { cancelable: false }
      );

      // Simuler une notification système (console pour le moment)
      console.log(`🔔 NOTIFICATION SYSTÈME: Votre ${car.brand} ${car.model} est prête !`);
      console.log(`📱 Message: Votre voiture est terminée et prête à être récupérée. Coût: ${formattedPrice}`);
      
      // Sur mobile, cela pourrait déclencher une vraie notification push
      if (Platform.OS === 'android' || Platform.OS === 'ios') {
        console.log(`📲 Notification push envoyée à l'appareil`);
      }

      return true;
    } catch (error) {
      console.error("Erreur lors de l'envoi de la notification:", error);
      return false;
    }
  }

  // Envoyer une notification de paiement réussi
  async sendPaymentSuccessNotification(car: any) {
    try {
      Alert.alert(
        "✅ Paiement réussi !",
        `Votre ${car.brand} ${car.model} est payée. Vous pouvez la récupérer au garage !\n\n📍 Présentez cette confirmation au garage.`,
        [
          {
            text: "OK",
            style: "default"
          }
        ]
      );

      console.log(`🔔 NOTIFICATION SYSTÈME: Paiement réussi pour ${car.brand} ${car.model}`);
      console.log(`📱 Message: Votre voiture est payée. Vous pouvez la récupérer au garage !`);

      return true;
    } catch (error) {
      console.error("Erreur lors de l'envoi de la notification de paiement:", error);
      return false;
    }
  }

  // Initialiser le service
  async initialize() {
    console.log("📱 Service de notifications initialisé");
    console.log("🔔 Les notifications apparaîtront quand les voitures seront prêtes");
    return true;
  }
}

// Export singleton
export const notificationService = NotificationService.getInstance();

// Fonctions pratiques pour compatibilité
export const sendCarReadyNotification = (car: any) => 
  notificationService.sendCarReadyNotification(car);

export const sendPaymentSuccessNotification = (car: any) => 
  notificationService.sendPaymentSuccessNotification(car);

export const initializeNotifications = () => 
  notificationService.initialize();