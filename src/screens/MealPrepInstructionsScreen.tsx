import React, { useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';
import { theme } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface MealPrepInstructionsScreenProps {
  navigation: any;
  route: {
    params: {
      days: number | '3-4';
    };
  };
}

/**
 * MealPrepInstructionsScreen — meal prep instructions based on selected days
 */
export const MealPrepInstructionsScreen: React.FC<MealPrepInstructionsScreenProps> = ({
  navigation,
  route,
}) => {
  const selectedPrepDays = route.params?.days || 3;

  // Animations (exactly like ReplaceProductModal)
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  // Animate in on focus (like ReplaceProductModal opens when visible={true})
  useFocusEffect(
    useCallback(() => {
      fadeAnim.setValue(1);
      translateX.setValue(SCREEN_WIDTH);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 0,
            speed: 14,
          }).start();
        });
      });
    }, [])
  );

  const handleClose = () => {
    // Animate out (slide to right) - exactly like ReplaceProductModal handleClose
    Animated.timing(translateX, {
      toValue: SCREEN_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      navigation.goBack();
      translateX.setValue(SCREEN_WIDTH);
    });
  };

  const onGestureEvent = (event: any) => {
    const { translationX } = event.nativeEvent;
    if (translationX > 0) {
      translateX.setValue(translationX);
    }
  };

  const onHandlerStateChange = (event: any) => {
    const { translationX, state } = event.nativeEvent;
    if (state === 5) { // END state
      if (translationX > 100) {
        handleClose();
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  // Get meal prep instructions for 4 days
  const getMealPrepInstructions4Days = () => {
    return {
      totalTime: '3 hours',
      steps: [
        {
          title: 'Prepare Proteins',
          time: '50 minutes',
          instructions: [
            'Season 2 lbs chicken breast with salt, pepper, and herbs',
            'Bake at 375°F for 25-30 minutes until internal temperature reaches 165°F',
            'While chicken cooks, season 1.5 lbs salmon fillet',
            'Bake salmon at 400°F for 12-15 minutes',
            'Let proteins cool before portioning',
          ],
        },
        {
          title: 'Cook Grains',
          time: '35 minutes',
          instructions: [
            'Rinse 1 cup quinoa and 1 cup brown rice separately',
            'Cook quinoa with 2 cups water for 15 minutes',
            'Cook brown rice with 2 cups water for 20 minutes',
            'Bake 2 lbs sweet potatoes at 400°F for 35 minutes',
            'Let all grains cool completely',
          ],
        },
        {
          title: 'Prepare Vegetables',
          time: '50 minutes',
          instructions: [
            'Wash and chop all vegetables (spinach, broccoli, bell peppers, carrots, cucumber)',
            'Steam broccoli for 5-7 minutes until tender-crisp',
            'Roast bell peppers at 400°F for 20 minutes',
            'Roast carrots at 400°F for 25 minutes',
            'Store raw and cooked vegetables in separate airtight containers',
          ],
        },
        {
          title: 'Portion Meals',
          time: '45 minutes',
          instructions: [
            'Divide proteins into 8 equal portions (4 days × 2 meals)',
            'Portion grains into containers',
            'Add vegetables to each container',
            'Label containers with dates (Day 4, Day 5, Day 6, Day 7)',
            'Store in refrigerator',
          ],
        },
      ],
    };
  };

  // Get meal prep instructions based on days
  const getMealPrepInstructions = (days: number) => {
    if (days === 3) {
      return {
        totalTime: '2 hours 30 minutes',
        steps: [
          {
            title: 'Prepare Proteins',
            time: '45 minutes',
            instructions: [
              'Season 2 lbs chicken breast with salt, pepper, and herbs',
              'Bake at 375°F for 25-30 minutes until internal temperature reaches 165°F',
              'While chicken cooks, season 1.5 lbs salmon fillet',
              'Bake salmon at 400°F for 12-15 minutes',
              'Hard boil 12 eggs (10 minutes boiling, then ice bath)',
              'Let all proteins cool before portioning',
            ],
          },
          {
            title: 'Cook Grains',
            time: '45 minutes',
            instructions: [
              'Rinse 1 cup quinoa and 1 cup brown rice separately',
              'Cook quinoa with 2 cups water for 15 minutes',
              'Cook brown rice with 2 cups water for 20 minutes',
              'Bake 3 lbs sweet potatoes at 400°F for 40 minutes',
              'Let all grains cool completely',
            ],
          },
          {
            title: 'Prepare Vegetables',
            time: '1 hour',
            instructions: [
              'Wash and chop all vegetables (spinach, broccoli, bell peppers, carrots, cucumber)',
              'Steam broccoli for 5-7 minutes until tender-crisp',
              'Roast bell peppers at 400°F for 20 minutes',
              'Roast carrots at 400°F for 25 minutes',
              'Store raw and cooked vegetables in separate airtight containers',
            ],
          },
          {
            title: 'Prepare Fruits and Snacks',
            time: '30 minutes',
            instructions: [
              'Wash and portion berries into containers',
              'Slice bananas and store with lemon juice to prevent browning',
              'Portion almonds into 7 snack bags',
              'Prepare Greek yogurt portions',
            ],
          },
          {
            title: 'Portion Meals',
            time: '1 hour 5 minutes',
            instructions: [
              'Divide proteins into 14 equal portions (7 days × 2 meals)',
              'Portion grains into containers',
              'Add vegetables to each container',
              'Label containers with dates (Day 1 through Day 7)',
              'Organize by day in refrigerator',
              'Store fruits and snacks separately',
            ],
          },
        ],
      };
    }
    return {
      totalTime: '2 hours 30 minutes',
      steps: [],
    };
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F2F2F2', '#E8F5E9', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
          activeOffsetX={10}
          failOffsetY={[-10, 10]}
        >
          <Animated.View
            style={[
              styles.contentContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateX }],
              },
            ]}
          >
            <ScrollView
              style={styles.scrollContainer}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Back Button */}
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleClose}
                activeOpacity={0.7}
              >
                <Ionicons name="chevron-back" size={28} color={theme.colors.text} />
              </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Meal Prep Instructions</Text>
            <Text style={styles.subtitle}>
              {selectedPrepDays === '3-4' ? '3-4 Days plan' : `${selectedPrepDays} days plan`}
            </Text>
            <View style={styles.totalTimeContainer}>
              <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
              <Text style={styles.totalTimeText}>
                Total time: {selectedPrepDays === '3-4' 
                  ? `${getMealPrepInstructions(3).totalTime} + ${getMealPrepInstructions4Days().totalTime}`
                  : getMealPrepInstructions(selectedPrepDays as number).totalTime}
              </Text>
            </View>
          </View>

          {selectedPrepDays === '3-4' ? (
            <>
              {/* 3 Days Section */}
              <View style={styles.daysSectionHeader}>
                <Text style={styles.daysSectionTitle}>First 3 Days</Text>
                <View style={styles.daysSectionTimeContainer}>
                  <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
                  <Text style={styles.daysSectionTime}>{getMealPrepInstructions(3).totalTime}</Text>
                </View>
              </View>
              {getMealPrepInstructions(3).steps.map((step, stepIndex) => (
                <View key={`3days-${stepIndex}`} style={styles.stepCard}>
                  {Platform.OS === 'web' ? (
                    <View style={styles.stepContent}>
                      <View style={styles.stepHeader}>
                        <View style={styles.stepNumber}>
                          <Text style={styles.stepNumberText}>{stepIndex + 1}</Text>
                        </View>
                        <View style={styles.stepTitleContainer}>
                          <Text style={styles.stepTitle}>{step.title}</Text>
                          <View style={styles.stepTimeContainer}>
                            <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
                            <Text style={styles.stepTime}>{step.time}</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.stepInstructions}>
                        {step.instructions.map((instruction, instIndex) => (
                          <View key={instIndex} style={styles.instructionItem}>
                            <View style={styles.instructionBullet} />
                            <Text style={styles.instructionText}>{instruction}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  ) : (
                    <BlurView intensity={60} tint="light" style={styles.stepContent}>
                      <View style={styles.stepHeader}>
                        <View style={styles.stepNumber}>
                          <Text style={styles.stepNumberText}>{stepIndex + 1}</Text>
                        </View>
                        <View style={styles.stepTitleContainer}>
                          <Text style={styles.stepTitle}>{step.title}</Text>
                          <View style={styles.stepTimeContainer}>
                            <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
                            <Text style={styles.stepTime}>{step.time}</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.stepInstructions}>
                        {step.instructions.map((instruction, instIndex) => (
                          <View key={instIndex} style={styles.instructionItem}>
                            <View style={styles.instructionBullet} />
                            <Text style={styles.instructionText}>{instruction}</Text>
                          </View>
                        ))}
                      </View>
                    </BlurView>
                  )}
                </View>
              ))}
              
              {/* 4 Days Section */}
              <View style={styles.daysSectionHeader}>
                <Text style={styles.daysSectionTitle}>Next 4 Days</Text>
                <View style={styles.daysSectionTimeContainer}>
                  <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
                  <Text style={styles.daysSectionTime}>{getMealPrepInstructions4Days().totalTime}</Text>
                </View>
              </View>
              {getMealPrepInstructions4Days().steps.map((step, stepIndex) => (
                <View key={`4days-${stepIndex}`} style={styles.stepCard}>
                  {Platform.OS === 'web' ? (
                    <View style={styles.stepContent}>
                      <View style={styles.stepHeader}>
                        <View style={styles.stepNumber}>
                          <Text style={styles.stepNumberText}>{stepIndex + 1}</Text>
                        </View>
                        <View style={styles.stepTitleContainer}>
                          <Text style={styles.stepTitle}>{step.title}</Text>
                          <View style={styles.stepTimeContainer}>
                            <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
                            <Text style={styles.stepTime}>{step.time}</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.stepInstructions}>
                        {step.instructions.map((instruction, instIndex) => (
                          <View key={instIndex} style={styles.instructionItem}>
                            <View style={styles.instructionBullet} />
                            <Text style={styles.instructionText}>{instruction}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  ) : (
                    <BlurView intensity={60} tint="light" style={styles.stepContent}>
                      <View style={styles.stepHeader}>
                        <View style={styles.stepNumber}>
                          <Text style={styles.stepNumberText}>{stepIndex + 1}</Text>
                        </View>
                        <View style={styles.stepTitleContainer}>
                          <Text style={styles.stepTitle}>{step.title}</Text>
                          <View style={styles.stepTimeContainer}>
                            <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
                            <Text style={styles.stepTime}>{step.time}</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.stepInstructions}>
                        {step.instructions.map((instruction, instIndex) => (
                          <View key={instIndex} style={styles.instructionItem}>
                            <View style={styles.instructionBullet} />
                            <Text style={styles.instructionText}>{instruction}</Text>
                          </View>
                        ))}
                      </View>
                    </BlurView>
                  )}
                </View>
              ))}
            </>
          ) : (
            getMealPrepInstructions(selectedPrepDays as number).steps.map((step, stepIndex) => (
              <View key={stepIndex} style={styles.stepCard}>
                {Platform.OS === 'web' ? (
                  <View style={styles.stepContent}>
                    <View style={styles.stepHeader}>
                      <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>{stepIndex + 1}</Text>
                      </View>
                      <View style={styles.stepTitleContainer}>
                        <Text style={styles.stepTitle}>{step.title}</Text>
                        <View style={styles.stepTimeContainer}>
                          <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
                          <Text style={styles.stepTime}>{step.time}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.stepInstructions}>
                      {step.instructions.map((instruction, instIndex) => (
                        <View key={instIndex} style={styles.instructionItem}>
                          <View style={styles.instructionBullet} />
                          <Text style={styles.instructionText}>{instruction}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ) : (
                  <BlurView intensity={60} tint="light" style={styles.stepContent}>
                    <View style={styles.stepHeader}>
                      <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>{stepIndex + 1}</Text>
                      </View>
                      <View style={styles.stepTitleContainer}>
                        <Text style={styles.stepTitle}>{step.title}</Text>
                        <View style={styles.stepTimeContainer}>
                          <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
                          <Text style={styles.stepTime}>{step.time}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.stepInstructions}>
                      {step.instructions.map((instruction, instIndex) => (
                        <View key={instIndex} style={styles.instructionItem}>
                          <View style={styles.instructionBullet} />
                          <Text style={styles.instructionText}>{instruction}</Text>
                        </View>
                      ))}
                    </View>
                  </BlurView>
                )}
              </View>
            ))
          )}
            </ScrollView>
          </Animated.View>
        </PanGestureHandler>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
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
    marginBottom: theme.spacing.md,
  },
  totalTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: Platform.OS === 'web'
      ? 'rgba(255, 255, 255, 0.4)'
      : 'rgba(255, 255, 255, 0.25)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignSelf: 'flex-start',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  totalTimeText: {
    ...theme.typography.bodyBold,
    color: theme.colors.text,
    fontSize: 16,
  },
  stepCard: {
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  stepContent: {
    backgroundColor: Platform.OS === 'web'
      ? 'rgba(255, 255, 255, 0.4)'
      : 'rgba(255, 255, 255, 0.25)',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.md,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepNumberText: {
    ...theme.typography.bodyBold,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  stepTitleContainer: {
    flex: 1,
  },
  stepTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    fontWeight: '600',
  },
  stepTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  stepTime: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  stepInstructions: {
    gap: theme.spacing.sm,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },
  instructionBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    marginTop: 8,
    flexShrink: 0,
  },
  instructionText: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
    lineHeight: 24,
  },
  daysSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  daysSectionTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    fontWeight: '700',
  },
  daysSectionTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: Platform.OS === 'web'
      ? 'rgba(255, 255, 255, 0.4)'
      : 'rgba(255, 255, 255, 0.25)',
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  daysSectionTime: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
});

