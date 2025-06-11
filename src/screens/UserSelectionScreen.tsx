import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, Button, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { DeviceSessionDebug } from '../components/DeviceSessionDebug';
import { useBaby } from '../contexts/BabyContext';
import { useDeviceSession } from '../hooks/useDeviceSession';
import { RootStackParamList } from '../navigation/AppNavigator';
import { determineAuthFlow } from '../utils/deviceAuth';

type UserSelectionScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Step3.2：ユーザー選択の永続化機能
const UserSelectionScreen = () => {
  const navigation = useNavigation<UserSelectionScreenNavigationProp>();
  const { session, loading, error, saveLastUserId } = useDeviceSession();
  const { family, familyId, loading: familyLoading } = useBaby();
  const [isSelecting, setIsSelecting] = useState(false);
  
  // 認証フロー判定
  const authFlow = determineAuthFlow(loading, session, error);

  const handleSelectUser = async (userId: string, userName: string) => {
    try {
      setIsSelecting(true);
      
      console.log('👤 User selected:', userId, userName);
      console.log('💾 Saving user selection to device session...');
      
      // Step3.2：ユーザー選択を永続化
      await saveLastUserId(userId);
      
      console.log('✅ User selection saved successfully');
      
      // 成功メッセージを表示
      Alert.alert(
        '✅ ユーザー選択完了',
        `${userName}として登録されました！\n\nStep3.2のテストが正常に完了しました。`,
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            }
          }
        ]
      );
      
    } catch (err) {
      console.error('❌ Failed to save user selection:', err);
      Alert.alert(
        'エラー',
        'ユーザー選択の保存に失敗しました。',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSelecting(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.innerContainer}>
          <Text style={styles.stepTitle}>🧪 Step3.2: ユーザー選択永続化テスト</Text>
          
          {/* 認証フロー状態表示 */}
          <View style={styles.flowStatusContainer}>
            <Text style={styles.flowStatusTitle}>🚀 現在の認証フロー状態</Text>
            <View style={[styles.flowStatusBadge, getFlowStatusStyle(authFlow.state)]}>
              <Text style={styles.flowStatusText}>
                {getFlowStatusLabel(authFlow.state)}
              </Text>
            </View>
          </View>

          {/* 家族情報表示 */}
          {familyId && (
            <View style={styles.familyInfoContainer}>
              <Text style={styles.familyInfoTitle}>👨‍👩‍👧‍👦 家族情報</Text>
              <Text style={styles.familyInfoText}>家族ID: {familyId}</Text>
              {familyLoading ? (
                <Text style={styles.familyInfoText}>家族データ読み込み中...</Text>
              ) : family ? (
                <View>
                  <Text style={styles.familyInfoText}>
                    赤ちゃん: {family.babies.length > 0 ? family.babies[0].name : '未設定'}
                  </Text>
                  <Text style={styles.familyInfoText}>
                    メンバー数: {family.members.length}人
                  </Text>
                </View>
              ) : (
                <Text style={styles.familyInfoText}>家族データ取得中...</Text>
              )}
            </View>
          )}

          {/* ユーザー選択セクション */}
          <View style={styles.userSelectionContainer}>
            <Text style={styles.userSelectionTitle}>👤 ユーザーを選択してください</Text>
            <Text style={styles.selectionNote}>
              選択したユーザーはデバイスに保存され、次回から自動ログインに使用されます。
            </Text>
            
            {family && family.members ? (
              family.members.map((member, index) => (
                <View key={member.id || index} style={styles.memberCard}>
                  <View 
                    style={[styles.memberAvatar, { backgroundColor: member.color }]}
                  />
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{member.displayName}</Text>
                    <Text style={styles.memberRole}>
                      {member.role === 'dad' ? 'パパ' : member.role === 'mom' ? 'ママ' : member.role}
                    </Text>
                  </View>
                  <Button
                    title={isSelecting ? "保存中..." : "選択"}
                    onPress={() => handleSelectUser(member.id, member.displayName)}
                    color={member.color}
                    disabled={isSelecting}
                  />
                </View>
              ))
            ) : (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>家族メンバーを読み込み中...</Text>
              </View>
            )}
          </View>

          {/* 戻るボタン */}
          <Button
            title="← 戻る"
            onPress={handleGoBack}
            color="#666"
            disabled={isSelecting}
          />

          {/* Step3.2テスト情報 */}
          <View style={styles.testContainer}>
            <Text style={styles.testTitle}>🧪 Step3.2テスト項目</Text>
            <Text style={styles.testText}>
              ✅ ユーザー選択{'\n'}
              ✅ AsyncStorage保存{'\n'}
              ✅ 選択回数カウント{'\n'}
              ✅ 認証フロー更新
            </Text>
          </View>

          {/* デバイスセッション詳細 */}
          <DeviceSessionDebug />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getFlowStatusLabel = (state: string): string => {
  switch (state) {
    case 'checking': return '初期化中...';
    case 'first_time': return '初回起動（家族作成必要）';
    case 'user_selection': return 'ユーザー選択必要';
    case 'auto_login': return '自動ログイン可能';
    case 'error': return 'エラー状態';
    default: return '不明';
  }
};

const getFlowStatusStyle = (state: string) => {
  switch (state) {
    case 'checking': return { backgroundColor: '#ffeaa7' };
    case 'first_time': return { backgroundColor: '#74b9ff' };
    case 'user_selection': return { backgroundColor: '#a29bfe' };
    case 'auto_login': return { backgroundColor: '#00b894' };
    case 'error': return { backgroundColor: '#ff7675' };
    default: return { backgroundColor: '#ddd' };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  innerContainer: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#6c5ce7',
  },
  flowStatusContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  flowStatusTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  flowStatusBadge: {
    padding: 12,
    borderRadius: 6,
  },
  flowStatusText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  familyInfoContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  familyInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  familyInfoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  userSelectionContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  userSelectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  memberRole: {
    fontSize: 14,
    color: '#666',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  selectionNote: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  testContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  testTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  testText: {
    fontSize: 14,
    color: '#666',
  },
});

export default UserSelectionScreen; 