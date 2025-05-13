import React from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import Header from "../components/layout/Header";
import BottomNavigation from "../components/navigation/BottomNavigation";
import styles from "../styles/FeedingScreenStyles";

const FeedingScreen = () => {
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
          {/* ここに授乳記録のフォームやコンテンツを追加 */}
          
        </View>

        <Text>授乳記録ページです</Text>


      </ScrollView>
      <BottomNavigation />
    </SafeAreaView>
  );
};

export default FeedingScreen; 