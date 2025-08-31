import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import styles from "../../styles/HeaderStyles";
import { Participant } from "../../types/family";

interface HeaderProps {
  name: string;
  ageInDays: number;
  participants: Participant[];
  currentUser?: { displayName: string; color: string; role: string } | null;
}

const Header: React.FC<HeaderProps> = ({ name, ageInDays, participants, currentUser }) => {
  return (
    <View style={styles.header}>
      <View style={styles.babyInfo}>
        <FontAwesome name="user-circle" size={50} color="white" />
        <Text style={styles.babyName}>{name}</Text>
        <Text style={styles.age}>(生後{ageInDays}日)</Text>
      </View>
      <View style={styles.participants}>
        {participants.map((participant, index) => {
          const isCurrentUser = currentUser && participant.name === currentUser.displayName;
          
          return (
            <View
              key={index}
              style={[
                styles.participant,
                isCurrentUser && styles.currentUserParticipant
              ]}
            >
              <MaterialIcons 
                name="child-care" 
                size={24} 
                color={participant.color} 
              />
              <Text 
                style={[
                  styles.participantName,
                  isCurrentUser && styles.currentUserName
                ]}
              >
                {participant.name}
                {isCurrentUser && ' (現在)'}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default Header; 