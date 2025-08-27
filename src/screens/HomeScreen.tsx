import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  addRecordIcon,
  babyBottleIcon,
  diaperIcon,
  heightIcon,
  sleepIcon,
  thermometerIcon,
  timelineIcon,
  wakeupIcon,
  weightIcon,
} from "../assets/icons/icons";
import TablerIcon from "../components/TablerIcon";
import Header from "../components/layout/Header";
import BottomNavigation from "../components/navigation/BottomNavigation";
import { useBaby } from "../contexts/BabyContext";
import { useTimeline } from "../contexts/TimelineContext";
import styles from "../styles/HomeScreenStyles";
import { LatestRecordsByCategory } from "../types/common";

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Feeding: undefined;
  Diaper: undefined;
  Sleep: undefined;
  Wakeup: undefined;
  Measurement: undefined;
  Statistics: undefined;
  Timeline: undefined;
  Settings: undefined;
  CreateFamily: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { babyInfo, loading, error } = useBaby();
  const { records } = useTimeline();

  // カテゴリ別の最新記録を取得
  const getLatestRecordsByCategory = (): LatestRecordsByCategory => {
    const categories = ['feeding', 'sleep', 'diaper', 'wakeup'];
    const latestRecords: LatestRecordsByCategory = {};

    // 各カテゴリの最新記録を取得
    categories.forEach(category => {
      const categoryRecords = records.filter(record => record.type === category);
      if (categoryRecords.length > 0) {
        // 最新の記録（最初の要素）を取得
        latestRecords[category] = categoryRecords[0];
      }
    });

    return latestRecords;
  };

  const latestRecordsByCategory = getLatestRecordsByCategory();

  // 記録タイプに応じたアイコンと色を取得
  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'feeding':
        return { icon: babyBottleIcon, color: "rgba(137, 196, 255, 1.0)" };
      case 'diaper':
        return { icon: diaperIcon, color: "#E69ED8" };
      case 'sleep':
        return { icon: sleepIcon, color: "#ad9ce6" };
      case 'wakeup':
        return { icon: wakeupIcon, color: "#e6ac73" };
      case 'measurement':
        return { icon: thermometerIcon, color: "#66cc9e" };
      default:
        return { icon: addRecordIcon, color: "#999" };
    }
  };

  // 記録タイプに応じたテキストを取得
  const getRecordText = (type: string) => {
    switch (type) {
      case 'feeding':
        return '授乳';
      case 'diaper':
        return 'おむつ交換';
      case 'sleep':
        return '寝る';
      case 'wakeup':
        return '起きる';
      case 'measurement':
        return '測定';
      default:
        return '記録';
    }
  };

  // 時間をフォーマット
  const formatTime = (date: Date | undefined) => {
    if (!date) return '--:--';
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const time = date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return `${month}/${day} ${time}`;
  };

  // カテゴリの表示順序を定義
  const categoryOrder = ['feeding', 'diaper', 'sleep', 'wakeup'];

  // ローディング中
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>データを読み込み中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // エラー時
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'red' }}>エラー: {error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // 赤ちゃん情報がない場合
  if (!babyInfo) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>赤ちゃん情報が見つかりません</Text>
        </View>
      </SafeAreaView>
    );
  }

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

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>次の授乳は11:02頃</Text>
            <Text style={styles.infoText}>
              お昼寝のサインが出る時間：もうすぐ
            </Text>
          </View>

          <View style={styles.recordSectionContainer}>
            <View style={styles.recordSectionTitle}>
              <TablerIcon
                xml={addRecordIcon}
                width={30}
                height={30}
                strokeColor="#454444"
                fillColor="none"
              />
              <Text style={styles.recordSectionTitleText}>記録</Text>
            </View>
            <View style={styles.recordSection}>
              <View style={styles.recordColumn}>
                <View style={styles.recordRow}>
                  <TouchableOpacity
                    style={[
                      styles.recordButton,
                      { backgroundColor: "#66cc9e" },
                    ]}
                    onPress={() => navigation.navigate("Feeding")}
                  >
                    <TablerIcon
                      xml={babyBottleIcon}
                      width={30}
                      height={30}
                      strokeColor="#FFF"
                      fillColor="none"
                    />
                    <Text style={styles.recordButtonText}>授乳</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.recordButton,
                      { backgroundColor: "#E69ED8" },
                    ]}
                    onPress={() => navigation.navigate("Diaper")}
                  >
                    <TablerIcon
                      xml={diaperIcon}
                      width={30}
                      height={30}
                      strokeColor="#FFF"
                      fillColor="none"
                      strokeWidth={1.5}
                    />
                    <Text style={styles.recordButtonText}>おむつ交換</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.recordRow}>
                  <TouchableOpacity
                    style={[
                      styles.recordButton,
                      { backgroundColor: "#ad9ce6" },
                    ]}
                    onPress={() => navigation.navigate("Sleep")}
                  >
                    <TablerIcon
                      xml={sleepIcon}
                      width={30}
                      height={30}
                      strokeColor="#FFF"
                      fillColor="none"
                    />
                    <Text style={styles.recordButtonText}>寝る</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.recordButton,
                      { backgroundColor: "#e6ac73" },
                    ]}
                    onPress={() => navigation.navigate("Wakeup")}
                  >
                    <TablerIcon
                      xml={wakeupIcon}
                      width={30}
                      height={30}
                      strokeColor="#FFF"
                      fillColor="none"
                    />
                    <Text style={styles.recordButtonText}>起きる</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.recordMeasurements}
                onPress={() => navigation.navigate("Measurement")}
              >
                <View style={styles.recordMeasurement}>
                  <TablerIcon
                    xml={thermometerIcon}
                    width={30}
                    height={30}
                    strokeColor="#FFF"
                    fillColor="none"
                  />
                  <Text style={styles.recordButtonText}>体温</Text>
                </View>
                <View style={styles.recordMeasurement}>
                  <TablerIcon
                    xml={weightIcon}
                    width={30}
                    height={30}
                    strokeColor="#FFF"
                    fillColor="none"
                  />
                  <Text style={styles.recordButtonText}>体重</Text>
                </View>
                <View style={styles.recordMeasurement}>
                  <TablerIcon
                    xml={heightIcon}
                    width={30}
                    height={30}
                    strokeColor="#FFF"
                    fillColor="none"
                  />
                  <Text style={styles.recordButtonText}>身長</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.timeLineSectionContainer}
            onPress={() => navigation.navigate("Timeline")}
          >
            <View style={styles.timeLineSectionTitle}>
              <TablerIcon
                xml={timelineIcon}
                width={30}
                height={30}
                strokeColor="#454444"
                fillColor="none"
              />
              <Text style={styles.recordSectionTitleText}>タイムライン</Text>
            </View>
            <View style={styles.timeLineSection}>
              <View style={styles.timeLineItems}>
                {Object.keys(latestRecordsByCategory).length > 0 ? (
                  categoryOrder.map((category) => {
                    const record = latestRecordsByCategory[category];
                    if (!record) return null;
                    
                    const { icon, color } = getRecordIcon(record.type);
                    return (
                      <View key={record.id} style={styles.timeLineItem}>
                        <View
                          style={[
                            styles.timeLineItemIcon,
                            { backgroundColor: color },
                          ]}
                        >
                          <TablerIcon
                            xml={icon}
                            width={30}
                            height={30}
                            strokeColor="#FFF"
                            fillColor="none"
                          />
                        </View>
                        <Text style={styles.timeLineText}>{getRecordText(record.type)}</Text>
                        <Text style={styles.timestamp}>{formatTime(record.timestamp)}</Text>
                        <Text style={styles.logText}>{record.user.name}が記録</Text>
                      </View>
                    );
                  })
                ) : (
                  <View style={styles.timeLineItem}>
                    <Text style={styles.timeLineText}>まだ記録がありません</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNavigation />
    </SafeAreaView>
  );
};

export default HomeScreen;
