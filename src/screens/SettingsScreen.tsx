import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from "react";
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
import { AddParticipantModal } from "../components/AddParticipantModal";
import { EditMeasurementModal } from "../components/EditMeasurementModal";
import TablerIcon from "../components/TablerIcon";
import Header from "../components/layout/Header";
import BottomNavigation from "../components/navigation/BottomNavigation";
import { useBaby } from "../contexts/BabyContext";
import styles from "../styles/SettingsScreenStyles";

type RootStackParamList = {
  Main: undefined;
  CreateFamily: undefined;
  CreateFamilyModal: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SettingsScreen: React.FC = () => {
  const { babyInfo, loading, error } = useBaby();
  const navigation = useNavigation<NavigationProp>();
  
  // モーダル状態管理
  const [weightModalVisible, setWeightModalVisible] = useState(false);
  const [heightModalVisible, setHeightModalVisible] = useState(false);
  const [participantModalVisible, setParticipantModalVisible] = useState(false);

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
            name={babyInfo.name}
            ageInDays={babyInfo.ageInDays}
            participants={babyInfo.participants}
          />
          <View style={styles.content}>
            <View style={styles.titleContainer}>
              <View style={styles.titleIcon}>
                <TablerIcon xml={settingsIcon} width={30} height={30} strokeColor="#FFF" fillColor="none" />
              </View>
              <Text style={styles.titleText}>設定</Text>
            </View>
            
            <View style={styles.settingsContainer}>
              <View style={styles.settingItem}>
                <View style={styles.settingIcon}>
                  <TablerIcon xml={birthdayIcon} width={24} height={24} strokeColor="#FFF" fillColor="none" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingLabel}>誕生日</Text>
                  <Text style={styles.settingValue}>
                    {babyInfo.birthdate || '未設定'}
                  </Text>
                </View>
              </View>

              <Pressable 
                style={styles.settingItem}
                onPress={() => setWeightModalVisible(true)}
              >
                <View style={styles.settingIcon}>
                  <TablerIcon xml={weightIcon} width={24} height={24} strokeColor="#FFF" fillColor="none" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingLabel}>現在の体重</Text>
                  <Text style={styles.settingValue}>
                    {babyInfo.weight ? `${babyInfo.weight.toLocaleString()} g` : '未測定'}
                  </Text>
                </View>
                <View style={styles.settingArrow}>
                  <TablerIcon xml={addRecordIcon} width={16} height={16} strokeColor="#666" fillColor="none" />
                </View>
              </Pressable>

              <Pressable 
                style={styles.settingItem}
                onPress={() => setHeightModalVisible(true)}
              >
                <View style={styles.settingIcon}>
                  <TablerIcon xml={heightIcon} width={24} height={24} strokeColor="#FFF" fillColor="none" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingLabel}>身長</Text>
                  <Text style={styles.settingValue}>
                    {babyInfo.height ? `${babyInfo.height} cm` : '未測定'}
                  </Text>
                </View>
                <View style={styles.settingArrow}>
                  <TablerIcon xml={addRecordIcon} width={16} height={16} strokeColor="#666" fillColor="none" />
                </View>
              </Pressable>

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
                    <Pressable 
                      style={styles.addParticipantButton}
                      onPress={() => setParticipantModalVisible(true)}
                    >
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
                      onPress={() => navigation.navigate('CreateFamilyModal')}
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

      {/* 編集モーダル */}
      <EditMeasurementModal
        visible={weightModalVisible}
        onClose={() => setWeightModalVisible(false)}
        type="weight"
        currentValue={babyInfo.weight}
      />

      <EditMeasurementModal
        visible={heightModalVisible}
        onClose={() => setHeightModalVisible(false)}
        type="height"
        currentValue={babyInfo.height}
      />

      <AddParticipantModal
        visible={participantModalVisible}
        onClose={() => setParticipantModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default SettingsScreen;