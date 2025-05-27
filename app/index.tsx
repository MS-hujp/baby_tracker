import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import LoginScreen from "../src/screens/LoginScreen";

export default function Index() {
  const router = useRouter();

  const handleLogin = () => {
    router.replace("/home");
  };

  return (
    <View style={styles.container}>
      <LoginScreen onLogin={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
