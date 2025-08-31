import React from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDeviceSession } from '../hooks/useDeviceSession';
import { determineAuthFlow } from '../utils/deviceAuth';

// Step1テスト用のデバッグコンポーネント
export const DeviceSessionDebug: React.FC = () => {
  const { session, loading, error, resetSession } = useDeviceSession();
  
  // 認証フロー判定
  const authFlow = determineAuthFlow(loading, session, error);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🔍 デバイスセッション初期化中...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📱 デバイスセッション情報</Text>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌ エラー: {error}</Text>
        </View>
      )}
      
      {session && (
        <View style={styles.sessionContainer}>
          <Text style={styles.sectionTitle}>📋 セッション詳細</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>デバイスID:</Text>
            <Text style={styles.value}>{session.deviceId}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>家族ID:</Text>
            <Text style={styles.value}>{session.familyId || '未設定'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>最後のユーザーID:</Text>
            <Text style={styles.value}>{session.lastUserId || '未設定'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>初回起動:</Text>
            <Text style={styles.value}>{session.isFirstTime ? 'はい' : 'いいえ'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>ユーザー選択回数:</Text>
            <Text style={styles.value}>{session.userSelectionCount}回</Text>
          </View>
        </View>
      )}
      
      <View style={styles.flowContainer}>
        <Text style={styles.sectionTitle}>🚀 認証フロー判定</Text>
        
        <View style={[styles.flowState, getFlowStateStyle(authFlow.state)]}>
          <Text style={styles.flowStateText}>
            状態: {getFlowStateLabel(authFlow.state)}
          </Text>
        </View>
        
        {authFlow.error && (
          <Text style={styles.errorText}>エラー: {authFlow.error}</Text>
        )}
      </View>
      
      <View style={styles.actionContainer}>
        <Text style={styles.sectionTitle}>🛠️ 開発者アクション</Text>
        
        <Button
          title="🔄 セッションをリセット"
          onPress={resetSession}
          color="#ff6b6b"
        />
        
        <Text style={styles.helpText}>
          ※ セッションリセットで初回起動状態に戻ります
        </Text>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>ℹ️ Step1テスト項目</Text>
        <Text style={styles.helpText}>
          ✅ デバイスID生成・保存{'\n'}
          ✅ 初回起動判定{'\n'}
          ✅ AsyncStorage操作{'\n'}
          ✅ 認証フロー判定{'\n'}
          ✅ セッション状態管理
        </Text>
      </View>
    </ScrollView>
  );
};

const getFlowStateLabel = (state: string): string => {
  switch (state) {
    case 'checking': return '初期化中';
    case 'first_time': return '初回起動（家族作成必要）';
    case 'user_selection': return 'ユーザー選択必要';
    case 'auto_login': return '自動ログイン可能';
    case 'error': return 'エラー状態';
    default: return '不明';
  }
};

const getFlowStateStyle = (state: string) => {
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
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sessionContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  flowContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  actionContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: '#e8f5e8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorContainer: {
    backgroundColor: '#ffe8e8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    width: 120,
  },
  value: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  flowState: {
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  flowStateText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  errorText: {
    fontSize: 14,
    color: '#ff7675',
    marginTop: 8,
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 10,
    lineHeight: 18,
  },
}); 