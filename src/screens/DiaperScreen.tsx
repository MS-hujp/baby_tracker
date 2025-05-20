import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from "react";
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
    View
} from "react-native";
import { clockIcon, diaperIcon, peeIcon, pooIcon } from "../assets/icons/icons";
import Header from "../components/layout/Header";
import BottomNavigation from "../components/navigation/BottomNavigation";
import TablerIcon from "../components/TablerIcon";
import { useAuth } from '../contexts/AuthContext';
import { useTimeline } from '../contexts/TimelineContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import styles from "../styles/DiaperScreenStyles";

type DiaperScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Diaper'>;

const DiaperScreen = () => {
  const navigation = useNavigation<DiaperScreenNavigationProp>();
  const { currentUser } = useAuth();
  const { addRecord } = useTimeline();
  const [selectedTypes, setSelectedTypes] = useState({
    pee: false,
    poo: false,
  });
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [memo, setMemo] = useState("");

  const headerProps = {
    babyName: "まきちゃん",
    ageInDays: 30,
    participants: [
      { name: "ゆか", color: "#FFF" },
      { name: "けん", color: "blue" },
    ],
  };

  const toggleType = (type: "pee" | "poo") => {
    setSelectedTypes((prev) => ({
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

    addRecord({
      type: 'diaper',
      timestamp: selectedTime,
      user: currentUser,
      details: {
        diaper: {
          pee: selectedTypes.pee,
          poop: selectedTypes.poo,
        },
      },
    });

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
              <View style={styles.diaperIcon}>
                <TablerIcon
                  xml={diaperIcon}
                  width={30}
                  height={30}
                  strokeColor="#FFF"
                  fillColor="none"
                />
              </View>
              <Text style={styles.recordSectionTitleText}>記録</Text>
            </View>

            <View style={styles.recordPeeOrPoo}>
              <Pressable
                style={[
                  styles.peeSection,
                  selectedTypes.pee && styles.selectedSection,
                ]}
                onPress={() => toggleType("pee")}
              >
                <View style={styles.checkbox}>
                  {selectedTypes.pee && (
                    <View style={styles.checkboxInner} />
                  )}
                </View>
                <View style={styles.peeIcon}>
                  <TablerIcon
                    xml={peeIcon}
                    width={30}
                    height={30}
                    strokeColor="#FFF"
                    fillColor="none"
                  />
                </View>
                <Text style={styles.peeIconText}>おしっこ</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.pooSection,
                  selectedTypes.poo && styles.selectedSection,
                ]}
                onPress={() => toggleType("poo")}
              >
                <View style={styles.checkbox}>
                  {selectedTypes.poo && (
                    <View style={styles.checkboxInner} />
                  )}
                </View>
                <View style={styles.pooIcon}>
                  <TablerIcon
                    xml={pooIcon}
                    width={30}
                    height={30}
                    strokeColor="#FFF"
                    fillColor="none"
                  />
                </View>
                <Text style={styles.pooIconText}>うんち</Text>
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

export default DiaperScreen;
