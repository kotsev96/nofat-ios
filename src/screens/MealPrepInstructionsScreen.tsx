import React, { useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';
import { theme } from '../theme';
import { StepCard } from '../components/StepCard';
import { DaysSectionHeader } from '../components/DaysSectionHeader';
import { getMealPrepInstructions, getMealPrepInstructions4Days } from '../data/mealPrepData';

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
                  <DaysSectionHeader
                    title="First 3 Days"
                    totalTime={getMealPrepInstructions(3).totalTime}
                  />
                  {getMealPrepInstructions(3).steps.map((step, stepIndex) => (
                    <StepCard key={`3days-${stepIndex}`} step={step} stepIndex={stepIndex} />
                  ))}

                  {/* 4 Days Section */}
                  <DaysSectionHeader
                    title="Next 4 Days"
                    totalTime={getMealPrepInstructions4Days().totalTime}
                  />
                  {getMealPrepInstructions4Days().steps.map((step, stepIndex) => (
                    <StepCard key={`4days-${stepIndex}`} step={step} stepIndex={stepIndex} />
                  ))}
                </>
              ) : (
                getMealPrepInstructions(selectedPrepDays as number).steps.map((step, stepIndex) => (
                  <StepCard key={stepIndex} step={step} stepIndex={stepIndex} />
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
});

