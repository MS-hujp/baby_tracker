import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../../App";
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
import styles from "../styles/HomeScreenStyles";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const { babyInfo } = useBaby();

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
          <Header {...babyInfo} />

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

          <View style={styles.timeLineSectionContainer}>
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
                <View style={styles.timeLineItem}>
                  <View
                    style={[
                      styles.timeLineItemIcon,
                      { backgroundColor: "rgba(137, 196, 255, 1.0)" },
                    ]}
                  >
                    <TablerIcon
                      xml={babyBottleIcon}
                      width={30}
                      height={30}
                      strokeColor="#FFF"
                      fillColor="none"
                    />
                  </View>
                  <Text style={styles.timeLineText}>授乳</Text>
                  <Text style={styles.timestamp}>
                    {/* {new Date(item.timestamp.seconds * 1000).toLocaleString()} */}
                    8:01
                  </Text>
                  <Text style={styles.logText}>
                    {/* User ID: {item.user_id} */}
                    Yukaが記録
                  </Text>
                </View>
                <View style={styles.timeLineItem}>
                  <View
                    style={[
                      styles.timeLineItemIcon,
                      { backgroundColor: "#ad9ce6" },
                    ]}
                  >
                    <TablerIcon
                      xml={sleepIcon}
                      width={30}
                      height={30}
                      strokeColor="#FFF"
                      fillColor="none"
                    />
                  </View>
                  <Text style={styles.timeLineText}>寝る</Text>
                  <Text style={styles.timestamp}>
                    {/* {new Date(item.timestamp.seconds * 1000).toLocaleString()} */}
                    8:01
                  </Text>
                  <Text style={styles.logText}>
                    {/* User ID: {item.user_id} */}
                    Kenが記録
                  </Text>
                </View>
                <View style={styles.timeLineItem}>
                  <View
                    style={[
                      styles.timeLineItemIcon,
                      { backgroundColor: "#E69ED8" },
                    ]}
                  >
                    <TablerIcon
                      xml={diaperIcon}
                      width={30}
                      height={30}
                      strokeColor="#FFF"
                      fillColor="none"
                    />
                  </View>
                  <Text style={styles.timeLineText}>おむつ交換</Text>
                  <Text style={styles.timestamp}>
                    {/* {new Date(item.timestamp.seconds * 1000).toLocaleString()} */}
                    8:01
                  </Text>
                  <Text style={styles.logText}>
                    {/* User ID: {item.user_id} */}
                    Kenが記録
                  </Text>
                </View>
                <View style={styles.timeLineItem}>
                  <View
                    style={[
                      styles.timeLineItemIcon,
                      { backgroundColor: "#e6ac73" },
                    ]}
                  >
                    <TablerIcon
                      xml={wakeupIcon}
                      width={30}
                      height={30}
                      strokeColor="#FFF"
                      fillColor="none"
                    />
                  </View>
                  <Text style={styles.timeLineText}>起きる</Text>
                  <Text style={styles.timestamp}>
                    {/* {new Date(item.timestamp.seconds * 1000).toLocaleString()} */}
                    8:01
                  </Text>
                  <Text style={styles.logText}>
                    {/* User ID: {item.user_id} */}
                    Yukaが記録
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <BottomNavigation />
    </SafeAreaView>
  );
};

export default HomeScreen;
