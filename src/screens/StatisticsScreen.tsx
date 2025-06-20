import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import { aiIcon } from "../assets/icons/icons";
import Header from "../components/layout/Header";
import BottomNavigation from "../components/navigation/BottomNavigation";
import TablerIcon from "../components/TablerIcon";
import { useBaby } from "../contexts/BabyContext";
import { useTimeline } from "../contexts/TimelineContext";
import { styles } from "../styles/StatisticsScreenStyles";

type TabType = "feeding" | "sleep" | "diaper" | "measurement";

const StatisticsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("feeding");
  const { babyInfo, loading, error } = useBaby();
  const { records } = useTimeline();

  // 実際の記録データを取得
  const actualData = useMemo(() => {
    if (!records || records.length === 0) {
      return {
        feeding: [],
        sleep: [],
        diaper: [],
        measurement: []
      };
    }

    // 記録タイプ別に分類
    const categorizedRecords = {
      feeding: records.filter(record => record.type === 'feeding'),
      sleep: records.filter(record => record.type === 'sleep' || record.type === 'wakeup'),
      diaper: records.filter(record => record.type === 'diaper'),
      measurement: records.filter(record => record.type === 'measurement')
    };

    console.log('📊 Actual records for statistics:', categorizedRecords);
    return categorizedRecords;
  }, [records]);

  const tabs = [
    { id: "feeding" as TabType, label: "授乳" },
    { id: "sleep" as TabType, label: "睡眠・起床" },
    { id: "diaper" as TabType, label: "おむつ" },
    { id: "measurement" as TabType, label: "身長・体重" },
  ];

  const renderChart = (option: any) => {
    const chartHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
          <style>
            html, body {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              overflow: hidden;
              background-color: white;
            }
            #chart {
              width: 100%;
              height: 100%;
              min-width: 380px;
              min-height: 700px;
              background-color: #f7f7f7;
              display: block;
            }
          </style>
        </head>
        <body>
          <div id="chart"></div>
          <script>
            // 幅が0になる問題を回避するため、初期化を遅延
            setTimeout(function() {
              try {
                var chartDom = document.getElementById('chart');
                
                // サイズを明示的に設定
                chartDom.style.width = '380px';
                chartDom.style.height = '700px';
                
                var myChart = echarts.init(chartDom, null, {
                  renderer: 'canvas',
                  width: 380,
                  height: 700
                });

                var option = ${JSON.stringify(option)};
                
                // WebView内でツールチップのフォーマッターを再定義
                if (option.tooltip) {
                  option.tooltip.formatter = function(params) {
                    // params.value[1]から直接時刻を計算
                    var timeValue = params.value[1];
                    var hours = Math.floor(timeValue);
                    var minutes = Math.round((timeValue % 1) * 60);
                    var displayTime = String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0');
                    
                    var type = params.seriesName === '母乳' ? '母乳' : params.seriesName === 'ミルク' ? 'ミルク' : '';
                    var result = type + ' ' + params.value[0] + ' ' + displayTime;
                    
                    return result;
                  };
                }
                
                myChart.setOption(option);
                
                console.log('Chart initialized with size:', myChart.getWidth(), 'x', myChart.getHeight());

                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'chartInitialized',
                  success: true,
                  containerSize: {
                    width: chartDom.offsetWidth,
                    height: chartDom.offsetHeight
                  },
                  chartSize: {
                    width: myChart.getWidth(),
                    height: myChart.getHeight()
                  }
                }));
              } catch (error) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'error',
                  message: error.message
                }));
              }
            }, 500); // 500ms後に初期化
          </script>
        </body>
      </html>
    `;

    return (
      <View style={{ width: '100%', height: 700, backgroundColor: 'white' }}>
        <WebView
          source={{ html: chartHtml }}
          style={{ width: '100%', height: 700, backgroundColor: 'white' }}
          onLoadEnd={() => {
            console.log('WebView loaded');
          }}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView error:', nativeEvent);
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          originWhitelist={['*']}
          useWebKit={true}
          cacheEnabled={false}
          onMessage={(event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data);
              console.log('WebView message:', data);
            } catch (error) {
              console.log('Raw WebView message:', event.nativeEvent.data, 'error:', error);
            }
          }}
        />
      </View>
    );
  };

  // 実際のデータに基づくチャートオプションを生成
  const generateChartOptions = (tabType: TabType) => {
    const records = actualData[tabType];
    
    if (!records || records.length === 0) {
      // データがない場合のデフォルト表示
      return {
        title: {
          text: "データがありません",
          left: "center",
          top: "center",
          textStyle: {
            color: "#999",
            fontSize: 16
          }
        },
        xAxis: { type: 'category', data: [] },
        yAxis: { type: 'value' },
        series: [{ data: [], type: 'bar' }]
      };
    }

    switch (tabType) {
      case "feeding":
        // 授乳データの処理
        if (records.length === 0) {
          return {
            title: {
              text: "授乳記録",
              left: "center",
            },
            xAxis: { type: 'category', data: [] },
            yAxis: { type: 'value', name: '時間', min: 0, max: 24 },
            series: [{ data: [], type: 'scatter' }]
          };
        }

        // 過去7日間の日付を生成
        const dates = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          dates.push(`${date.getMonth() + 1}/${date.getDate()}`);
        }

        // 授乳データを日付と時間で整理
        const feedingData = records.slice(0, 20).map(record => {
          const recordDate = new Date(record.timestamp);
          const hours = recordDate.getHours() + recordDate.getMinutes() / 60;
          const dateStr = `${recordDate.getMonth() + 1}/${recordDate.getDate()}`;
          const feedingType = record.details?.feeding?.type || 'breast';
          
          return {
            date: dateStr,
            time: hours,
            type: feedingType,
            value: [dateStr, hours]
          };
        });

        // 母乳、ミルク、両方のデータを分離
        const breastData = feedingData.filter(item => item.type === 'breast').map(item => item.value);
        const formulaData = feedingData.filter(item => item.type === 'formula').map(item => item.value);
        // 現在の実装では両方の記録は別々に記録されるため、bothDataは空配列
        const bothData: any[] = [];

        return {
          title: {
            show: false
          },
          tooltip: {
            show: true,
            trigger: 'item',
            formatter: function(params: any) {
              console.log('Tooltip params:', params);
              // params.value[1]から直接時刻を計算
              const timeValue = params.value[1] as number;
              const hours = Math.floor(timeValue);
              const minutes = Math.round((timeValue % 1) * 60);
              const displayTime = String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0');
              
              const type = params.seriesName === '母乳' ? '母乳' : params.seriesName === 'ミルク' ? 'ミルク' : '両方';
              const result = type + ' ' + params.value[0] + ' ' + displayTime;
              return result;
            }
          },
          grid: {
            left: '8%',
            right: '10%',
            top: '5%',
            bottom: '10%'
          },
          xAxis: {
            type: 'category',
            data: dates,
            name: '',
            axisLabel: {
              interval: 0,
              rotate: 30
            }
          },
          yAxis: {
            type: 'value',
            name: '',
            min: 0,
            max: 23,
            interval: 1,
            axisLabel: {
              formatter: function(value: number) {
                return String(value).padStart(2, '0') + ':00';
              }
            }
          },
          series: [
            {
              name: '母乳',
              type: 'scatter',
              data: breastData,
              itemStyle: {
                color: '#FF69B4',
                opacity: 0.8
              },
              symbolSize: 12,
              blendMode: 'multiply',
              tooltip: {
                show: true
              }
            },
            {
              name: 'ミルク',
              type: 'scatter',
              data: formulaData,
              itemStyle: {
                color: '#87CEEB',
                opacity: 0.8
              },
              symbolSize: 12,
              blendMode: 'multiply',
              tooltip: {
                show: true
              }
            },
            {
              name: '両方',
              type: 'scatter',
              data: bothData,
              itemStyle: {
                color: '#9370DB',
                opacity: 1.0
              },
              symbolSize: 12,
              tooltip: {
                show: true
              }
            }
          ],
          legend: {
            data: ['母乳', 'ミルク'],
            bottom: 5,
            itemGap: 20,
            textStyle: {
              fontSize: 12
            }
          }
        };

      case "sleep":
        // 睡眠・起床データの処理
        if (records.length === 0) {
          return {
            title: {
              text: "睡眠・起床記録",
              left: "center",
            },
            xAxis: { type: 'category', data: [] },
            yAxis: { type: 'value', name: '時間', min: 0, max: 24 },
            series: [{ data: [], type: 'scatter' }]
          };
        }

        // 過去7日間の日付を生成
        const sleepDates = [];
        const sleepToday = new Date();
        for (let i = 6; i >= 0; i--) {
          const date = new Date(sleepToday);
          date.setDate(sleepToday.getDate() - i);
          sleepDates.push(`${date.getMonth() + 1}/${date.getDate()}`);
        }

        // 睡眠・起床データを日付と時間で整理
        const sleepData = records.slice(0, 20).map(record => {
          const recordDate = new Date(record.timestamp);
          const hours = recordDate.getHours() + recordDate.getMinutes() / 60;
          const dateStr = `${recordDate.getMonth() + 1}/${recordDate.getDate()}`;
          const recordType = record.type; // 'sleep' または 'wakeup'
          
          return {
            date: dateStr,
            time: hours,
            type: recordType,
            value: [dateStr, hours]
          };
        });

        // 睡眠、起床のデータを分離
        const sleepRecords = sleepData.filter(item => item.type === 'sleep').map(item => item.value);
        const wakeupRecords = sleepData.filter(item => item.type === 'wakeup').map(item => item.value);

        return {
          title: {
            show: false
          },
          tooltip: {
            show: true,
            trigger: 'item',
            formatter: function(params: any) {
              console.log('Sleep tooltip params:', params);
              // params.value[1]から直接時刻を計算
              const timeValue = params.value[1] as number;
              const hours = Math.floor(timeValue);
              const minutes = Math.round((timeValue % 1) * 60);
              const displayTime = String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0');
              
              const type = params.seriesName === '睡眠' ? '睡眠' : '起床';
              const result = type + '<br/>' + params.value[0] + ' ' + displayTime;
              console.log('Sleep tooltip result:', result);
              return result;
            }
          },
          grid: {
            left: '8%',
            right: '10%',
            top: '5%',
            bottom: '15%'
          },
          xAxis: {
            type: 'category',
            data: sleepDates,
            name: '',
            axisLabel: {
              interval: 0,
              rotate: 30
            }
          },
          yAxis: {
            type: 'value',
            name: '',
            min: 0,
            max: 23,
            interval: 1,
            axisLabel: {
              formatter: function(value: number) {
                return String(value).padStart(2, '0') + ':00';
              }
            }
          },
          series: [
            {
              name: '睡眠',
              type: 'scatter',
              data: sleepRecords,
              itemStyle: {
                color: '#ad9ce6',
                opacity: 0.8
              },
              symbolSize: 12,
              blendMode: 'multiply',
              tooltip: {
                show: true
              }
            },
            {
              name: '起床',
              type: 'scatter',
              data: wakeupRecords,
              itemStyle: {
                color: '#e6ac73',
                opacity: 0.8
              },
              symbolSize: 12,
              blendMode: 'multiply',
              tooltip: {
                show: true
              }
            }
          ],
          legend: {
            data: ['睡眠', '起床'],
            bottom: 5,
            itemGap: 20,
            textStyle: {
              fontSize: 12
            }
          }
        };

      case "diaper":
        // おむつデータの処理（後で実装）
        return {
          title: {
            text: "おむつ交換記録",
            left: "center",
          },
          xAxis: {
            type: 'category',
            data: records.slice(0, 7).map((_, index) => `${index + 1}回目`)
          },
          yAxis: {
            type: 'value',
            name: '回数',
          },
          series: [
            {
              name: "おしっこ",
              type: "bar",
              stack: "total",
              data: records.slice(0, 7).map(() => Math.floor(Math.random() * 3) + 1),
              itemStyle: { color: "#ffcc66" }
            },
            {
              name: "うんち",
              type: "bar",
              stack: "total",
              data: records.slice(0, 7).map(() => Math.floor(Math.random() * 2)),
              itemStyle: { color: "#9b7653" }
            }
          ]
        };

      case "measurement":
        // 測定データの処理（後で実装）
        return {
          title: {
            text: "測定記録",
            left: "center",
          },
          xAxis: {
            type: 'category',
            data: records.slice(0, 7).map((_, index) => `${index + 1}回目`)
          },
          yAxis: [
            {
              type: 'value',
              name: '身長 (cm)',
              position: 'left',
              axisLine: { lineStyle: { color: "#8bc2ef" } }
            },
            {
              type: 'value',
              name: '体重 (kg)',
              position: 'right',
              axisLine: { lineStyle: { color: "#f3a95f" } }
            }
          ],
          series: [
            {
              name: "身長",
              type: "line",
              data: records.slice(0, 7).map(() => Math.random() * 10 + 50),
              itemStyle: { color: "#8bc2ef" }
            },
            {
              name: "体重",
              type: "line",
              yAxisIndex: 1,
              data: records.slice(0, 7).map(() => Math.random() * 2 + 3),
              itemStyle: { color: "#f3a95f" }
            }
          ]
        };

      default:
        return {
          title: { text: "データなし", left: "center" },
          xAxis: { type: 'category', data: [] },
          yAxis: { type: 'value' },
          series: [{ data: [], type: 'bar' }]
        };
    }
  };

  const getGraphContainerStyle = (tabId: TabType) => {
    switch (tabId) {
      case "feeding":
        return styles.feedingGraphContainer;
      case "sleep":
        return styles.sleepGraphContainer;
      case "diaper":
        return styles.diaperGraphContainer;
      case "measurement":
        return styles.measurementGraphContainer;
      default:
        return {};
    }
  };

  const renderTabContent = () => {
    console.log("Rendering tab content for:", activeTab);
    const chartOptions = generateChartOptions(activeTab);
    return renderChart(chartOptions);
  };

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
          <View style={styles.content}>
            <View style={styles.tabContainer}>
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab.id}
                  style={[
                    styles.tab,
                    activeTab === tab.id
                      ? styles.activeTab
                      : styles.inactiveTab,
                  ]}
                  onPress={() => setActiveTab(tab.id)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === tab.id
                        ? styles.activeTabText
                        : styles.inactiveTabText,
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View
              style={[styles.graphContainer, getGraphContainerStyle(activeTab)]}
            >
              {renderTabContent()}
            </View>
          </View>

          <View style={styles.aiContainer}>
            <View style={styles.aiIconContainer}>
              <View style={styles.aiIcon}>
                <TablerIcon xml={aiIcon} width={30} height={30} strokeColor="#FFF" fillColor="none" />
              </View>
              <Text style={styles.aiIconText}>AI分析コメント</Text>
            </View>
            <Text style={styles.aiCommentText}>
              {actualData[activeTab]?.length > 0 
                ? `${activeTab === 'feeding' ? '授乳' : activeTab === 'sleep' ? '睡眠・起床' : activeTab === 'diaper' ? 'おむつ交換' : '測定'}記録が${actualData[activeTab].length}件あります。データを分析中...`
                : `${activeTab === 'feeding' ? '授乳' : activeTab === 'sleep' ? '睡眠・起床' : activeTab === 'diaper' ? 'おむつ交換' : '測定'}記録がまだありません。記録を追加して統計を確認しましょう。`
              }
            </Text>
          </View>
        </View>
      </ScrollView>
      <BottomNavigation />
    </SafeAreaView>
  );
};

export default StatisticsScreen;
