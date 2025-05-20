import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import {
  babyBottleIcon,
  clockIcon,
  milkCanIcon,
  motherIcon,
} from "../assets/icons/icons";
import Header from "../components/layout/Header";
import BottomNavigation from "../components/navigation/BottomNavigation";
import TablerIcon from "../components/TablerIcon";
import { useAuth } from '../contexts/AuthContext';
import { useTimeline } from '../contexts/TimelineContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import styles from "../styles/FeedingScreenStyles";

type FeedingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Feeding'>;

const FeedingScreen = () => {
  const navigation = useNavigation<FeedingScreenNavigationProp>();
  const { currentUser } = useAuth();
  const { addRecord } = useTimeline();
  const [selectedFeedings, setSelectedFeedings] = useState({
    motherMilk: false,
    formulaMilk: false,
  });
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [leftDuration, setLeftDuration] = useState(0);
  const [rightDuration, setRightDuration] = useState(0);
  const [milkAmount, setMilkAmount] = useState(0);

  const headerProps = {
    babyName: "まきちゃん",
    ageInDays: 30,
    participants: [
      { name: "ゆか", color: "#FFF" },
      { name: "けん", color: "blue" },
    ],
  };

  const toggleFeeding = (type: "motherMilk" | "formulaMilk") => {
    setSelectedFeedings((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setSelectedTime(selectedDate);
    }
  };

  const handleRecord = () => {
    if (!currentUser) return;

    // 母乳の場合
    if (selectedFeedings.motherMilk) {
      addRecord({
        type: 'feeding',
        timestamp: selectedTime,
        user: currentUser,
        details: {
          feeding: {
            type: 'breast',
          },
        },
      });
    }

    // ミルクの場合
    if (selectedFeedings.formulaMilk) {
      addRecord({
        type: 'feeding',
        timestamp: selectedTime,
        user: currentUser,
        details: {
          feeding: {
            type: 'formula',
            amount: milkAmount,
          },
        },
      });
    }

    // 記録後、ホーム画面に戻る
    navigation.navigate('Home');
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
                style={[
                  styles.motherSection,
                  selectedFeedings.motherMilk && styles.selectedSection,
                ]}
                onPress={() => toggleFeeding("motherMilk")}
              >
                <View style={styles.checkbox}>
                  {selectedFeedings.motherMilk && (
                    <View style={styles.checkboxInner} />
                  )}
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
                style={[
                  styles.milkSection,
                  selectedFeedings.formulaMilk && styles.selectedSection,
                ]}
                onPress={() => toggleFeeding("formulaMilk")}
              >
                <View style={styles.checkbox}>
                  {selectedFeedings.formulaMilk && (
                    <View style={styles.checkboxInner} />
                  )}
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
              <View style={styles.recordSectionTitle}>
                <View style={styles.clockIcon}>
                  <TablerIcon
                    xml={clockIcon}
                    width={30}
                    height={30}
                    strokeColor="#FFF"
                  />
                </View>
                <Text style={styles.timePickerLabel}>時間</Text>
              </View>

              <View style={styles.timePickerContainer}>
                <DateTimePicker
                  value={selectedTime}
                  mode="time"
                  is24Hour={false}
                  display="spinner"
                  onChange={handleTimeChange}
                  style={styles.timePicker}
                  textColor="black"
                />
              </View>
              {selectedFeedings.motherMilk && (
                <>
                  <View style={styles.LRSection}>
                    <Text style={styles.leftLabel}>左</Text>
                    <Text style={styles.rightLabel}>右</Text>
                  </View>

                  <View style={styles.durationPickerContainerWrap}>
                    <View style={styles.durationPickerContainer}>
                      <Picker
                        selectedValue={leftDuration}
                        onValueChange={(itemValue) =>
                          setLeftDuration(itemValue)
                        }
                        style={styles.durationPicker}
                        itemStyle={{ height: 50, fontSize: 16 }}
                      >
                        {Array.from({ length: 61 }, (_, i) => (
                          <Picker.Item
                            key={i}
                            label={`${i}分`}
                            value={i}
                            color="black"
                          />
                        ))}
                      </Picker>
                    </View>
                    <View style={styles.durationPickerContainer}>
                      <Picker
                        selectedValue={rightDuration}
                        onValueChange={(itemValue) =>
                          setRightDuration(itemValue)
                        }
                        style={styles.durationPicker}
                        itemStyle={{ height: 50, fontSize: 16 }}
                      >
                        {Array.from({ length: 61 }, (_, i) => (
                          <Picker.Item
                            key={i}
                            label={`${i}分`}
                            value={i}
                            color="black"
                          />
                        ))}
                      </Picker>
                    </View>
                  </View>
                </>
              )}

              {selectedFeedings.formulaMilk && (
                <View style={styles.milkAmountPickerSection}>
                  <View style={styles.recordSectionTitle}>
                    <View style={styles.milkCanIcon}>
                      <TablerIcon
                        xml={milkCanIcon}
                        width={30}
                        height={30}
                        strokeColor="#FFF"
                      />
                    </View>
                    <Text style={styles.timePickerLabel}>ミルク量</Text>
                  </View>

                  <View style={styles.milkAmountPickerContainer}>
                    <Picker
                      selectedValue={milkAmount}
                      onValueChange={(itemValue) => setMilkAmount(itemValue)}
                      style={styles.milkAmountPicker}
                      itemStyle={{ height: 50, fontSize: 16 }}
                    >
                      {Array.from({ length: 101 }, (_, i) => (
                        <Picker.Item
                          key={i * 5}
                          label={`${i * 5}ml`}
                          value={i * 5}
                          color="black"
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
              )}

              <View style={styles.buttonContainer}>
                <Pressable
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => navigation.navigate('Home')}
                >
                  <Text style={styles.buttonText}>キャンセル</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.okButton]}
                  onPress={handleRecord}
                >
                  <Text style={styles.buttonText}>OK</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <BottomNavigation />
    </SafeAreaView>
  );
};

export default FeedingScreen;
