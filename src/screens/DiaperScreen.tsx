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
import { useBaby } from '../contexts/BabyContext';
import { useTimeline } from '../contexts/TimelineContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import styles from "../styles/DiaperScreenStyles";
import { TimeChangeEvent } from "../types/common";

type DiaperScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Diaper'>;

const DiaperScreen = () => {
  const navigation = useNavigation<DiaperScreenNavigationProp>();
  const { currentUser } = useAuth();
  const { addRecord, loading, error } = useTimeline();
  const { babyInfo } = useBaby();
  const [selectedTypes, setSelectedTypes] = useState({
    pee: false,
    poop: false,
  });
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
  const [memo, setMemo] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);

  const headerProps = {
    babyName: "まきちゃん",
    ageInDays: 30,
    participants: [
      { name: "ゆか", color: "#FFF" },
      { name: "けん", color: "blue" },
    ],
  };

  const toggleType = (type: "pee" | "poop") => {
    setSelectedTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleTimeChange = (event: TimeChangeEvent, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      setSelectedTime(selectedDate);
    }
  };

  const handleRecord = async () => {
    if (!currentUser) return;

    try {
      await addRecord({
        type: 'diaper',
        timestamp: selectedTime,
        user: currentUser,
        details: {
          diaper: {
            pee: selectedTypes.pee,
            poop: selectedTypes.poop,
          },
        },
      });

      navigation.navigate('Home');
    } catch (err) {
      console.error('Error recording diaper:', err);
    }
  };

  const handleCancel = () => {
    setSelectedTime(new Date());
    setSelectedTypes({ pee: false, poop: false });
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
          <Header 
            name={babyInfo?.name || '赤ちゃん'}
            ageInDays={babyInfo?.ageInDays || 0}
            participants={babyInfo?.participants || []}
          />
          
          {/* エラー表示 */}
          {error && (
            <View style={{
              backgroundColor: '#ffebee',
              borderColor: '#f44336',
              borderWidth: 1,
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
            }}>
              <Text style={{
                color: '#d32f2f',
                fontSize: 14,
                textAlign: 'center',
              }}>{error}</Text>
            </View>
          )}
          
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
                  selectedTypes.poop && styles.selectedSection,
                ]}
                onPress={() => toggleType("poop")}
              >
                <View style={styles.checkbox}>
                  {selectedTypes.poop && (
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
                  onPress={handleCancel}
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
