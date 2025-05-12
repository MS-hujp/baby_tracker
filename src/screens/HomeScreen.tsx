import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  babyBottleIcon,
  diaperIcon,
  heightIcon,
  homeIcon,
  logoutIcon,
  settingsIcon,
  sleepIcon,
  statisticsIcon,
  thermometerIcon,
  timelineIcon,
  wakeupIcon,
  weightIcon,
} from "../assets/icons/icons";
import TablerIcon from "../components/TablerIcon";
import styles from "../styles/HomeScreenStyles";

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <FontAwesome name="user-circle" size={50} color="white" />
          <Text style={styles.profileName}>まきちゃん</Text>
          <Text style={styles.profileAge}>(生後30日)</Text>
        </View>
        <View style={styles.participants}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="child-care" size={24} color="#FFF" />
            <Text style={styles.participantText}>ゆか</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="child-care" size={24} color="blue" />
            <Text style={styles.participantText}>けん</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>次の授乳は11:02頃</Text>
        <Text style={styles.infoText}>お昼寝のサインが出る時間：もうすぐ</Text>
      </View>

      <View style={styles.recordSection}>
        <View style={styles.recordColumn}>
          <View style={styles.recordRow}>
            <TouchableOpacity
              style={[styles.recordButton, { backgroundColor: "#66cc9e" }]}
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
              style={[styles.recordButton, { backgroundColor: "#E69ED8" }]}
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
              style={[styles.recordButton, { backgroundColor: "#ad9ce6" }]}
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
              style={[styles.recordButton, { backgroundColor: "#e6ac73" }]}
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
        <View style={styles.recordMeasurements}>
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
        </View>
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
              style={[styles.timeLineItemIcon, { backgroundColor: "#ad9ce6" }]}
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
              style={[styles.timeLineItemIcon, { backgroundColor: "#E69ED8" }]}
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
              style={[styles.timeLineItemIcon, { backgroundColor: "#e6ac73" }]}
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

      <View style={styles.navigation}>
        <View style={styles.bottomNavwrap}>
          <View style={[styles.bottomNav, { backgroundColor: "#e6ac73" }]}>
            <TablerIcon
              xml={logoutIcon}
              width={30}
              height={30}
              strokeColor="#fff"
              fillColor="none"
            />
          </View>
          <Text>ログアウト</Text>
        </View>
        <View style={styles.bottomNavwrap}>
          <View style={[styles.bottomNav, { backgroundColor: "#66cc9e" }]}>
            <TablerIcon
              xml={homeIcon}
              width={30}
              height={30}
              strokeColor="#fff"
              fillColor="none"
            />
          </View>
          <Text>ホーム</Text>
        </View>
        <View style={styles.bottomNavwrap}>
          <View style={[styles.bottomNav, { backgroundColor: "#999999" }]}>
            <TablerIcon
              xml={settingsIcon}
              width={30}
              height={30}
              strokeColor="#fff"
              fillColor="none"
            />
          </View>
          <Text>設定</Text>
        </View>
        <View style={styles.bottomNavwrap}>
          <View style={[styles.bottomNav, { backgroundColor: "rgba(137, 196, 255, 1.0)" }]}>
            <TablerIcon
              xml={timelineIcon}
              width={30}
              height={30}
              strokeColor="#fff"
              fillColor="none"
            />
          </View>
          <Text>タイムライン</Text>
        </View>
        <View style={styles.bottomNavwrap}>
          <View style={[styles.bottomNav, { backgroundColor: "#ac73e6" }]}>
            <TablerIcon
              xml={statisticsIcon}
              width={30}
              height={30}
              strokeColor="#fff"
              fillColor="none"
            />
          </View>
          <Text>統計</Text>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
