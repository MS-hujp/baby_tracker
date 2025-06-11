import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { Button, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { DeviceSessionDebug } from '../components/DeviceSessionDebug';
import { useBaby } from '../contexts/BabyContext';
import { useDeviceSession } from '../hooks/useDeviceSession';
import { RootStackParamList } from '../navigation/AppNavigator';
import { determineAuthFlow } from '../utils/deviceAuth';
import { familyIdResolver } from '../utils/familyIdResolver';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Step2テスト用：デバイスセッション動作確認 + 家族作成テスト画面（無限ループ対策版）
const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { session, loading, error } = useDeviceSession();
  const { setFamilyId, familyId } = useBaby();
  
  // 認証フロー判定
  const authFlow = determineAuthFlow(loading, session, error);

  // 🔧 無限ループ対策：家族ID統一システムを使用
  useEffect(() => {
    const resolveFamilyIdConflict = async () => {
      // ローディング中やresolverが更新中の場合はスキップ
      if (loading || familyIdResolver.isUpdatingFamilyId()) {
        return;
      }

      try {
        // 家族ID競合を解決
        const resolution = await familyIdResolver.resolveFamilyId(
          session?.familyId,
          familyId
        );

        // 競合が解決された場合、またはBabyContextが空の場合は設定
        if (resolution.wasConflictResolved || (!familyId && resolution.resolvedFamilyId)) {
          console.log('🔄 Applying resolved family ID to BabyContext:', resolution.resolvedFamilyId);
          setFamilyId(resolution.resolvedFamilyId);
        }
        
      } catch (err) {
        console.error('❌ Failed to resolve family ID conflict:', err);
      }
    };

    resolveFamilyIdConflict();
  }, [session?.familyId, familyId, loading, setFamilyId]);

  const handleCreateFamily = () => {
    navigation.navigate('CreateFamilyModal');
  };

  const handleUserSelection = () => {
    navigation.navigate('UserSelectionScreen');
  };

  const handleAutoLogin = () => {
    navigation.navigate('AutoLoginScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.innerContainer}>
          <Text style={styles.stepTitle}>🧪 Step2-3: 認証フロー統合テスト</Text>
          
          {/* 認証フロー状態表示 */}
          <View style={styles.flowStatusContainer}>
            <Text style={styles.flowStatusTitle}>🚀 現在の認証フロー状態</Text>
            <View style={[styles.flowStatusBadge, getFlowStatusStyle(authFlow.state)]}>
              <Text style={styles.flowStatusText}>
                {getFlowStatusLabel(authFlow.state)}
              </Text>
            </View>
            {/* 詳細情報の追加 */}
            {session && (
              <View style={styles.flowDetailContainer}>
                <Text style={styles.flowDetailText}>
                  ユーザー選択回数: {session.userSelectionCount}回
                </Text>
                {session.lastUserId && (
                  <Text style={styles.flowDetailText}>
                    前回選択ユーザー: 設定済み
                  </Text>
                )}
              </View>
            )}
          </View>

          {/* 家族作成ボタン */}
          {authFlow.state === 'first_time' && (
            <View style={styles.actionContainer}>
              <Text style={styles.actionTitle}>✨ 初回起動です</Text>
              <Text style={styles.actionDescription}>
                家族情報を作成してデバイス登録をテストしましょう
              </Text>
              <Button
                title="🏠 家族を作成する"
                onPress={handleCreateFamily}
                color="#007AFF"
              />
            </View>
          )}

          {/* ユーザー選択ボタン */}
          {authFlow.state === 'user_selection' && (
            <View style={styles.actionContainer}>
              <Text style={styles.actionTitle}>👤 ユーザー選択が必要です</Text>
              <Text style={styles.actionDescription}>
                家族の中から、このデバイスを使用するユーザーを選択してください
              </Text>
              <Button
                title="👤 ユーザーを選択する"
                onPress={handleUserSelection}
                color="#6c5ce7"
              />
            </View>
          )}

          {/* 自動ログインボタン */}
          {authFlow.state === 'auto_login' && (
            <View style={styles.actionContainer}>
              <Text style={styles.actionTitle}>🔐 自動ログイン可能です</Text>
              <Text style={styles.actionDescription}>
                過去の選択履歴に基づいて、自動的にログインできます
              </Text>
              <Button
                title="🔐 自動ログインを実行"
                onPress={handleAutoLogin}
                color="#00b894"
              />
            </View>
          )}

          {/* その他の状態（完了済み・テスト用） */}
          {authFlow.state !== 'first_time' && authFlow.state !== 'checking' && authFlow.state !== 'user_selection' && authFlow.state !== 'auto_login' && (
            <View style={styles.actionContainer}>
              <Text style={styles.actionTitle}>✅ 認証フロー完了</Text>
              <Text style={styles.actionDescription}>
                認証システムが完了しています。{'\n'}
                各機能をテストできます。
              </Text>
              <Button
                title="🏠 新しい家族を作成"
                onPress={handleCreateFamily}
                color="#28a745"
              />
              <View style={{ marginTop: 10 }}>
                <Button
                  title="👤 ユーザー選択をテスト"
                  onPress={handleUserSelection}
                  color="#6c5ce7"
                />
              </View>
              <View style={{ marginTop: 10 }}>
                <Button
                  title="🔐 自動ログインをテスト"
                  onPress={handleAutoLogin}
                  color="#00b894"
                />
              </View>
            </View>
          )}

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
    color: '#2d5a3d',
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
  actionContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  actionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  flowDetailContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  flowDetailText: {
    fontSize: 14,
    color: '#666',
  },
});

export default LoginScreen; 