import React from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { diaperIcon } from "../assets/icons/icons";
import Header from "../components/layout/Header";
import BottomNavigation from "../components/navigation/BottomNavigation";
import TablerIcon from "../components/TablerIcon";
import styles from "../styles/DiaperScreenStyles";

const DiaperScreen = () => {
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
          <TablerIcon
            xml={diaperIcon}
            width={30}
            height={30}
            strokeColor="#FFF"
            fillColor="none"
            strokeWidth={1.5}
          />
          おむつ交換
        </View>
      </ScrollView>
      <BottomNavigation />
    </SafeAreaView>
  );
};

export default DiaperScreen;
