import React from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import Header from "../components/layout/Header";
import BottomNavigation from "../components/navigation/BottomNavigation";
import styles from "../styles/MeasurementScreenStyles";

const MeasurementScreen = () => {
  const headerProps = {
    babyName: "まきちゃん",
    ageInDays: 30,
    participants: [
      { name: "ゆか", color: "#FFF" },
      { name: "けん", color: "blue" }
    ]
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
          <View>測定</View>
        </View>
      </ScrollView>
      <BottomNavigation />
    </SafeAreaView>
  );
};

export default MeasurementScreen; 