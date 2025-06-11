import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Alert, Button, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { DeviceSessionDebug } from '../components/DeviceSessionDebug';
import { useAuth } from '../contexts/AuthContext';
import { useBaby } from '../contexts/BabyContext';
import { useDeviceSession } from '../hooks/useDeviceSession';
import { RootStackParamList } from '../navigation/AppNavigator';
import { determineAuthFlow } from '../utils/deviceAuth';

type AutoLoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Step3.3：自動ログイン機能
const AutoLoginScreen = () => {
  const navigation = useNavigation<AutoLoginScreenNavigationProp>();
  const { session, loading, error } = useDeviceSession();
  const { family, familyId, setFamilyId } = useBaby();
  const { login } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  // 認証フロー判定
  const authFlow = determineAuthFlow(loading, session, error);

  // 選択済みユーザー情報を取得
  useEffect(() => {
    if (family && session?.lastUserId) {
      const user = family.members.find(member => member.id === session.lastUserId);
      setSelectedUser(user);
    }
  }, [family, session?.lastUserId]);

  const handleAutoLogin = async () => {
    try {
      setIsLoggingIn(true);
      
      console.log('🔐 Starting auto login process...');
      
      if (!selectedUser || !session?.familyId) {
        throw new Error('選択済みユーザーまたは家族情報が見つかりません');
      }
      
      console.log('👤 Auto logging in as:', selectedUser.displayName);
      
      // Step3.3：AuthContextのlogin関数を使用
      const userData = {
        id: selectedUser.id,
        name: selectedUser.displayName,
        color: selectedUser.color
      };
      
      console.log('✅ Setting current user in AuthContext:', userData);
      login(userData);
      
      // BabyContextに家族IDが設定されていない場合は設定
      if (!familyId && session.familyId) {
        console.log('🏠 Setting family ID in BabyContext:', session.familyId);
        setFamilyId(session.familyId);
      }
      
      console.log('🎉 Auto login completed successfully!');
      
      // 成功メッセージを表示してホーム画面に遷移
      Alert.alert(
        '✅ ログイン完了',
        `${selectedUser.displayName}としてログインしました！\n\nStep3.3のテストが正常に完了しました。`,
        [
          {
            text: 'ホーム画面へ',
            onPress: () => {
              navigation.navigate('Home');
            }
          }
        ]
      );
      
    } catch (err) {
      console.error('❌ Failed to auto login:', err);
      Alert.alert(
        'ログインエラー',
        '自動ログインに失敗しました。',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSelectDifferentUser = () => {
    navigation.navigate('UserSelectionScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.innerContainer}>
          <Text style={styles.stepTitle}>🧪 Step3.3: 自動ログインテスト</Text>
          
          {/* 認証フロー状態表示 */}
          <View style={styles.flowStatusContainer}>
            <Text style={styles.flowStatusTitle}>🚀 現在の認証フロー状態</Text>
            <View style={[styles.flowStatusBadge, getFlowStatusStyle(authFlow.state)]}>
              <Text style={styles.flowStatusText}>
                {getFlowStatusLabel(authFlow.state)}
              </Text>
            </View>
          </View>

          {/* ユーザー情報表示 */}
          {selectedUser && (
            <View style={styles.userInfoContainer}>
              <Text style={styles.userInfoTitle}>👤 選択済みユーザー</Text>
              <View style={styles.userCard}>
                <View 
                  style={[styles.userAvatar, { backgroundColor: selectedUser.color }]}
                />
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{selectedUser.displayName}</Text>
                  <Text style={styles.userRole}>
                    {selectedUser.role === 'dad' ? 'パパ' : selectedUser.role === 'mom' ? 'ママ' : selectedUser.role}
                  </Text>
                  <Text style={styles.userDetail}>
                    選択回数: {session?.userSelectionCount || 0}回
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* 自動ログインセクション */}
          <View style={styles.autoLoginContainer}>
            <Text style={styles.autoLoginTitle}>🔐 自動ログイン</Text>
            <Text style={styles.autoLoginDescription}>
              過去の選択履歴に基づいて、{selectedUser?.displayName || 'ユーザー'}として自動ログインできます。
            </Text>
            
            <Button
              title={isLoggingIn ? "ログイン中..." : "🔐 自動ログイン実行"}
              onPress={handleAutoLogin}
              color="#00b894"
              disabled={isLoggingIn || !selectedUser}
            />
            
            <View style={styles.buttonSpacer}>
              <Button
                title="👤 別のユーザーを選択"
                onPress={handleSelectDifferentUser}
                color="#6c5ce7"
                disabled={isLoggingIn}
              />
            </View>
          </View>

          {/* 戻るボタン */}
          <Button
            title="← 戻る"
            onPress={handleGoBack}
            color="#666"
            disabled={isLoggingIn}
          />

          {/* Step3.3テスト情報 */}
          <View style={styles.testContainer}>
            <Text style={styles.testTitle}>🧪 Step3.3テスト項目</Text>
            <Text style={styles.testText}>
              ✅ 自動ログイン条件確認{'\n'}
              ✅ ユーザー認証状態設定{'\n'}
              ✅ AuthContext連携{'\n'}
              ✅ ホーム画面遷移
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
    color: '#00b894',
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
  userInfoContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  userInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userRole: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  userDetail: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  autoLoginContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  autoLoginTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  autoLoginDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  buttonSpacer: {
    marginTop: 10,
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

export default AutoLoginScreen; 