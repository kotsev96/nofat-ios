import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';

export const MealPrepCard: React.FC = () => {
  const Content = () => (
    <View style={styles.mealCardContent}>
      <View style={styles.mealCardHeader}>
        <View style={styles.timeContainer}>
          <Ionicons
            name="basket-outline"
            size={18}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.mealTime}>7 days</Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.colors.textSecondary}
        />
      </View>
      <Text style={styles.mealType}>Products and Meal Prep</Text>
      <Text style={styles.mealDish}>Replace products if you don't like them</Text>
    </View>
  );

  if (Platform.OS === 'web') {
    return (
      <View style={styles.mealCardWrapper}>
        <View style={styles.mealCard}>
          <Content />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.mealCardWrapper}>
      <BlurView intensity={80} tint="light" style={styles.mealCardBlur}>
        <Content />
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
});

