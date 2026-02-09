import { FlatList, Text, View, TouchableOpacity, RefreshControl } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { fetchCars } from '../../src/services/car.service';
import { Car } from '../../src/types/car';

interface Notification {
  id: number;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
  car_id?: number;
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      // Charger les voitures pour générer des notifications pertinentes
      const cars = await fetchCars();
      const generatedNotifications = generateNotificationsFromCars(cars);
      setNotifications(generatedNotifications);
    } catch (error) {
      console.error("Erreur lors du chargement des notifications:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const generateNotificationsFromCars = (cars: Car[]): Notification[] => {
    const notifs: Notification[] = [];
    let id = 1;

    cars.forEach(car => {
      // SEULEMENT notification pour voiture prête à être récupérée
      if (car.status === 'repaired') {
        notifs.push({
          id: id++,
          title: "🎉 Votre voiture est prête !",
          message: `Votre ${car.brand} ${car.model} (${car.license_plate}) est terminée et prête à être récupérée. Coût : ${car.total_price}€`,
          created_at: car.updated_at || new Date().toISOString(),
          read: false,
          type: 'success',
          car_id: car.id
        });
      }
    });

    // Trier par date (plus récent en premier)
    return notifs.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  };

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return '#28A745';
      case 'warning':
        return '#FFA500';
      case 'error':
        return '#DC3545';
      default:
        return '#007BFF';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };

  const handleNotificationPress = (notification: Notification) => {
    markAsRead(notification.id);
    
    // Naviguer vers la voiture concernée
    if (notification.car_id) {
      if (notification.type === 'success') {
        // Si la voiture est prête, aller vers le paiement
        router.push(`/payment/${notification.car_id}`);
      } else {
        // Sinon, voir les détails de la voiture
        router.push(`/car/${notification.car_id}`);
      }
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={{ padding: 20, backgroundColor: '#007BFF' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>
          {"Notifications"}
        </Text>
        <Text style={{ fontSize: 14, color: '#e6f3ff', marginTop: 5 }}>
          {unreadCount > 0 
            ? `${unreadCount} ${unreadCount === 1 ? "notification non lue" : "notifications non lues"}`
            : "Aucune nouvelle notification"
          }
        </Text>
      </View>

      {unreadCount > 0 && (
        <View style={{ padding: 20, paddingBottom: 0 }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#007BFF',
              padding: 12,
              borderRadius: 8,
              alignItems: 'center',
            }}
            onPress={markAllAsRead}
          >
            <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>
              {"Marquer tout comme lu"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              backgroundColor: item.read ? '#ffffff' : '#e6f3ff',
              margin: 10,
              padding: 15,
              borderRadius: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
              borderLeftWidth: 4,
              borderLeftColor: getNotificationColor(item.type),
            }}
            onPress={() => handleNotificationPress(item)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
              <Text style={{ fontSize: 16, marginRight: 8, marginTop: 2 }}>
                {getNotificationIcon(item.type)}
              </Text>
              <View style={{ flex: 1 }}>
                <Text style={{ 
                  fontSize: 16, 
                  fontWeight: item.read ? 'normal' : 'bold', 
                  color: '#333',
                  marginBottom: 4 
                }}>
                  {item.title}
                </Text>
                <Text style={{ fontSize: 14, color: '#666', lineHeight: 20 }}>
                  {item.message}
                </Text>
              </View>
              {!item.read && (
                <View style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#007BFF',
                  marginTop: 6,
                }} />
              )}
            </View>
            <Text style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
              {new Date(item.created_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={{ 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center', 
            paddingVertical: 60,
            paddingHorizontal: 40 
          }}>
            <Text style={{ fontSize: 48, marginBottom: 20 }}>🔔</Text>
            <Text style={{ fontSize: 18, color: '#666', textAlign: 'center', marginBottom: 20 }}>
              {"Aucune notification"}
            </Text>
            <Text style={{ fontSize: 14, color: '#999', textAlign: 'center' }}>
              {"Vous recevrez des notifications quand vos voitures seront prêtes"}
            </Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
