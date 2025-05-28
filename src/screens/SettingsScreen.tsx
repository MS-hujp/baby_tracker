import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from "react";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import {
  addRecordIcon,
  birthdayIcon,
  heightIcon,
  settingsIcon,
  timelineIcon,
  userPlusIcon,
  weightIcon,
} from "../assets/icons/icons";
import TablerIcon from "../components/TablerIcon";
import Header from "../components/layout/Header";
import BottomNavigation from "../components/navigation/BottomNavigation";
import { useBaby } from "../contexts/BabyContext";
import styles from "../styles/SettingsScreenStyles";

type RootStackParamList = {
  Main: undefined;
  CreateFamily: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SettingsScreen: React.FC = () => {
  const { babyInfo } = useBaby();
  const navigation = useNavigation<NavigationProp>();

  const babyDetails = {
    birthDate: "2025/7/1",
    currentWeight: "4,026",
    currentHeight: "63",
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
          <Header {...babyInfo} />
          <View style={styles.content}>
            <View style={styles.titleContainer}>
              <View style={styles.titleIcon}>
                <TablerIcon xml={settingsIcon} width={30} height={30} strokeColor="#FFF" fillColor="none" />
              </View>
              <Text style={styles.titleText}>設定</Text>
              <Pressable style={styles.editButton}>
                <TablerIcon xml={addRecordIcon} width={24} height={24} strokeColor="#666" fillColor="none" />
                <Text style={styles.editButtonText}>編集する</Text>
              </Pressable>
            </View>
            
            <View style={styles.settingsContainer}>
              <View style={styles.settingItem}>
                <View style={styles.settingIcon}>
                  <TablerIcon xml={birthdayIcon} width={24} height={24} strokeColor="#FFF" fillColor="none" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingLabel}>誕生日</Text>
                  <Text style={styles.settingValue}>{babyDetails.birthDate}</Text>
                </View>
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingIcon}>
                  <TablerIcon xml={weightIcon} width={24} height={24} strokeColor="#FFF" fillColor="none" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingLabel}>現在の体重</Text>
                  <Text style={styles.settingValue}>{babyDetails.currentWeight} g</Text>
                </View>
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingIcon}>
                  <TablerIcon xml={heightIcon} width={24} height={24} strokeColor="#FFF" fillColor="none" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingLabel}>身長</Text>
                  <Text style={styles.settingValue}>{babyDetails.currentHeight} cm</Text>
                </View>
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingIcon}>
                  <TablerIcon xml={timelineIcon} width={24} height={24} strokeColor="#FFF" fillColor="none" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingLabel}>育児に参加している人</Text>
                  <View style={styles.participantsContainer}>
                    {babyInfo.participants.map((participant, index) => (
                      <View
                        key={index}
                        style={[
                          styles.participant,
                          { backgroundColor: participant.color },
                        ]}
                      >
                        <Text style={styles.participantName}>{participant.name}</Text>
                      </View>
                    ))}
                    <Pressable style={styles.addParticipantButton}>
                      <TablerIcon xml={userPlusIcon} width={20} height={20} strokeColor="#666" fillColor="none" />
                      <Text style={styles.addParticipantText}>追加する</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingIcon}>
                  <TablerIcon xml={timelineIcon} width={24} height={24} strokeColor="#FFF" fillColor="none" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingLabel}>家族を作成・編集する</Text>
                  <View style={styles.participantsContainer}>
                    <Pressable 
                      style={styles.addParticipantButton}
                      onPress={() => navigation.navigate('CreateFamily')}
                    >
                      <TablerIcon xml={userPlusIcon} width={20} height={20} strokeColor="#666" fillColor="none" />
                      <Text style={styles.addParticipantText}>家族を作成</Text>
                    </Pressable>
                  </View>
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

export default SettingsScreen; 