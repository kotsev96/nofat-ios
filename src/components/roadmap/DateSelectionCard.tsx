import React, { useState } from 'react';
import { BlurView } from 'expo-blur';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../Button';
import { theme } from '../../theme';
import { formatDate } from '../../utils/dateUtils';
import { DatePickerModal } from './DatePickerModal';

interface DateSelectionCardProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onNext: () => void;
  isLoading: boolean;
  fadeAnim: Animated.Value;
  today: Date;
}

export const DateSelectionCard: React.FC<DateSelectionCardProps> = ({
  selectedDate,
  onSelectDate,
  onNext,
  isLoading,
  fadeAnim,
  today,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateSelect = (date: Date) => {
    onSelectDate(date);
    setShowDatePicker(false);
  };

  const Content = () => (
    <View style={styles.cardContent}>
      <Text style={styles.question}>
        When do you want to start losing weight?
      </Text>

      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
        activeOpacity={0.7}
        disabled={isLoading}
      >
        <View style={styles.dateButtonContent}>
          <Ionicons
            name="calendar-outline"
            size={24}
            color={theme.colors.primary}
          />
          <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
          <Ionicons
            name="chevron-down"
            size={20}
            color={theme.colors.textSecondary}
          />
        </View>
      </TouchableOpacity>

      <Button
        title="NEXT"
        onPress={onNext}
        style={styles.nextButton}
        disabled={isLoading}
      />
    </View>
  );

  return (
    <Animated.View style={[styles.cardWrapper, { opacity: fadeAnim }]}>
      {Platform.OS === 'web' ? (
        <View style={styles.glassContainer}>
          <Content />
        </View>
      ) : (
        <BlurView intensity={80} tint="light" style={styles.glassContainerBlur}>
          <Content />
        </BlurView>
      )}

      <DatePickerModal
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        selectedDate={selectedDate}
        onSelectDate={handleDateSelect}
        today={today}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  glassContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  glassContainerBlur: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cardContent: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    width: '100%',
  },
  question: {
    ...theme.typography.h2,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  dateButton: {
    width: '100%',
    backgroundColor: theme.colors.glass,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  dateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    ...theme.typography.h3,
    color: theme.colors.text,
    flex: 1,
    textAlign: 'center',
  },
  nextButton: {
    width: '100%',
  },
});

