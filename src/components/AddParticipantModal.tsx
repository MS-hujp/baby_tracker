import React, { useState } from 'react';
import {
    Alert,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import { useBaby } from '../contexts/BabyContext';
import { Participant } from '../types/family';

interface AddParticipantModalProps {
  visible: boolean;
  onClose: () => void;
}

const PRESET_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
];

export const AddParticipantModal: React.FC<AddParticipantModalProps> = ({
  visible,
  onClose
}) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [loading, setLoading] = useState(false);
  const { addParticipant, error } = useBaby();

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('エラー', '名前を入力してください');
      return;
    }

    try {
      setLoading(true);
      
      const newParticipant: Participant = {
        name: name.trim(),
        color: selectedColor,
      };
      
      await addParticipant(newParticipant);
      onClose();
      setName('');
      setSelectedColor(PRESET_COLORS[0]);
    } catch (err) {
      Alert.alert('エラー', '参加者の追加に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setSelectedColor(PRESET_COLORS[0]);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>参加者を追加</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>名前</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="名前を入力"
              editable={!loading}
            />
          </View>

          <View style={styles.colorContainer}>
            <Text style={styles.label}>カラー</Text>
            <View style={styles.colorGrid}>
              {PRESET_COLORS.map((color, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.colorSelected
                  ]}
                  onPress={() => setSelectedColor(color)}
                  disabled={loading}
                />
              ))}
            </View>
          </View>

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.buttonCancel]}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={styles.textCancel}>キャンセル</Text>
            </Pressable>
            
            <Pressable
              style={[styles.button, styles.buttonSave]}
              onPress={handleSave}
              disabled={loading || !name.trim()}
            >
              <Text style={styles.textSave}>
                {loading ? '追加中...' : '追加'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    width: '100%',
  },
  colorContainer: {
    width: '100%',
    marginBottom: 20,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorSelected: {
    borderColor: '#333',
    borderWidth: 3,
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    borderRadius: 10,
    padding: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonCancel: {
    backgroundColor: '#f0f0f0',
  },
  buttonSave: {
    backgroundColor: '#007AFF',
  },
  textCancel: {
    color: '#666',
    fontWeight: '600',
  },
  textSave: {
    color: 'white',
    fontWeight: '600',
  },
}); 