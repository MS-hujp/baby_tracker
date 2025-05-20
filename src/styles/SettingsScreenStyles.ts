import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
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
    backgroundColor: "#fff",
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    height: "auto",
    borderRadius: 20,
  },
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
    marginBottom: 15,
  },
  titleText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#454444",
  },
  titleIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#999999",
  },
  settingsContainer: {
    marginTop: 20,
    paddingVertical: 20,
    alignItems: "center",
  },
  settingsText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
  },
});

export default styles; 