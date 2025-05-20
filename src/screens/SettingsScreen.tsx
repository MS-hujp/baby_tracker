import React from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { settingsIcon } from "../assets/icons/icons";
import TablerIcon from "../components/TablerIcon";
import Header from "../components/layout/Header";
import BottomNavigation from "../components/navigation/BottomNavigation";
import styles from "../styles/SettingsScreenStyles";

const SettingsScreen: React.FC = () => {
  const headerProps = {
    babyName: "まきちゃん",
    ageInDays: 30,
    participants: [
      { name: "ゆか", color: "#FFF" },
      { name: "けん", color: "blue" },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 20 }}
        bounces={true}
        showsVerticalScrollIndicator={true}
        alwaysBounceVertical={true}
      >
        <View style={styles.innerContainer}>
          <Header {...headerProps} />
          <View style={styles.content}>
            <View style={styles.titleContainer}>
              <View style={styles.titleIcon}>
                <TablerIcon xml={settingsIcon} width={30} height={30} strokeColor="#FFF" fillColor="none" />
              </View>
              <Text style={styles.titleText}>設定</Text>
            </View>
            
            <View style={styles.settingsContainer}>
              <Text style={styles.settingsText}>設定画面は現在準備中です。</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <BottomNavigation />
    </SafeAreaView>
  );
};

export default SettingsScreen; 