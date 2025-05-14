import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { babyBottleIcon, milkCanIcon, motherIcon } from "../assets/icons/icons";
import Header from "../components/layout/Header";
import BottomNavigation from "../components/navigation/BottomNavigation";
import TablerIcon from "../components/TablerIcon";
import styles from "../styles/FeedingScreenStyles";

const FeedingScreen = () => {
  const [selectedFeedings, setSelectedFeedings] = useState({
    motherMilk: false,
    formulaMilk: false,
  });
  const [selectedTime, setSelectedTime] = useState(new Date());

  const headerProps = {
    babyName: "まきちゃん",
    ageInDays: 30,
    participants: [
      { name: "ゆか", color: "#FFF" },
      { name: "けん", color: "blue" },
    ],
  };

  const toggleFeeding = (type: 'motherMilk' | 'formulaMilk') => {
    setSelectedFeedings(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setSelectedTime(selectedDate);
    }
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
          <View style={styles.recordSectionContainer}>
            <View style={styles.recordSectionTitle}>
              <View style={styles.mealIcon}>
                <TablerIcon
                  xml={babyBottleIcon}
                  width={30}
                  height={30}
                  strokeColor="#FFF"
                  fillColor="none"
                />
              </View>
              <Text style={styles.recordSectionTitleText}>記録</Text>
            </View>

            <View style={styles.recordMotherOrMilk}>
              <Pressable 
                style={[styles.motherSection, selectedFeedings.motherMilk && styles.selectedSection]} 
                onPress={() => toggleFeeding('motherMilk')}
              >
                <View style={styles.checkbox}>
                  {selectedFeedings.motherMilk && <View style={styles.checkboxInner} />}
                </View>
                <View style={styles.motherIcon}>
                  <TablerIcon
                    xml={motherIcon}
                    width={30}
                    height={30}
                    strokeColor="#FFF"
                    fillColor="none"
                  />
                </View>
                <Text style={styles.motherIconText}>母乳</Text>
              </Pressable>

              <Pressable 
                style={[styles.milkSection, selectedFeedings.formulaMilk && styles.selectedSection]}
                onPress={() => toggleFeeding('formulaMilk')}
              >
                <View style={styles.checkbox}>
                  {selectedFeedings.formulaMilk && <View style={styles.checkboxInner} />}
                </View>
                <View style={styles.milkIcon}>
                  <TablerIcon
                    xml={milkCanIcon}
                    width={30}
                    height={30}
                    strokeColor="#FFF"
                    fillColor="none"
                  />
                </View>
                <Text style={styles.milkIconText}>ミルク</Text>
              </Pressable>
            </View>

            <View style={styles.timePickerSection}>
              <Text style={styles.timePickerLabel}>時間</Text>
              <View style={styles.timePickerContainer}>
                <DateTimePicker
                  value={selectedTime}
                  mode="time"
                  is24Hour={false}
                  display="spinner"
                  onChange={handleTimeChange}
                  style={styles.timePicker}
                />
              </View>
            </View>
            <Text style={styles.recordSectionTitleText}>記録</Text>
          </View>
        </View>
      </ScrollView>
      <BottomNavigation />
    </SafeAreaView>
  );
};

export default FeedingScreen;
