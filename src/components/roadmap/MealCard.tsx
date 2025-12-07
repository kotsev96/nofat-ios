import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';

interface MealCardProps {
  time: string;
  type: string;
  dish: string;
  calories: number;
  color: string;
}

export const MealCard: React.FC<MealCardProps> = ({
  time,
  type,
  dish,
  calories,
  color,
}) => {
  const Content = () => (
    <View style={styles.mealCardContent}>
      <View style={styles.mealCardHeader}>
        <View style={styles.timeContainer}>
          <Ionicons
            name="time-outline"
            size={18}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.mealTime}>{time}</Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.colors.textSecondary}
        />
      </View>
      <Text style={styles.mealType}>{type}</Text>
      <Text style={styles.mealDish}>{dish}</Text>
      <Text style={styles.mealCalories}>{calories} kcal</Text>
    </View>
  );

  if (Platform.OS === 'web') {
    return (
      <View style={styles.mealCardWrapper}>
        <View style={styles.mealCard}>
          <Content />
          <View style={[styles.mealAccent, { backgroundColor: color }]} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.mealCardWrapper}>
      <BlurView intensity={80} tint="light" style={styles.mealCardBlur}>
        <Content />
        <View style={[styles.mealAccent, { backgroundColor: color }]} />
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  mealCardWrapper: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  mealCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    flexDirection: 'row',
    minHeight: 130,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  mealCardBlur: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    flexDirection: 'row',
    minHeight: 130,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  mealCardContent: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  mealCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    width: '100%',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  mealTime: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  mealType: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    fontWeight: '700',
    fontSize: 22,
  },
  mealDish: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    fontSize: 15,
    marginBottom: theme.spacing.xs,
  },
  mealCalories: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
    marginTop: theme.spacing.xs,
  },
  mealAccent: {
    width: 5,
    backgroundColor: theme.colors.primary,
  },
});

