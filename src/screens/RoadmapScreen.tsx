import React, { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { theme } from '../theme';

// Components
import { LoadingOverlay } from '../components/roadmap/LoadingOverlay';
import { DateSelectionCard } from '../components/roadmap/DateSelectionCard';
import { DaysNavigation } from '../components/roadmap/DaysNavigation';
import { MealList } from '../components/roadmap/MealList';
import { MealDetailsModal } from '../components/roadmap/MealDetailsModal';
import { ReplaceMealOverlay } from '../components/roadmap/ReplaceMealOverlay';
import { FuturePlanView } from '../components/roadmap/FuturePlanView';
// Products flow moved to its own navigation screen

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface RoadmapScreenProps {
  navigation: any;
}

/**
 * RoadmapScreen — weight loss start date selection and weekly plan
 */
export const RoadmapScreen: React.FC<RoadmapScreenProps> = ({ navigation }) => {
  // State
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Set initial date to tomorrow
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [selectedDate, setSelectedDate] = useState<Date>(tomorrow);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmptyScreen, setShowEmptyScreen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number>(1);

  // Modals State
  const [showMealDetails, setShowMealDetails] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const [showReplaceMealModal, setShowReplaceMealModal] = useState(false);
  // Initialize showProductsModal by checking the flag synchronously
  const [showProductsModal, setShowProductsModal] = useState(() => {
    // This runs only once on mount, but we'll handle reopening in useLayoutEffect
    return false;
  });
  // Removed product replacement state from here (moved to Products screen)

  // Data State
  // Removed replaced products and saving state (now handled inside Products screen)
  const [userName] = useState<string>('Ann'); // TODO: Get from user context/API

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const loadingOpacity = useRef(new Animated.Value(0)).current;
  const loadingScale = useRef(new Animated.Value(0.8)).current;
  const daysFadeAnim = useRef(new Animated.Value(0)).current;

  // Flag to remember if we need to reopen the products modal
  const shouldReopenProductsModal = useRef(false);
  // State to hide content during modal restoration to prevent flickering
  const [isRestoringModal, setIsRestoringModal] = useState(false); // kept only for compatibility but not used

  // Use useLayoutEffect to check flag synchronously on every render
  // This runs synchronously before paint, preventing flickering
  useLayoutEffect(() => {
    // Check if screen is focused and flag is set
    if (navigation.isFocused() && shouldReopenProductsModal.current) {
      // Open modal immediately without hiding content
      // The modal will cover the screen anyway, so no need to hide background
      setShowProductsModal(true);
      shouldReopenProductsModal.current = false;
      setIsRestoringModal(false); // Ensure content is visible (though modal covers it)
    }
  });

  // Also use useFocusEffect as backup to ensure we catch the focus event
  useFocusEffect(
    useCallback(() => {
      // If flag is set - open modal and reset flag
      if (shouldReopenProductsModal.current) {
        // Open modal immediately
        setShowProductsModal(true);
        shouldReopenProductsModal.current = false;
        setIsRestoringModal(false);
      }
    }, [])
  );

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: theme.animations.normal,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleNext = () => {
    setIsLoading(true);

    // Start loading animations
    Animated.parallel([
      Animated.timing(loadingOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(loadingScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // After 2 seconds, hide loading and show empty screen
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(loadingOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(loadingScale, {
          toValue: 0.8,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsLoading(false);
        setShowEmptyScreen(true);

        // Animate days navigation appearance
        Animated.timing(daysFadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      });
    }, 2000);
  };

  // Products save flow moved into Products screen

  const handleMealPress = (meal: any) => {
    if (selectedDay === 1 && meal.type === 'Breakfast') {
      setSelectedMeal({
        ...meal,
        ingredients: [
          '1 cup rolled oats',
          '1/2 cup mixed berries (strawberries, blueberries)',
          '1 tbsp honey',
          '1/4 cup almond milk',
          '1 tbsp chia seeds',
        ],
        instructions: [
          'Cook oats with almond milk for 5 minutes',
          'Let cool slightly and add berries',
          'Drizzle with honey',
          'Sprinkle chia seeds on top',
          'Serve warm',
        ],
        nutrition: {
          calories: 280,
          protein: 8,
          carbs: 52,
          fat: 6,
          fiber: 7,
        },
      });
      setShowMealDetails(true);
    } else {
      console.log(`Pressed ${meal.type} for Day ${selectedDay}`);
    }
  };

  const handleMealPrepNavigation = (days: number | '3-4') => {
    // 1. Remember to reopen modal on return
    shouldReopenProductsModal.current = true;
    // 2. Close it now to see transition
    setShowProductsModal(false);
    // 3. Navigate
    navigation.navigate('MealPrepInstructions', { days });
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
        <View style={{ flex: 1, opacity: isRestoringModal ? 0 : 1 }}>
          {showEmptyScreen ? (
            <ScrollView
              style={styles.mainScrollView}
              contentContainerStyle={styles.mainScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <DaysNavigation
                selectedDay={selectedDay}
                onSelectDay={setSelectedDay}
                startDate={selectedDate}
                userName={userName}
                fadeAnim={daysFadeAnim}
              />

              <Animated.View style={{ opacity: daysFadeAnim }}>
                {selectedDay >= 8 ? (
                  <FuturePlanView />
                ) : (
                  <MealList
                    selectedDay={selectedDay}
                    onMealPress={handleMealPress}
                    onProductsPress={() => navigation.navigate('Products')}
                  />
                )}
              </Animated.View>
            </ScrollView>
          ) : (
            true && (
              <View style={styles.content}>
                <DateSelectionCard
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                  onNext={handleNext}
                  isLoading={isLoading}
                  fadeAnim={fadeAnim}
                  today={today}
                />
              </View>
            )
          )}
        </View>

        {/* Loading Overlay */}
        <LoadingOverlay
          isLoading={isLoading}
          loadingOpacity={loadingOpacity}
          loadingScale={loadingScale}
        />

        {/* Modals */}
        <MealDetailsModal
          visible={showMealDetails}
          onClose={() => setShowMealDetails(false)}
          meal={selectedMeal}
          onUpdateMeal={(meal) => setSelectedMeal(meal)}
        />

        {/* Products flow handled in separate screen now */}
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  mainScrollView: {
    flex: 1,
  },
  mainScrollContent: {
    paddingBottom: theme.spacing.xxl + 80, // Extra padding for floating tab bar
  },
});
