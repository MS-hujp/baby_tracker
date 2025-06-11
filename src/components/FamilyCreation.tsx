import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useBaby } from '../contexts/BabyContext';

interface FamilyCreationProps {
  onFamilyCreated?: (familyId: string) => void;
}

export function FamilyCreation({ onFamilyCreated }: FamilyCreationProps) {
  const [babyName, setBabyName] = useState('');
  const [birthday, setBirthday] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { createNewFamily, error, loading } = useBaby();

  const handleCreate = async () => {
    if (!babyName.trim()) {
      return;
    }

    try {
      setIsCreating(true);
      const familyId = await createNewFamily(babyName.trim(), birthday);
      console.log('Created family with ID:', familyId);
      onFamilyCreated?.(familyId);
    } catch (err) {
      console.error('Failed to create family:', err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>新しい家族を作成</Text>
      
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

      {error && (
        <Text style={styles.error}>{error}</Text>
      )}

      <Button
        title={isCreating ? "作成中..." : "家族を作成"}
        onPress={handleCreate}
        disabled={!babyName.trim() || isCreating || loading}
      />
    </View>
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
  error: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
}); 