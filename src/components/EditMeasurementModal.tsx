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

interface EditMeasurementModalProps {
  visible: boolean;
  onClose: () => void;
  type: 'weight' | 'height';
  currentValue?: number;
}

export const EditMeasurementModal: React.FC<EditMeasurementModalProps> = ({
  visible,
  onClose,
  type,
  currentValue
}) => {
  const [value, setValue] = useState(currentValue?.toString() || '');
  const [loading, setLoading] = useState(false);
  const { updateBabyInfo, error } = useBaby();

  const handleSave = async () => {
    const numValue = parseFloat(value);
    
    if (isNaN(numValue) || numValue <= 0) {
      Alert.alert('エラー', '正しい値を入力してください');
      return;
    }

    try {
      setLoading(true);
      
      const updateData: any = {};
      if (type === 'weight') {
        updateData.weight = numValue;
      } else {
        updateData.height = numValue;
      }
      
      await updateBabyInfo(updateData);
      onClose();
      setValue('');
    } catch (err) {
      Alert.alert('エラー', '更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setValue(currentValue?.toString() || '');
    onClose();
  };

  const title = type === 'weight' ? '体重を編集' : '身長を編集';
  const unit = type === 'weight' ? 'g' : 'cm';
  const placeholder = type === 'weight' ? '例: 4026' : '例: 63';

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{title}</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={setValue}
              placeholder={placeholder}
              keyboardType="numeric"
              editable={!loading}
            />
            <Text style={styles.unit}>{unit}</Text>
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
              disabled={loading || !value.trim()}
            >
              <Text style={styles.textSave}>
                {loading ? '保存中...' : '保存'}
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    width: 150,
    textAlign: 'center',
  },
  unit: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '600',
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