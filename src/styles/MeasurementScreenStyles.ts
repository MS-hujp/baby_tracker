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
  measurementInnerContainer: {
    backgroundColor: "#fff",
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    height: "auto",
    borderRadius: 20,
  },
  measurementContainer: {
    flex: 1,
  },
  recordItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 5,
    gap: 5,
  },
  recordItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(137, 196, 255, 1.0)",
  },
  recordTitle: {
    color: "#45444",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 10,
  },
  datePickerSection: {
    marginTop: 15,
    paddingTop: 10,
    backgroundColor: "#f5f5f5",
  },
  datePickerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
  },
  dateLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#45444",
  },
  datePickerContainer: {
    marginRight: 10,
  },
  datePicker: {
    flex: 1,
    height: 40,
  },
  measurementSection: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  measurementRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  measurementIcon: {
    width: 35,
    height: 35,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(137, 196, 255, 0.8)",
    marginRight: 10,
  },
  measurementLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#45444",
    width: 80,
  },
  measurementInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 5,
  },
  unitText: {
    fontSize: 14,
    color: "#45444",
    marginLeft: 5,
    width: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 30,
    marginBottom: 10,
  },
  button: {
    width: 130,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#9e9e9e',
  },
  okButton: {
    backgroundColor: '#ff69b4',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  memoSection: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 5,
    marginVertical: 20,
  },
  memoIcon: {
    width: 35,
    height: 35,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "gray",
    marginRight: 5,
  },
  memoLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#45444",
  },
  memoInput: {
    borderWidth: 2,
    borderColor: "#45444433",
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: "top",
    fontSize: 14,
    color: "#333333",
  },
});

export default styles; 