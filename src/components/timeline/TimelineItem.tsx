import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TimelineRecord } from '../../types/timeline';

type TimelineItemProps = {
  record: TimelineRecord;
};

const TimelineItem: React.FC<TimelineItemProps> = ({ record }) => {
  const formatTime = (date: Date | undefined) => {
    if (!date) {
      return '時間不明';
    }
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const getRecordText = () => {
    switch (record.type) {
      case 'feeding':
        const type = record.details?.feeding?.type === 'breast' ? '母乳' : 'ミルク';
        const amount = record.details?.feeding?.amount ? `/${record.details.feeding.amount}ml` : '';
        return `${type}${amount}`;
      case 'diaper':
        const pee = record.details?.diaper?.pee ? 'おしっこ' : '';
        const poop = record.details?.diaper?.poop ? 'うんち' : '';
        const types = [pee, poop].filter(Boolean).join('/');
        return types ? `(${types})` : '';
      case 'measurement':
        const measurements = [];
        if (record.details?.measurement?.height) {
          measurements.push(`身長${record.details.measurement.height}cm`);
        }
        if (record.details?.measurement?.weight) {
          measurements.push(`体重${record.details.measurement.weight}kg`);
        }
        if (record.details?.measurement?.temperature) {
          measurements.push(`体温${record.details.measurement.temperature}℃`);
        }
        return measurements.length > 0 ? `(${measurements.join('/')})` : '';
      default:
        return '';
    }
  };

  const getActionText = () => {
    switch (record.type) {
      case 'feeding':
        return '授乳を記録しました';
      case 'sleep':
        return '寝るを記録しました';
      case 'wakeup':
        return '起きるを記録しました';
      case 'diaper':
        return 'おむつ交換を記録しました';
      case 'measurement':
        return '測定を記録しました';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.userName}>{record.user.name}</Text>
        <Text style={styles.actionText}>
          {getActionText()}
          {getRecordText()}
        </Text>
        <Text style={styles.timestamp}>{formatTime(record.timestamp)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  userName: {
    fontWeight: 'bold',
    marginRight: 8,
    color: '#454444',
  },
  actionText: {
    flex: 1,
    color: '#666666',
  },
  timestamp: {
    color: '#999999',
    fontSize: 12,
  },
});

export default TimelineItem; 