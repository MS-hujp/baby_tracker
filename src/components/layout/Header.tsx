import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import styles from "../../styles/HeaderStyles";
import { Participant } from "../../types/family";

interface HeaderProps {
  name: string;
  ageInDays: number;
  participants: Participant[];
}

const Header: React.FC<HeaderProps> = ({ name, ageInDays, participants }) => {
  return (
    <View style={styles.header}>
      <View style={styles.babyInfo}>
        <FontAwesome name="user-circle" size={50} color="white" />
        <Text style={styles.babyName}>{name}</Text>
        <Text style={styles.age}>(生後{ageInDays}日)</Text>
      </View>
      <View style={styles.participants}>
        {participants.map((participant, index) => (
          <View
            key={index}
            style={styles.participant}
          >
            <MaterialIcons name="child-care" size={24} color={participant.color} />
            <Text style={styles.participantName}>{participant.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Header; 