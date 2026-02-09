npx create-expo-app .


npx expo start

🔹 Si le fichier est App.js
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Bonjour 👋 Expo fonctionne !</Text>
    </View>
  );
}



🔹 Si le fichier est app/index.tsx
import { Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Bonjour 👋 Expo fonctionne !</Text>
    </View>
  );
}
