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
import {
  calendarIcon,
  heightIcon,
  memoIcon,
  thermometerIcon,
  weightIcon,
} from "../assets/icons/icons";
import Header from "../components/layout/Header";
import BottomNavigation from "../components/navigation/BottomNavigation";
import TablerIcon from "../components/TablerIcon";
import styles from "../styles/MeasurementScreenStyles";

const MeasurementScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [measurements, setMeasurements] = useState({
    height: "",
    weight: "",
    temperature: "",
  });
  const [memo, setMemo] = useState("");

  const headerProps = {
    babyName: "まきちゃん",
    ageInDays: 30,
    participants: [
      { name: "ゆか", color: "#FFF" },
      { name: "けん", color: "blue" },
    ],
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const handleMeasurementChange = (type: string, value: string) => {
    setMeasurements((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleSubmit = () => {
    // 入力された値のみを含むオブジェクトを作成
    const measurementData: { [key: string]: string | number | Date } = {
      date: selectedDate,
    };

    // 各測定値が入力されている場合のみデータに追加
    if (measurements.height) {
      measurementData.height = parseFloat(measurements.height);
    }
    if (measurements.weight) {
      measurementData.weight = parseFloat(measurements.weight);
    }
    if (measurements.temperature) {
      measurementData.temperature = parseFloat(measurements.temperature);
    }
    if (memo) {
      measurementData.memo = memo;
    }

    // 少なくとも1つの測定値が入力されているか確認
    const hasMeasurement = measurements.height || measurements.weight || measurements.temperature;
    
    if (hasMeasurement) {
      console.log("Submitted data:", measurementData);
      // TODO: データを保存する処理を追加
    } else {
      console.log("少なくとも1つの測定値を入力してください");
      // TODO: エラーメッセージを表示する処理を追加
    }
  };

  const handleCancel = () => {
    // 入力をリセット
    setSelectedDate(new Date());
    setMeasurements({
      height: "",
      weight: "",
      temperature: "",
    });
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
          <View style={styles.measurementInnerContainer}>
            <View style={styles.measurementContainer}>
              <View style={styles.recordItem}>
                <View style={styles.recordItemIcon}>
                  <TablerIcon
                    xml={thermometerIcon}
                    width={30}
                    height={30}
                    strokeColor="#FFF"
                    fillColor="none"
                    strokeWidth={1.5}
                  />
                </View>
                <Text style={styles.recordTitle}>記録</Text>
              </View>

              {/* 日付選択セクション */}
              <View style={styles.datePickerSection}>
                <View style={styles.datePickerRow}>
                  <View style={styles.dateLabelContainer}>
                    <View style={styles.measurementIcon}>
                      <TablerIcon
                        xml={calendarIcon}
                        width={25}
                        height={25}
                        strokeColor="#FFF"
                        fillColor="none"
                      />
                    </View>
                    <Text style={styles.dateLabel}>日付</Text>
                  </View>
                  <View style={styles.datePickerContainer}>
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    style={styles.datePicker}
                    textColor="black"
                  />
                  </View>
                </View>
              </View>

              <View style={styles.measurementSection}>
                {/* 身長測定 */}
                <View style={styles.measurementRow}>
                  <View style={styles.measurementIcon}>
                    <TablerIcon
                      xml={heightIcon}
                      width={25}
                      height={25}
                      strokeColor="#FFF"
                      fillColor="none"
                    />
                  </View>
                  <Text style={styles.measurementLabel}>身長</Text>
                  <TextInput
                    style={styles.measurementInput}
                    value={measurements.height}
                    onChangeText={(value) => handleMeasurementChange("height", value)}
                    keyboardType="decimal-pad"
                    placeholder="身長を入力"
                  />
                  <Text style={styles.unitText}>cm</Text>
                </View>

                {/* 体重測定 */}
                <View style={styles.measurementRow}>
                  <View style={styles.measurementIcon}>
                    <TablerIcon
                      xml={weightIcon}
                      width={25}
                      height={25}
                      strokeColor="#FFF"
                      fillColor="none"
                    />
                  </View>
                  <Text style={styles.measurementLabel}>体重</Text>
                  <TextInput
                    style={styles.measurementInput}
                    value={measurements.weight}
                    onChangeText={(value) => handleMeasurementChange("weight", value)}
                    keyboardType="decimal-pad"
                    placeholder="体重を入力"
                  />
                  <Text style={styles.unitText}>kg</Text>
                </View>

                {/* 体温測定 */}
                <View style={styles.measurementRow}>
                  <View style={styles.measurementIcon}>
                    <TablerIcon
                      xml={thermometerIcon}
                      width={25}
                      height={25}
                      strokeColor="#FFF"
                      fillColor="none"
                    />
                  </View>
                  <Text style={styles.measurementLabel}>体温</Text>
                  <TextInput
                    style={styles.measurementInput}
                    value={measurements.temperature}
                    onChangeText={(value) => handleMeasurementChange("temperature", value)}
                    keyboardType="decimal-pad"
                    placeholder="体温を入力"
                  />
                  <Text style={styles.unitText}>℃</Text>
                </View>
              </View>

              <View style={styles.memoSection}>
                <View style={styles.memoIcon}>
                  <TablerIcon
                    xml={memoIcon}
                    width={30}
                    height={30}
                    strokeColor="#FFF"
                    fillColor="none"
                  />
                </View>
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

export default MeasurementScreen; 