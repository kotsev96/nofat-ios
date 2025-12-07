import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { formatDate, getDaysOptions } from '../../utils/dateUtils';

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  today: Date;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  onClose,
  selectedDate,
  onSelectDate,
  today,
}) => {
  // Calculate tomorrow as the start date for options
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const options = getDaysOptions(tomorrow);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.datePickerModal}>
          <View style={styles.datePickerHeader}>
            <Text style={styles.datePickerTitle}>Select Date</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.dateOptionsScrollView}
            contentContainerStyle={styles.dateOptionsContainer}
            showsVerticalScrollIndicator={true}
          >
            {options.map((date, index) => {
              const isSelected = date.getTime() === selectedDate.getTime();
              const isToday = date.getTime() === today.getTime();
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateOption,
                    isSelected && styles.dateOptionSelected,
                  ]}
                  onPress={() => onSelectDate(date)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dateOptionText,
                      isSelected && styles.dateOptionTextSelected,
                    ]}
                  >
                    {formatDate(date)}
                    {isToday && ' (Today)'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackdrop: {
    flex: 1,
  },
  datePickerModal: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    paddingTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 50 : theme.spacing.xl + 10,
    maxHeight: '70%',
    ...theme.shadows.lg,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.secondary,
  },
  datePickerTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  dateOptionsScrollView: {
    maxHeight: 400,
  },
  dateOptionsContainer: {
    gap: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.lg,
  },
  dateOption: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.backgroundSecondary,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dateOptionSelected: {
    backgroundColor: theme.colors.glassDark,
    borderColor: theme.colors.primary,
  },
  dateOptionText: {
    ...theme.typography.body,
    color: theme.colors.text,
    textAlign: 'center',
  },
  dateOptionTextSelected: {
    ...theme.typography.bodyBold,
    color: theme.colors.primary,
  },
});

