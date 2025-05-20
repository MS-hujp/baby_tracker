import React, { useState } from "react";
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
import { styles } from "../styles/StatisticsScreenStyles";
type TabType = "feeding" | "sleep" | "diaper" | "measurement";

const StatisticsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("feeding");

  const headerProps = {
    babyName: "まきちゃん",
    ageInDays: 30,
    participants: [
      { name: "ゆか", color: "#FFF" },
      { name: "けん", color: "blue" },
    ],
  };

  const tabs = [
    { id: "feeding" as TabType, label: "授乳" },
    { id: "sleep" as TabType, label: "睡眠" },
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
              min-width: 300px;
              min-height: 300px;
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
                chartDom.style.width = '300px';
                chartDom.style.height = '300px';
                
                console.log('Chart container size before init:', chartDom.offsetWidth, 'x', chartDom.offsetHeight);
                
                var myChart = echarts.init(chartDom, null, {
                  renderer: 'canvas',
                  width: 300,
                  height: 300
                });

                var option = ${JSON.stringify(option)};
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
      <View style={{ width: '100%', height: 350, backgroundColor: 'white' }}>
        <WebView
          source={{ html: chartHtml }}
          style={{ width: '100%', height: 350, backgroundColor: 'white' }}
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

  const sampleData = {
    feeding: {
      option: {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
        },
        yAxis: {
          type: 'value',
          name: 'ml',
        },
        series: [{
          data: [120, 200, 150, 80, 70],
          type: 'bar'
        }]
      }
    },
    sleep: {
      option: {
        backgroundColor: "#ffffff",
        title: {
          text: "睡眠時間の推移",
          left: "center",
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          data: ["1日", "2日", "3日", "4日", "5日", "6日", "7日"],
        },
        yAxis: {
          type: "value",
          name: "時間（時間）",
        },
        series: [
          {
            name: "睡眠時間",
            type: "line",
            data: [14, 13, 15, 14, 13, 14, 15],
            smooth: true,
            itemStyle: {
              color: "#ac73e6",
            },
          },
        ],
      },
    },
    diaper: {
      option: {
        backgroundColor: "#ffffff",
        title: {
          text: "おむつ交換回数",
          left: "center",
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          data: ["1日", "2日", "3日", "4日", "5日", "6日", "7日"],
        },
        yAxis: {
          type: "value",
          name: "回数",
        },
        series: [
          {
            name: "おしっこ",
            type: "bar",
            stack: "total",
            data: [5, 6, 5, 7, 6, 5, 6],
            itemStyle: {
              color: "#ffcc66",
            },
          },
          {
            name: "うんち",
            type: "bar",
            stack: "total",
            data: [2, 1, 2, 1, 2, 1, 2],
            itemStyle: {
              color: "#9b7653",
            },
          },
        ],
      },
    },
    measurement: {
      option: {
        backgroundColor: "#ffffff",
        title: {
          text: "身長・体重の推移",
          left: "center",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
        },
        legend: {
          data: ["身長", "体重"],
          bottom: 10,
        },
        xAxis: {
          type: "category",
          data: ["出生時", "1ヶ月", "2ヶ月", "3ヶ月", "4ヶ月", "5ヶ月", "6ヶ月"],
        },
        yAxis: [
          {
            type: "value",
            name: "身長 (cm)",
            position: "left",
            min: 40,
            axisLine: {
              lineStyle: {
                color: "#8bc2ef",
              },
            },
          },
          {
            type: "value",
            name: "体重 (kg)",
            position: "right",
            min: 2,
            max: 8,
            axisLine: {
              lineStyle: {
                color: "#f3a95f",
              },
            },
          },
        ],
        series: [
          {
            name: "身長",
            type: "line",
            data: [48, 53, 57, 62, 65, 68, 70],
            itemStyle: {
              color: "#8bc2ef",
            },
          },
          {
            name: "体重",
            type: "line",
            yAxisIndex: 1,
            data: [3.1, 4.2, 5.0, 5.6, 6.1, 6.5, 6.8],
            itemStyle: {
              color: "#f3a95f",
            },
          },
        ],
      },
    },
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
    switch (activeTab) {
      case "feeding":
        return renderChart(sampleData.feeding.option);
      case "sleep":
        return renderChart(sampleData.sleep.option);
      case "diaper":
        return renderChart(sampleData.diaper.option);
      case "measurement":
        return renderChart(sampleData.measurement.option);
      default:
        return null;
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
          <Header name={""} {...headerProps} />
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
            <Text style={styles.aiCommentText}>授乳タイミングはおよそ30分以内のずれで毎日飲めているようです。この調子だと３週間後には10分以内のずれで授乳すれば赤ちゃんも快適です。あともう少し、がんばりましょう。</Text>
          </View>
        </View>
      </ScrollView>
      <BottomNavigation />
    </SafeAreaView>
  );
};

export default StatisticsScreen;
