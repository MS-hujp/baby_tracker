import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { FamilyCreation } from '../components/FamilyCreation';

type RootStackParamList = {
  Settings: undefined;
  CreateFamily: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CreateFamilyScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleFamilyCreated = (familyId: string) => {
    // 家族作成後、設定画面に戻る
    navigation.navigate('Settings');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <FamilyCreation onFamilyCreated={handleFamilyCreated} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe5e5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
});

export default CreateFamilyScreen; 