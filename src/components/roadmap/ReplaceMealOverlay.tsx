import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { getAlternativeMeals, getCalorieColor } from '../../utils/roadmapData';

interface ReplaceMealOverlayProps {
    currentMeal: any;
    onSelectMeal: (meal: any) => void;
    onClose: () => void;
}

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const ReplaceMealOverlay: React.FC<ReplaceMealOverlayProps> = ({
    currentMeal,
    onSelectMeal,
    onClose,
}) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Background Gradient to ensure opacity over underlying content */}
            <LinearGradient
                colors={['#F2F2F2', '#E8F5E9', '#FFFFFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
            />

            <View style={styles.safeAreaContent}>
                <ScrollView
                    style={styles.scrollContainer}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={onClose}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="chevron-back" size={28} color={theme.colors.text} />
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <Text style={styles.title}>Choose Alternative Meal</Text>
                        <Text style={styles.subtitle}>Select a new meal or keep the current one</Text>
                    </View>

                    {/* Keep Current Meal Option */}
                    <TouchableOpacity
                        style={styles.keepCurrentMealCard}
                        activeOpacity={0.8}
                        onPress={() => onSelectMeal(currentMeal)}
                    >
                        {Platform.OS === 'web' ? (
                            <View style={styles.keepCurrentMealContent}>
                                <CurrentMealContent meal={currentMeal} />
                            </View>
                        ) : (
                            <BlurView intensity={60} tint="light" style={styles.keepCurrentMealContent}>
                                <CurrentMealContent meal={currentMeal} />
                            </BlurView>
                        )}
                    </TouchableOpacity>

                    {/* Alternative Meals */}
                    <View style={styles.alternativeMealsSection}>
                        <Text style={styles.alternativeMealsSectionTitle}>Alternative Options</Text>
                        {getAlternativeMeals(currentMeal?.type).map((meal, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.alternativeMealCard}
                                activeOpacity={0.8}
                                onPress={() => onSelectMeal({
                                    ...currentMeal,
                                    dish: meal.dish,
                                    calories: meal.calories,
                                    ingredients: meal.ingredients || [],
                                    instructions: meal.instructions || [],
                                    nutrition: {
                                        protein: meal.protein,
                                        carbs: meal.carbs,
                                        fat: meal.fat,
                                        fiber: meal.fiber || currentMeal?.nutrition?.fiber || 0,
                                    },
                                })}
                            >
                                {Platform.OS === 'web' ? (
                                    <View style={styles.alternativeMealCardWrapper}>
                                        <AlternativeMealContent meal={meal} />
                                        <View style={[styles.mealAccent, { backgroundColor: getCalorieColor(meal.calories) }]} />
                                    </View>
                                ) : (
                                    <View style={styles.alternativeMealCardWrapper}>
                                        <BlurView intensity={60} tint="light" style={styles.alternativeMealCardContent}>
                                            <AlternativeMealContent meal={meal} />
                                        </BlurView>
                                        <View style={[styles.mealAccent, { backgroundColor: getCalorieColor(meal.calories) }]} />
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

const CurrentMealContent = ({ meal }: { meal: any }) => (
    <>
        <View style={styles.keepCurrentMealCardContent}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
            <View style={styles.keepCurrentMealTextContainer}>
                <Text style={styles.keepCurrentMealTitle}>Keep Current Meal</Text>
                <Text style={styles.keepCurrentMealDish}>{meal?.dish}</Text>
            </View>
        </View>
        <View style={[styles.mealAccent, { backgroundColor: theme.colors.primary }]} />
    </>
);

const AlternativeMealContent = ({ meal }: { meal: any }) => (
    <View style={styles.alternativeMealCardContent}>
        <Text style={styles.alternativeMealDish}>{meal.dish}</Text>
        <View style={styles.alternativeMealInfo}>
            <View style={styles.alternativeMealInfoRow}>
                <Ionicons name="flame-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={styles.alternativeMealInfoText}>{meal.calories} kcal</Text>
            </View>
            <View style={styles.alternativeMealNutrition}>
                <Text style={styles.alternativeMealNutritionText}>P: {meal.protein}g</Text>
                <Text style={styles.alternativeMealNutritionText}>C: {meal.carbs}g</Text>
                <Text style={styles.alternativeMealNutritionText}>F: {meal.fat}g</Text>
            </View>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    safeAreaContent: {
        flex: 1,
        // Assuming parent has SafeAreaView, but if this slides over, we might need padding
        // We'll rely on parent padding or add top padding if needed. 
        // Actually, since it's an overlay, it might need to respect safe area itself if it covers the whole screen.
        // For now, let's just let it fill the parent container which is already inside SafeAreaView? 
        // Wait, the parent Modal has SafeAreaView. If we position absolute, we are inside that view?
        // We'll see.
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.xxl,
    },
    backButton: {
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.md,
        alignSelf: 'flex-start',
    },
    header: {
        marginBottom: theme.spacing.xl,
    },
    title: {
        ...theme.typography.h1,
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
        fontWeight: '700',
    },
    subtitle: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
    },
    keepCurrentMealCard: {
        marginBottom: theme.spacing.xl,
    },
    keepCurrentMealContent: {
        flexDirection: 'row',
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        ...theme.shadows.lg,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        backgroundColor: Platform.OS === 'web'
            ? 'rgba(255, 255, 255, 0.4)'
            : 'transparent',
    },
    keepCurrentMealCardContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
        gap: theme.spacing.md,
    },
    keepCurrentMealTextContainer: {
        flex: 1,
    },
    keepCurrentMealTitle: {
        ...theme.typography.h3,
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
        fontWeight: '600',
    },
    keepCurrentMealDish: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
    },
    alternativeMealsSection: {
        marginTop: theme.spacing.md,
    },
    alternativeMealsSectionTitle: {
        ...theme.typography.h3,
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
        fontWeight: '600',
    },
    alternativeMealCard: {
        marginBottom: theme.spacing.md,
    },
    alternativeMealCardWrapper: {
        flexDirection: 'row',
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        ...theme.shadows.md,
        borderWidth: 1,
        borderColor: theme.colors.secondary,
    },
    alternativeMealCardContent: {
        flex: 1,
        padding: theme.spacing.md,
        backgroundColor: Platform.OS === 'web'
            ? 'rgba(255, 255, 255, 0.4)'
            : 'transparent',
    },
    alternativeMealDish: {
        ...theme.typography.h3,
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
        fontWeight: '600',
    },
    alternativeMealInfo: {
        gap: theme.spacing.xs,
    },
    alternativeMealInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    alternativeMealInfoText: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        fontWeight: '500',
    },
    alternativeMealNutrition: {
        flexDirection: 'row',
        gap: theme.spacing.md,
        marginTop: theme.spacing.xs,
    },
    alternativeMealNutritionText: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        fontSize: 12,
    },
    mealAccent: {
        width: 5,
        backgroundColor: theme.colors.primary,
    },
});
