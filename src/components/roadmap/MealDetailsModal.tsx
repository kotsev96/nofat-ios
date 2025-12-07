
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  InteractionManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { theme } from '../../theme';
import { Button } from '../Button';
import { ReplaceMealOverlay } from './ReplaceMealOverlay';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface MealDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  meal: any;
  onUpdateMeal: (meal: any) => void;
}

export const MealDetailsModal: React.FC<MealDetailsModalProps> = ({
  visible,
  onClose,
  meal,
  onUpdateMeal,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  // New animated value for the nested overlay
  const replaceTranslateX = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const [isReplaceVisible, setIsReplaceVisible] = useState(false);

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (visible) {
      // Reset main modal state
      fadeAnim.setValue(1);
      translateX.setValue(SCREEN_WIDTH);

      // Ensure replace overlay is hidden initially
      setIsReplaceVisible(false);
      replaceTranslateX.setValue(SCREEN_WIDTH);

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

      // Scroll to top
      const task = InteractionManager.runAfterInteractions(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            scrollRef.current?.scrollTo({ y: 0, animated: true });
          }, 200);
        });
      });
      return () => task.cancel();
    }
  }, [visible, meal]);

  const handleClose = () => {
    Animated.timing(translateX, {
      toValue: SCREEN_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onClose();
      // Reset state after close
      translateX.setValue(SCREEN_WIDTH);
      setIsReplaceVisible(false);
      replaceTranslateX.setValue(SCREEN_WIDTH);
    });
  };

  const handleOpenReplace = () => {
    setIsReplaceVisible(true);
    Animated.spring(replaceTranslateX, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 0,
      speed: 14,
    }).start();
  };

  const handleCloseReplace = () => {
    Animated.timing(replaceTranslateX, {
      toValue: SCREEN_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setIsReplaceVisible(false);
    });
  };

  const onGestureEvent = (event: any) => {
    const { translationX } = event.nativeEvent;
    if (translationX > 0) {
      if (isReplaceVisible) {
        // Do not handle main modal swipe if overlay is visible
        // Ideally overlay has its own handler, or we block this one
        return;
      }
      translateX.setValue(translationX);
    }
  };

  const onHandlerStateChange = (event: any) => {
    if (isReplaceVisible) return;

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

  // Gesture for Replace Overlay
  const onReplaceGestureEvent = (event: any) => {
    const { translationX } = event.nativeEvent;
    if (translationX > 0) {
      replaceTranslateX.setValue(translationX);
    }
  };

  const onReplaceHandlerStateChange = (event: any) => {
    const { translationX, state } = event.nativeEvent;
    if (state === 5) { // END state
      if (translationX > 100) {
        handleCloseReplace();
      } else {
        Animated.spring(replaceTranslateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  if (!meal) return null;

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="none"
      onRequestClose={() => {
        if (isReplaceVisible) {
          handleCloseReplace();
        } else {
          handleClose();
        }
      }}
    >
      <View style={{ flex: 1 }}>
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
              enabled={!isReplaceVisible}
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
                  key={`meal - details - ${meal?.dish || 'default'} `}
                  ref={scrollRef}
                  style={styles.scrollContainer}
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleClose}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="chevron-back" size={28} color={theme.colors.text} />
                  </TouchableOpacity>

                  {Platform.OS === 'web' ? (
                    <View style={styles.cardContent}>
                      <MealHeader meal={meal} />
                      <MealInfo meal={meal} />
                      <NutritionFacts meal={meal} />
                      <Ingredients meal={meal} />
                      <Instructions meal={meal} />
                      <Button
                        title="Replace Meal"
                        onPress={handleOpenReplace}
                        variant="outline"
                        style={styles.replaceButton}
                      />
                    </View>
                  ) : (
                    <BlurView intensity={80} tint="light" style={styles.cardContent}>
                      <MealHeader meal={meal} />
                      <MealInfo meal={meal} />
                      <NutritionFacts meal={meal} />
                      <Ingredients meal={meal} />
                      <Instructions meal={meal} />
                      <Button
                        title="Replace Meal"
                        onPress={handleOpenReplace}
                        variant="outline"
                        style={styles.replaceButton}
                      />
                    </BlurView>
                  )}
                </ScrollView>
              </Animated.View>
            </PanGestureHandler>

            {/* Replace Meal Overlay - Positioned Absolutely */}
            {isReplaceVisible && (
              <PanGestureHandler
                onGestureEvent={onReplaceGestureEvent}
                onHandlerStateChange={onReplaceHandlerStateChange}
                activeOffsetX={10}
                failOffsetY={[-10, 10]}
              >
                <Animated.View
                  style={[
                    StyleSheet.absoluteFill,
                    {
                      transform: [{ translateX: replaceTranslateX }],
                      zIndex: 100,
                    }
                  ]}
                >
                  <ReplaceMealOverlay
                    currentMeal={meal}
                    onClose={handleCloseReplace}
                    onSelectMeal={(newMeal) => {
                      onUpdateMeal(newMeal);
                      handleCloseReplace();
                    }}
                  />
                </Animated.View>
              </PanGestureHandler>
            )}

          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
};

const MealHeader = ({ meal }: { meal: any }) => (
  <View style={styles.header}>
    <View>
      <Text style={styles.title}>{meal.type}</Text>
      <Text style={styles.dish}>{meal.dish}</Text>
    </View>
  </View>
);

const MealInfo = ({ meal }: { meal: any }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoItem}>
      <Ionicons name="time-outline" size={18} color={theme.colors.textSecondary} />
      <Text style={styles.infoText}>{meal.time}</Text>
    </View>
    <View style={styles.infoItem}>
      <Ionicons name="flame-outline" size={18} color={theme.colors.textSecondary} />
      <Text style={styles.infoText}>{meal.calories} kcal</Text>
    </View>
  </View>
);

const NutritionFacts = ({ meal }: { meal: any }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Nutrition Facts</Text>
    <View style={styles.nutritionGrid}>
      <NutritionItem value={`${meal.nutrition?.protein} g`} label="Protein" />
      <NutritionItem value={`${meal.nutrition?.carbs} g`} label="Carbs" />
      <NutritionItem value={`${meal.nutrition?.fat} g`} label="Fat" />
      <NutritionItem value={`${meal.nutrition?.fiber} g`} label="Fiber" />
    </View>
  </View>
);

const NutritionItem = ({ value, label }: { value: string; label: string }) => (
  <View style={styles.nutritionItem}>
    <Text style={styles.nutritionValue}>{value}</Text>
    <Text style={styles.nutritionLabel}>{label}</Text>
  </View>
);

const Ingredients = ({ meal }: { meal: any }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Ingredients</Text>
    {meal.ingredients?.map((ingredient: string, idx: number) => (
      <View key={idx} style={styles.ingredientItem}>
        <View style={styles.ingredientBullet} />
        <Text style={styles.ingredientText}>{ingredient}</Text>
      </View>
    ))}
  </View>
);

const Instructions = ({ meal }: { meal: any }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Instructions</Text>
    {meal.instructions?.map((instruction: string, idx: number) => (
      <View key={idx} style={styles.instructionItem}>
        <View style={styles.instructionNumber}>
          <Text style={styles.instructionNumberText}>{idx + 1}</Text>
        </View>
        <Text style={styles.instructionText}>{instruction}</Text>
      </View>
    ))}
  </View>
);

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
  cardContent: {
    flex: 1,
    backgroundColor: Platform.OS === 'web'
      ? 'rgba(255, 255, 255, 0.4)'
      : 'rgba(255, 255, 255, 0.25)',
    borderRadius: theme.borderRadius.lg,
    paddingTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  dish: {
    ...theme.typography.h3,
    color: theme.colors.textSecondary,
    fontWeight: '400',
  },
  infoRow: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.secondary,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  infoText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    fontWeight: '600',
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  nutritionItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Platform.OS === 'web'
      ? 'rgba(255, 255, 255, 0.4)'
      : 'rgba(255, 255, 255, 0.25)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  nutritionValue: {
    ...theme.typography.h2,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
    fontWeight: '700',
  },
  nutritionLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  ingredientBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    marginTop: 8,
  },
  ingredientText: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
    lineHeight: 24,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.md,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  instructionNumberText: {
    ...theme.typography.bodyBold,
    color: '#FFFFFF',
    fontSize: 14,
  },
  instructionText: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
    lineHeight: 24,
  },
  replaceButton: {
    marginTop: theme.spacing.md,
  },
});

