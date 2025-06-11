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
    flex: 1,
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
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: "#f5f5f5",
  },
  editButtonText: {
    fontSize: 12,
    color: "#666",
  },
  settingsContainer: {
    gap: 15,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 15,
    paddingVertical: 10,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#999999",
  },
  settingContent: {
    flex: 1,
  },
  settingArrow: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.5,
  },
  settingLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  settingValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  participantsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 5,
  },
  participant: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  participantName: {
    fontSize: 14,
    color: "#333",
  },
  addParticipantButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    backgroundColor: "#f5f5f5",
  },
  addParticipantText: {
    fontSize: 14,
    color: "#666",
  },
});

export default styles; 