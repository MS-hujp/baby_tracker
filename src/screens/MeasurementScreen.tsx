import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
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
    clockIcon,
    heightIcon,
    memoIcon,
    temperatureIcon,
    weightIcon
} from "../assets/icons/icons";
import Header from "../components/layout/Header";
import BottomNavigation from "../components/navigation/BottomNavigation";
import TablerIcon from "../components/TablerIcon";
import { useAuth } from '../contexts/AuthContext';
import { useBaby } from '../contexts/BabyContext';
import { useTimeline } from '../contexts/TimelineContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import styles from "../styles/MeasurementScreenStyles";
import { MeasurementUpdateData, TimeChangeEvent } from "../types/common";

type MeasurementScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Measurement'>;

const MeasurementScreen = () => {
  const navigation = useNavigation<MeasurementScreenNavigationProp>();
  const { currentUser } = useAuth();
  const { addRecord } = useTimeline();
  const { babyInfo, updateBabyInfo } = useBaby();
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [temperature, setTemperature] = useState<string>("");
  const [memo, setMemo] = useState<string>("");
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleTimeChange = (event: TimeChangeEvent, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      setSelectedTime(selectedDate);
    }
  };

  const handleRecord = async () => {
    if (!currentUser) return;

    try {
      // 測定記録を追加
      await addRecord({
        type: 'measurement',
        timestamp: selectedTime,
        user: currentUser,
        details: {
          measurement: {
            height: height ? parseFloat(height) : undefined,
            weight: weight ? parseFloat(weight) : undefined,
            temperature: temperature ? parseFloat(temperature) : undefined,
          },
        },
      });

      // 赤ちゃんの基本情報も更新（体重や身長が入力された場合）
      const updateData: MeasurementUpdateData = {};
      if (weight && parseFloat(weight) > 0) {
        updateData.weight = parseFloat(weight);
      }
      if (height && parseFloat(height) > 0) {
        updateData.height = parseFloat(height);
      }

      if (Object.keys(updateData).length > 0) {
        await updateBabyInfo(updateData);
      }

      navigation.navigate('Home');
    } catch (err) {
      console.error('Error recording measurement:', err);
      // エラーはTimelineContextで処理されるので、ここではログのみ
    }
  };

  const handleCancel = () => {
    // 入力をリセット
    setSelectedTime(new Date());
    setHeight("");
    setWeight("");
    setTemperature("");
    setMemo("");
    // ホーム画面に戻る
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
          <View style={styles.recordSectionContainer}>
            <View style={styles.recordSectionTitle}>
              <View style={styles.measurementIcon}>
                <TablerIcon
                  xml={heightIcon}
                  width={30}
                  height={30}
                  strokeColor="#FFF"
                  fillColor="none"
                />
              </View>
              <Text style={styles.recordSectionTitleText}>記録</Text>
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

              <View style={styles.measurementSection}>
                <View style={styles.measurementItem}>
                  <View style={styles.measurementIcon}>
                    <TablerIcon
                      xml={heightIcon}
                      width={30}
                      height={30}
                      strokeColor="#FFF"
                      fillColor="none"
                    />
                  </View>
                  <Text style={styles.measurementLabel}>身長</Text>
                  <TextInput
                    style={styles.measurementInput}
                    placeholder="身長を入力"
                    value={height}
                    onChangeText={setHeight}
                    keyboardType="numeric"
                  />
                  <Text style={styles.measurementUnit}>cm</Text>
                </View>

                <View style={styles.measurementItem}>
                  <View style={styles.measurementIcon}>
                    <TablerIcon
                      xml={weightIcon}
                      width={30}
                      height={30}
                      strokeColor="#FFF"
                      fillColor="none"
                    />
                  </View>
                  <Text style={styles.measurementLabel}>体重</Text>
                  <TextInput
                    style={styles.measurementInput}
                    placeholder="体重を入力"
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                  />
                  <Text style={styles.measurementUnit}>g</Text>
                </View>

                <View style={styles.measurementItem}>
                  <View style={styles.measurementIcon}>
                    <TablerIcon
                      xml={temperatureIcon}
                      width={30}
                      height={30}
                      strokeColor="#FFF"
                      fillColor="none"
                    />
                  </View>
                  <Text style={styles.measurementLabel}>体温</Text>
                  <TextInput
                    style={styles.measurementInput}
                    placeholder="体温を入力"
                    value={temperature}
                    onChangeText={setTemperature}
                    keyboardType="numeric"
                  />
                  <Text style={styles.measurementUnit}>℃</Text>
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

export default MeasurementScreen; 