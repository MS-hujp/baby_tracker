import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { FamilyCreation } from '../components/FamilyCreation';
import { useBaby } from '../contexts/BabyContext';

type RootStackParamList = {
  Main: undefined;
  Settings: undefined;
  CreateFamily: undefined;
  CreateFamilyModal: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CreateFamilyScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { familyId } = useBaby();

  const handleFamilyCreated = (newFamilyId: string) => {
    console.log('Family created successfully with ID:', newFamilyId);
    
    // 家族作成後の処理
    if (familyId) {
      // 既に家族IDがある場合（モーダルから作成）、設定画面に戻る
      navigation.navigate('Settings');
    } else {
      // 初回作成の場合、メインアプリに自動的に遷移
      // BabyContextで自動的にfamilyIdが設定されるため、App.tsxのAppContentで自動的にMainに遷移する
      console.log('Initial family creation completed');
    }
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
    justifyContent: 'center',
  },
});

export default CreateFamilyScreen; 