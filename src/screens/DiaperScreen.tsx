import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { diaperIcon, memoIcon, peeIcon, pooIcon } from "../assets/icons/icons";
import Header from "../components/layout/Header";
import BottomNavigation from "../components/navigation/BottomNavigation";
import TablerIcon from "../components/TablerIcon";
import styles from "../styles/DiaperScreenStyles";

const DiaperScreen = () => {
  const [selectedDiaper, setSelectedDiaper] = useState({
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

  const toggleDiaper = (type: "pee" | "poo") => {
    setSelectedDiaper((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setSelectedTime(selectedDate);
    }
  };

  const handleSubmit = () => {
    // ここでデータを保存する処理を実装
    const data = {
      pee: selectedDiaper.pee,
      poo: selectedDiaper.poo,
      time: selectedTime,
      memo: memo,
    };
    console.log("Submitted data:", data);
    // TODO: データを保存する処理を追加
  };

  const handleCancel = () => {
    // 入力をリセット
    setSelectedDiaper({ pee: false, poo: false });
    setSelectedTime(new Date());
    setMemo("");
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
          <View style={styles.diaperInnerContainer}>
            <View style={styles.diaperContainer}>
              <View style={styles.diaperItem}>
                <View style={styles.diaperItemIcon}>
                  <TablerIcon
                    xml={diaperIcon}
                    width={30}
                    height={30}
                    strokeColor="#FFF"
                    fillColor="none"
                    strokeWidth={1.5}
                  />
                </View>
                <Text style={styles.recordDiaperTitle}>記録</Text>
              </View>

              <View style={styles.recordPeeOrPoo}>
                <Pressable
                  style={[
                    styles.peeSection,
                    selectedDiaper.pee && styles.selectedSection,
                  ]}
                  onPress={() => toggleDiaper("pee")}
                >
                  <View style={styles.checkbox}>
                    {selectedDiaper.pee && (
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
                    selectedDiaper.poo && styles.selectedSection,
                  ]}
                  onPress={() => toggleDiaper("poo")}
                >
                  <View style={styles.checkbox}>
                    {selectedDiaper.poo && (
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

              <View style={styles.memoSection}>
                <View style={styles.memoIcon}>                <TablerIcon
                  xml={memoIcon}
                  width={30}
                  height={30}
                  strokeColor="#FFF"
                  fillColor="none"
                /></View>
                <Text style={styles.memoLabel}>メモ</Text>
              </View>
              <TextInput
                  style={styles.memoInput}
                  placeholder="メモを入力してください"
                  value={memo}
                  onChangeText={setMemo}
                  multiline={true}
                  numberOfLines={4}
                />

              <View style={styles.buttonContainer}>
                <Pressable
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleCancel}
                >
                  <Text style={styles.buttonText}>キャンセル</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.okButton]}
                  onPress={handleSubmit}
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
