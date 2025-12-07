import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../theme';
import { getMealsForDay } from '../../utils/roadmapData';
import { MealCard } from './MealCard';
import { MealPrepCard } from './MealPrepCard';

interface MealListProps {
  selectedDay: number;
  onMealPress: (meal: any) => void;
  onProductsPress: () => void;
}

export const MealList: React.FC<MealListProps> = ({
  selectedDay,
  onMealPress,
  onProductsPress,
}) => {
  const meals = getMealsForDay(selectedDay);

  return (
    <View style={styles.mealsSection}>
      {/* Products and Meal Prep block - only for Day 1 */}
      {selectedDay === 1 && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onProductsPress}
        >
          <MealPrepCard />
        </TouchableOpacity>
      )}
      {meals.map((meal, index) => (
        <TouchableOpacity
          key={index}
          activeOpacity={0.8}
          onPress={() => onMealPress(meal)}
        >
          <MealCard
            time={meal.time}
            type={meal.type}
            dish={meal.dish}
            calories={meal.calories}
            color={meal.color}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  mealsSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    gap: theme.spacing.md,
  },
});

