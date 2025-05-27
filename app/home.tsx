import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import HomeScreen from "../src/screens/HomeScreen";

export default function HomePage() {
  const router = useRouter();

  const handleNavigation = (screen: string) => {
    // 画面名を小文字に変換し、型安全なルーティングを実装
    switch (screen.toLowerCase()) {
      case 'home':
        router.replace('/home');
        break;
      case 'feeding':
        router.replace('/');
        break;
      case 'diaper':
        router.replace('/');
        break;
      case 'sleep':
        router.replace('/');
        break;
      case 'wakeup':
        router.replace('/');
        break;
      case 'measurement':
        router.replace('/');
        break;
      case 'statistics':
        router.replace('/');
        break;
      case 'timeline':
        router.replace('/');
        break;
      case 'settings':
        router.replace('/');
        break;
      case 'login':
        router.replace('/');
        break;
      default:
        console.warn(`Unknown route: ${screen}`);
        break;
    }
  };

  return (
    <View style={styles.container}>
      <HomeScreen onNavigate={handleNavigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 