import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HeaderProps {
  babyName: string;
  ageInDays: number;
  participants: {
    name: string;
    color: string;
  }[];
}

const Header = ({ babyName, ageInDays, participants }: HeaderProps) => {
  return (
    <View style={styles.header}>
      <View style={styles.profileContainer}>
        <FontAwesome name="user-circle" size={50} color="white" />
        <Text style={styles.profileName}>{babyName}</Text>
        <Text style={styles.profileAge}>(生後{ageInDays}日)</Text>
      </View>
      <View style={styles.participants}>
        {participants.map((participant, index) => (
          <TouchableOpacity key={index} style={styles.iconButton}>
            <MaterialIcons name="child-care" size={24} color={participant.color} />
            <Text style={styles.participantText}>{participant.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#ffadad",
    padding: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#333",
  },
  profileAge: {
    fontSize: 16,
    color: "#555",
  },
  participants: {
    flexDirection: "row",
    marginTop: 10,
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  participantText: {
    fontSize: 16,
    marginLeft: 5,
  },
});

export default Header; 