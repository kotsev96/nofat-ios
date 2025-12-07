import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { theme } from '../../theme';
import { getDateForDay, formatDateAmerican } from '../../utils/dateUtils';

interface DaysNavigationProps {
  selectedDay: number;
  onSelectDay: (day: number) => void;
  startDate: Date;
  userName: string;
  fadeAnim: Animated.Value;
}

export const DaysNavigation: React.FC<DaysNavigationProps> = ({
  selectedDay,
  onSelectDay,
  startDate,
  userName,
  fadeAnim,
}) => {
  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
        },
      ]}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.mainTitle}>{userName}'s personalized plan</Text>
        <Text style={styles.subtitle}>Week 1: Your foundation</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.daysScrollContent}
        style={styles.daysHorizontalScroll}
      >
        {Array.from({ length: 15 }, (_, i) => i + 1).map((day) => {
          const isSelected = day === selectedDay;
          const dayDate = getDateForDay(startDate, day);
          return (
            <TouchableOpacity
              key={day}
              onPress={() => onSelectDay(day)}
              activeOpacity={0.7}
              style={[
                styles.dayButton,
                isSelected && styles.dayButtonSelected,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  isSelected && styles.dayTextSelected,
                ]}
              >
                {formatDateAmerican(dayDate)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={styles.divider} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    paddingTop: theme.spacing.lg,
  },
  mainTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  daysScrollContent: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
    alignItems: 'center',
  },
  daysHorizontalScroll: {
    marginVertical: theme.spacing.md,
  },
  dayButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.pill,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButtonSelected: {
    backgroundColor: theme.colors.primary,
    ...theme.shadows.sm,
  },
  dayText: {
    ...theme.typography.bodyBold,
    color: theme.colors.text,
    fontSize: 16,
  },
  dayTextSelected: {
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.secondary,
    marginTop: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
  },
});

