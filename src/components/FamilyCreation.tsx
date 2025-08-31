import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useBaby } from '../contexts/BabyContext';
import { useDeviceSession } from '../hooks/useDeviceSession';
import { deviceAuth } from '../utils/deviceAuth';

interface FamilyCreationProps {
  onFamilyCreated?: (familyId: string) => void;
}

const PRESET_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
];

export function FamilyCreation({ onFamilyCreated }: FamilyCreationProps) {
  const [babyName, setBabyName] = useState('');
  const [birthday, setBirthday] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // 家族メンバー情報
  const [dadName, setDadName] = useState('');
  const [dadColor, setDadColor] = useState(PRESET_COLORS[0]);
  const [momName, setMomName] = useState('');
  const [momColor, setMomColor] = useState(PRESET_COLORS[1]);
  const [currentUserRole, setCurrentUserRole] = useState<'dad' | 'mom'>('dad');
  
  const { createNewFamily, error, loading } = useBaby();
  const { session, saveFamilyId } = useDeviceSession();

  const handleCreate = async () => {
    if (!babyName.trim() || !dadName.trim() || !momName.trim()) {
      return;
    }

    if (!session?.deviceId) {
      console.error('❌ Device session not available');
      return;
    }

    try {
      setIsCreating(true);
      
      console.log('🏠 Starting family creation process...');
      
      // Step0: 古いfamilyIdをクリアして競合を防ぐ
      console.log('🧹 Clearing old family data from storage...');
      await AsyncStorage.removeItem('@baby_tracker/family_id');
      
      // 家族メンバー情報を含めて家族を作成
      const familyData = {
        babyName: babyName.trim(),
        birthday,
        members: [
          {
            displayName: dadName.trim(),
            role: 'dad' as const,
            color: dadColor,
            isCurrentUser: currentUserRole === 'dad'
          },
          {
            displayName: momName.trim(),
            role: 'mom' as const,
            color: momColor,
            isCurrentUser: currentUserRole === 'mom'
          }
        ]
      };
      
      // Step1: 家族をFirestoreに作成（BabyContextのfamilyIdは設定しない）
      const familyId = await createNewFamily(familyData.babyName, familyData.birthday, familyData.members);
      console.log('✅ Family created with ID:', familyId);
      
      // Step2: デバイスをFirestoreに登録
      console.log('🔐 Registering device to family...');
      const deviceInfo = deviceAuth.getDeviceInfo();
      await deviceAuth.registerDevice(session.deviceId, familyId, deviceInfo);
      console.log('✅ Device registered successfully');
      
      // Step3: デバイスセッションに家族IDを保存
      console.log('💾 Saving family ID to device session...');
      await saveFamilyId(familyId);
      console.log('✅ Family ID saved to device session');
      
      // Step4: 成功コールバック実行（この時点でBabyContextを初期化する）
      onFamilyCreated?.(familyId);
      
      console.log('🎉 Family creation process completed successfully!');
      
    } catch (err) {
      console.error('❌ Failed to create family:', err);
      // エラーハンドリング（必要に応じてアラート表示など）
    } finally {
      setIsCreating(false);
    }
  };

  const isFormValid = babyName.trim() && dadName.trim() && momName.trim();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>新しい家族を作成</Text>
      
      {/* デバイス情報表示（デバッグ用） */}
      {session && (
        <View style={styles.debugContainer}>
          <Text style={styles.debugTitle}>📱 デバイス情報</Text>
          <Text style={styles.debugText}>ID: {session.deviceId}</Text>
          <Text style={styles.debugText}>初回: {session.isFirstTime ? 'はい' : 'いいえ'}</Text>
        </View>
      )}
      
      {/* 赤ちゃん情報 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>赤ちゃん情報</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>赤ちゃんの名前</Text>
          <TextInput
            style={styles.input}
            value={babyName}
            onChangeText={setBabyName}
            placeholder="赤ちゃんの名前を入力"
            editable={!isCreating && !loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>誕生日</Text>
          <Button
            title={birthday.toLocaleDateString()}
            onPress={() => setShowDatePicker(true)}
            disabled={isCreating || loading}
          />
          {showDatePicker && (
            <DateTimePicker
              value={birthday}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setBirthday(selectedDate);
                }
              }}
            />
          )}
        </View>
      </View>

      {/* 家族メンバー情報 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>家族メンバー</Text>
        
        {/* パパ情報 */}
        <View style={styles.memberContainer}>
          <Text style={styles.memberTitle}>パパ</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>名前</Text>
            <TextInput
              style={styles.input}
              value={dadName}
              onChangeText={setDadName}
              placeholder="パパの名前"
              editable={!isCreating && !loading}
            />
          </View>
          <View style={styles.colorContainer}>
            <Text style={styles.label}>カラー</Text>
            <View style={styles.colorGrid}>
              {PRESET_COLORS.slice(0, 6).map((color, index) => (
                <View
                  key={index}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    dadColor === color && styles.colorSelected
                  ]}
                  onTouchEnd={() => setDadColor(color)}
                />
              ))}
            </View>
          </View>
        </View>

        {/* ママ情報 */}
        <View style={styles.memberContainer}>
          <Text style={styles.memberTitle}>ママ</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>名前</Text>
            <TextInput
              style={styles.input}
              value={momName}
              onChangeText={setMomName}
              placeholder="ママの名前"
              editable={!isCreating && !loading}
            />
          </View>
          <View style={styles.colorContainer}>
            <Text style={styles.label}>カラー</Text>
            <View style={styles.colorGrid}>
              {PRESET_COLORS.slice(6, 12).map((color, index) => (
                <View
                  key={index + 6}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    momColor === color && styles.colorSelected
                  ]}
                  onTouchEnd={() => setMomColor(color)}
                />
              ))}
            </View>
          </View>
        </View>

        {/* 現在のユーザー選択 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>このデバイスを使うのは？</Text>
          <View style={styles.roleSelection}>
            <View
              style={[
                styles.roleOption,
                currentUserRole === 'dad' && styles.roleSelected
              ]}
              onTouchEnd={() => setCurrentUserRole('dad')}
            >
              <Text style={styles.roleText}>パパ</Text>
            </View>
            <View
              style={[
                styles.roleOption,
                currentUserRole === 'mom' && styles.roleSelected
              ]}
              onTouchEnd={() => setCurrentUserRole('mom')}
            >
              <Text style={styles.roleText}>ママ</Text>
            </View>
          </View>
        </View>
      </View>

      {error && (
        <Text style={styles.error}>{error}</Text>
      )}

      <Button
        title={isCreating ? "作成中..." : "家族を作成"}
        onPress={handleCreate}
        disabled={!isFormValid || isCreating || loading || !session?.deviceId}
      />
      
      {/* Step2テスト情報 */}
      <View style={styles.testContainer}>
        <Text style={styles.testTitle}>🧪 Step2テスト項目</Text>
        <Text style={styles.testText}>
          ✅ 家族作成{'\n'}
          ✅ デバイス登録{'\n'}
          ✅ セッション更新{'\n'}
          ✅ Firestore連携
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  debugContainer: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  debugText: {
    fontSize: 12,
    color: '#007AFF',
  },
  section: {
    marginBottom: 32,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  memberContainer: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  memberTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#666',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  colorContainer: {
    marginBottom: 16,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorSelected: {
    borderColor: '#333',
    borderWidth: 3,
  },
  roleSelection: {
    flexDirection: 'row',
    gap: 12,
  },
  roleOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  roleSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  roleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  testContainer: {
    backgroundColor: '#e8f5e8',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 20,
  },
  testTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d5a3d',
    marginBottom: 8,
  },
  testText: {
    fontSize: 12,
    color: '#2d5a3d',
    lineHeight: 18,
  },
}); 