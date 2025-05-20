import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import styles from '../styles/LoginScreenStyles';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login } = useAuth();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const users = [
    { id: '1', name: 'ゆか', color: '#FFF' },
    { id: '2', name: 'けん', color: 'blue' },
  ];

  const handleLogin = () => {
    if (!selectedUser) return;

    const user = users.find(u => u.id === selectedUser);
    if (user) {
      login(user);
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }, 100);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 20 }}
        bounces={true}
        showsVerticalScrollIndicator={true}
        alwaysBounceVertical={true}
      >
        <View style={styles.innerContainer}>
          <View style={styles.content}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>ログイン</Text>
            </View>

            <View style={styles.userList}>
              {users.map((user) => (
                <Pressable
                  key={user.id}
                  style={[
                    styles.userButton,
                    selectedUser === user.id && styles.selectedUserButton,
                  ]}
                  onPress={() => setSelectedUser(user.id)}
                >
                  <View style={[styles.userColor, { backgroundColor: user.color }]} />
                  <Text style={styles.userName}>{user.name}</Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              style={[styles.loginButton, !selectedUser && styles.disabledButton]}
              onPress={handleLogin}
              disabled={!selectedUser}
            >
              <Text style={styles.loginButtonText}>ログイン</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen; 