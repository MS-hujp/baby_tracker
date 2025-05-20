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
    paddingVertical: 20,
    paddingHorizontal: 20,
    height: "auto",
    borderRadius: 20,
  },
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#454444",
  },
  userList: {
    gap: 15,
    marginBottom: 30,
  },
  userButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedUserButton: {
    borderColor: "#ff69b4",
    backgroundColor: "#fff5f9",
  },
  userColor: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 15,
  },
  userName: {
    fontSize: 18,
    color: "#454444",
  },
  loginButton: {
    backgroundColor: "#ff69b4",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default styles; 