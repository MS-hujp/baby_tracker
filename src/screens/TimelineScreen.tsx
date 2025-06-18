import React from "react";
import { ActivityIndicator, SafeAreaView, ScrollView, Text, View } from "react-native";
import { timelineIcon } from "../assets/icons/icons";
import TablerIcon from "../components/TablerIcon";
import Header from "../components/layout/Header";
import BottomNavigation from "../components/navigation/BottomNavigation";
import TimelineItem from "../components/timeline/TimelineItem";
import { useBaby } from "../contexts/BabyContext";
import { useTimeline } from "../contexts/TimelineContext";
import { styles } from "../styles/TimelineScreenStyles";

const TimelineScreen: React.FC = () => {
  const { records, loading, error } = useTimeline();
  const { babyInfo } = useBaby();

  const headerProps = {
    name: babyInfo?.name || '赤ちゃん',
    ageInDays: babyInfo?.ageInDays || 0,
    participants: babyInfo?.participants || [],
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
          <View style={styles.content}>
            <View style={styles.titleContainer}>
              <View style={styles.titleIcon}>
                <TablerIcon xml={timelineIcon} width={30} height={30} strokeColor="#FFF" fillColor="none" />
              </View>
              <Text style={styles.titleText}>タイムライン</Text>
            </View>
            
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
            
            <View style={styles.timelineContainer}>
              {loading ? (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <ActivityIndicator size="large" color="#007AFF" />
                  <Text style={{ marginTop: 10, color: '#666' }}>記録を読み込み中...</Text>
                </View>
              ) : records.length === 0 ? (
                <Text style={styles.emptyText}>まだ記録がありません</Text>
              ) : (
                records.map((record) => (
                  <TimelineItem key={record.id} record={record} />
                ))
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      <BottomNavigation />
    </SafeAreaView>
  );
};

export default TimelineScreen; 