import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#ffadad",
    padding: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  babyInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  babyName: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#333",
  },
  age: {
    fontSize: 16,
    color: "#555",
    marginLeft: 5,
  },
  participants: {
    flexDirection: "row",
    marginTop: 10,
  },
  participant: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  currentUserParticipant: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  participantName: {
    fontSize: 14,
    color: "#333",
    marginLeft: 5,
  },
  currentUserName: {
    fontWeight: "bold",
    color: "#007AFF",
  },
});

export default styles; 