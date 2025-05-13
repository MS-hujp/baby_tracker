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
  },
  recordSectionContainer: {
    backgroundColor: "#fff",
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    height: "auto",
    borderRadius: 20,
  },
  recordSectionTitle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 5,
    gap: 5,
  },
  recordSectionTitleText: {
    color: "#45444",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 10,
  },
  mealIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(137, 196, 255, 1.0)",
  },
  motherSection: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#E69ED8",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 5,
    gap: 5,
    borderRadius: 10,
    width: "40%",
    paddingVertical: 5,
    paddingHorizontal: 3,
  },
  motherIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  motherIconText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },

});

export default styles; 