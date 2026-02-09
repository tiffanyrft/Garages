import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#007BFF',
      tabBarInactiveTintColor: '#8e8e93',
      tabBarStyle: {
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e6e6e6',
      },
    }}>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: "Accueil",
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>{"🏠"}</Text>
          ),
        }} 
      />
      <Tabs.Screen 
        name="cars" 
        options={{ 
          title: "Voitures",
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>{"🚗"}</Text>
          ),
        }} 
      />
      <Tabs.Screen 
        name="add-car" 
        options={{ 
          title: "Ajouter",
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>{"➕"}</Text>
          ),
          href: "/(tabs)/add-car",
        }} 
      />
      <Tabs.Screen 
        name="notifications" 
        options={{ 
          title: "Notifications",
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>{"🔔"}</Text>
          ),
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: "Profil",
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>{"👤"}</Text>
          ),
        }} 
      />
    </Tabs>
  );
}
