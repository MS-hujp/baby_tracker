import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffe5e5",
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 0,
  },
  scrollView: {
    flex: 1,
  },
  innerContainer: {
    paddingHorizontal: 10,
    height: "auto",
  },
  content: {
    backgroundColor: '#fff',
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    height: "auto",
    borderRadius: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 2,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#ac73e6',
  },
  inactiveTab: {
    backgroundColor: '#f0f0f0',
  },
  tabText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#ffffff',
  },
  inactiveTabText: {
    color: '#666666',
  },
  graphContainer: {
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedingGraphContainer: {
    backgroundColor: '#e6ffe5', // 薄い黄緑
  },
  sleepGraphContainer: {
    backgroundColor: '#f5e6ff', // 薄い紫
  },
  diaperGraphContainer: {
    backgroundColor: '#ffe5cc', // オレンジ
  },
  measurementGraphContainer: {
    backgroundColor: '#e5f6ff', // 水色
  },
  graphPlaceholderText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#454444',
  },
  cardContent: {
    fontSize: 14,
    color: '#666',
  },
  aiContainer: {
    backgroundColor: '#fff',
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    height: "auto",
    borderRadius: 20,
  },
  aiIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#ac73e6',
  },
  aiIconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 5,
    marginLeft: 10,
  },
  aiIconText: {
    color: '#454444',
    fontSize: 16,
    fontWeight: 'bold',
  },
  aiCommentText: {
    color: '#454444',
    fontSize: 14,
    fontWeight: 'normal',
    margin: 10,
  },
}); 