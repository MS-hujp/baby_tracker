import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { FamilyCreation } from '../components/FamilyCreation';

const CreateFamilyModal: React.FC = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(true);

  const handleFamilyCreated = async (familyId: string) => {
    try {
      console.log('🎉 Family creation completed in modal, ID:', familyId);
      
      // BabyContextの手動初期化を行わない（競合を完全に避ける）
      // useDeviceSessionのsaveFamilyIdで保存されたfamilyIdは、
      // 画面遷移後に自動的にBabyContextで読み込まれる
      
      // 成功メッセージを表示
      Alert.alert(
        '✅ 家族作成完了',
        '新しい家族が作成され、デバイスが登録されました！\n\nStep2のテストが正常に完了しました。',
        [
          {
            text: 'OK',
            onPress: () => {
              setModalVisible(false);
              navigation.goBack();
            }
          }
        ]
      );
    } catch (error) {
      console.error('❌ Error after family creation:', error);
      Alert.alert(
        'エラー',
        '家族の設定中にエラーが発生しました。',
        [{ text: 'OK' }]
      );
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    navigation.goBack();
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={handleModalClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Step2: 家族作成 + デバイス登録</Text>
          <Text style={styles.headerSubtitle}>新しい家族を作成</Text>
        </View>
        <ScrollView style={styles.content}>
          <FamilyCreation onFamilyCreated={handleFamilyCreated} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2d5a3d',
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
});

export default CreateFamilyModal; 