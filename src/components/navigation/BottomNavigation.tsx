import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  homeIcon,
  logoutIcon,
  settingsIcon,
  statisticsIcon,
  timelineIcon,
} from "../../assets/icons/icons";
import { useAuth } from "../../contexts/AuthContext";
import { RootStackParamList } from "../../navigation/AppNavigator";
import TablerIcon from "../TablerIcon";

type BottomNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const BottomNavigation = () => {
  const navigation = useNavigation<BottomNavigationProp>();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigation.navigate("Login");
  };

  return (
    <View style={styles.navigation}>
      <TouchableOpacity
        style={styles.bottomNavwrap}
        onPress={handleLogout}
      >
        <View style={[styles.bottomNav, { backgroundColor: "#e6ac73" }]}>
          <TablerIcon
            xml={logoutIcon}
            width={30}
            height={30}
            strokeColor="#fff"
            fillColor="none"
          />
        </View>
        <Text>ログアウト</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.bottomNavwrap}
        onPress={() => navigation.navigate('Home')}
      >
        <View style={[styles.bottomNav, { backgroundColor: "#66cc9e", marginRight: 5 }]}>
          <TablerIcon
            xml={homeIcon}
            width={30}
            height={30}
            strokeColor="#fff"
            fillColor="none"
          />
        </View>
        <Text>ホーム</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.bottomNavwrap}
        onPress={() => navigation.navigate('Settings')}
      >
        <View style={[styles.bottomNav, { backgroundColor: "#999999", marginLeft: 5 }]}>
          <TablerIcon
            xml={settingsIcon}
            width={30}
            height={30}
            strokeColor="#fff"
            fillColor="none"
          />
        </View>
        <Text>設定</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.bottomNavwrap}
        onPress={() => navigation.navigate('Timeline')}
      >
        <View
          style={[
            styles.bottomNav,
            { backgroundColor: "rgba(137, 196, 255, 1.0)" },
          ]}
        >
          <TablerIcon
            xml={timelineIcon}
            width={30}
            height={30}
            strokeColor="#fff"
            fillColor="none"
          />
        </View>
        <Text>タイムライン</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.bottomNavwrap}
        onPress={() => navigation.navigate('Statistics')}
      >
        <View style={[styles.bottomNav, { backgroundColor: "#ac73e6" }]}>
          <TablerIcon
            xml={statisticsIcon}
            width={30}
            height={30}
            strokeColor="#fff"
            fillColor="none"
          />
        </View>
        <Text>統計</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    marginHorizontal: 10,
  },
  bottomNavwrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
  },
  bottomNav: {
    width: 45,
    height: 45,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default BottomNavigation; 