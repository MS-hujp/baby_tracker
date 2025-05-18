import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Header from '../components/layout/Header';
import BottomNavigation from '../components/navigation/BottomNavigation';
import { styles } from '../styles/StatisticsScreenStyles';

type TabType = 'feeding' | 'sleep' | 'diaper' | 'measurement';

const StatisticsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('feeding');

  const headerProps = {
    babyName: "まきちゃん",
    ageInDays: 30,
    participants: [
      { name: "ゆか", color: "#FFF" },
      { name: "けん", color: "blue" }
    ]
  };

  const tabs = [
    { id: 'feeding' as TabType, label: '授乳' },
    { id: 'sleep' as TabType, label: '睡眠' },
    { id: 'diaper' as TabType, label: 'おむつ' },
    { id: 'measurement' as TabType, label: '身長・体重' },
  ];

  const getGraphContainerStyle = (tabId: TabType) => {
    switch (tabId) {
      case 'feeding':
        return styles.feedingGraphContainer;
      case 'sleep':
        return styles.sleepGraphContainer;
      case 'diaper':
        return styles.diaperGraphContainer;
      case 'measurement':
        return styles.measurementGraphContainer;
      default:
        return {};
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'feeding':
        return '授乳記録のグラフ表示エリア';
      case 'sleep':
        return '睡眠記録のグラフ表示エリア';
      case 'diaper':
        return 'おむつ交換記録のグラフ表示エリア';
      case 'measurement':
        return '身長・体重の推移グラフ表示エリア';
      default:
        return '';
    }
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
            <View style={styles.tabContainer}>
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab.id}
                  style={[
                    styles.tab,
                    activeTab === tab.id ? styles.activeTab : styles.inactiveTab,
                  ]}
                  onPress={() => setActiveTab(tab.id)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === tab.id ? styles.activeTabText : styles.inactiveTabText,
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={[styles.graphContainer, getGraphContainerStyle(activeTab)]}>
              <Text style={styles.graphPlaceholderText}>
                {renderTabContent()}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <BottomNavigation />
    </SafeAreaView>
  );
};

export default StatisticsScreen; 