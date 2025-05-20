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
    color: "#454444",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 10,
  },
  wakeupIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(137, 196, 255, 1.0)",
  },
  timePickerSection: {
    marginVertical: 20,
  },
  clockIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#b8e68a",
  },
  timePickerLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    marginLeft: 10,
  },
  timePickerContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  timePicker: {
    height: 80,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 50,
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