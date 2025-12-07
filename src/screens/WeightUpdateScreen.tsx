import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { WeightPickerSheet } from '../components/roadmap/WeightPickerSheet';
import { theme } from '../theme';

interface WeightUpdateScreenProps {
  navigation: any;
}

/**
 * WeightUpdateScreen — today's weight input
 * Displays current weight and allows selection via vertical picker
 */
export const WeightUpdateScreen: React.FC<WeightUpdateScreenProps> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const previousWeight = 165.0; // Previous weight value (lbs)

  const [currentWeight, setCurrentWeight] = useState(previousWeight);
  const [isPickerVisible, setPickerVisible] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Card appearance animation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: theme.animations.normal,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for tap hint
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  const weightDifference = currentWeight - previousWeight;
  const weightPercentage = Math.abs((currentWeight / previousWeight - 1) * 100).toFixed(2);
  const isIncrease = weightDifference > 0;

  const handleUpdate = () => {
    // In a real app, data would be sent to backend here
    navigation.goBack();
  };

  return (
    <LinearGradient
      colors={['#F2F2F2', '#E8F5E9', '#FFFFFF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Back button - iPhone style */}
        <TouchableOpacity
          style={[styles.backButton, { top: theme.spacing.xs }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={28} color={theme.colors.text} />
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: theme.spacing.xxl + insets.bottom + 20 }
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.cardContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setPickerVisible(true)}
            >
              <Card variant="elevated" style={styles.weightCard}>
                <Text style={styles.label}>Current Weight</Text>

                <View style={styles.weightDisplay}>
                  <Text style={styles.weightValue}>
                    {currentWeight.toFixed(1)}
                  </Text>
                  <Text style={styles.weightUnit}>lbs</Text>
                </View>

                {/* Fixed height container to prevent layout shifts */}
                <View style={styles.changeIndicatorContainer}>
                  {weightDifference !== 0 && (
                    <View
                      style={[
                        styles.changeIndicator,
                        isIncrease ? styles.changeIncrease : styles.changeDecrease,
                      ]}
                    >
                      <Text
                        style={[
                          styles.changeText,
                          isIncrease && styles.changeTextIncrease,
                        ]}
                      >
                        {isIncrease ? '+' : ''}
                        {weightDifference.toFixed(1)} lbs ({weightPercentage}%)
                      </Text>
                    </View>
                  )}
                </View>

                <Text style={styles.previousText}>
                  Previous: {previousWeight.toFixed(1)} lbs
                </Text>

                <Animated.View style={[styles.tapHint, { transform: [{ scale: pulseAnim }] }]}>
                  <Ionicons name="create-outline" size={16} color={theme.colors.primary} />
                  <Text style={styles.tapHintText}>Tap to change</Text>
                </Animated.View>
              </Card>
            </TouchableOpacity>

            <Button
              title="Save"
              onPress={handleUpdate}
              size="large"
              style={styles.updateButton}
              disabled={currentWeight === previousWeight || Math.abs((currentWeight - previousWeight) / previousWeight) > 0.03}
            />
            {Math.abs((currentWeight - previousWeight) / previousWeight) > 0.03 && (
              <Text style={styles.warningText}>
                Weight change cannot exceed ±3% ({((previousWeight * 0.97).toFixed(1))} - {(previousWeight * 1.03).toFixed(1)} lbs)
              </Text>
            )}
          </Animated.View>
        </ScrollView>

        <WeightPickerSheet
          visible={isPickerVisible}
          onClose={() => setPickerVisible(false)}
          initialWeight={currentWeight}
          onSelect={setCurrentWeight}
          minWeight={50}
          maxWeight={500}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  backButton: {
    // positioned dynamically inline
    left: theme.spacing.md,
    zIndex: 1000,
    padding: theme.spacing.sm,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 50,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 400,
  },
  weightCard: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    paddingVertical: theme.spacing.xl,
    ...theme.shadows.sm, // Add shadow for better separation
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  weightDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: theme.spacing.sm,
  },
  weightValue: {
    ...theme.typography.h1,
    fontSize: 56,
    lineHeight: 64,
    color: theme.colors.text,
    fontWeight: '700',
  },
  weightUnit: {
    ...theme.typography.h3,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  changeIndicatorContainer: {
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  changeIndicator: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.pill,
    backgroundColor: theme.colors.glassDark,
  },
  changeIncrease: {
    backgroundColor: 'rgba(239, 83, 80, 0.1)',
  },
  changeDecrease: {
    backgroundColor: 'rgba(111, 207, 151, 0.2)',
  },
  changeText: {
    ...theme.typography.bodyBold,
    color: theme.colors.success,
  },
  changeTextIncrease: {
    color: theme.colors.error,
  },
  previousText: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.md,
  },
  tapHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: 'rgba(52, 199, 89, 0.15)', // Primary color weak tint
    borderRadius: theme.borderRadius.pill,
  },
  tapHintText: {
    ...theme.typography.bodyBold,
    color: theme.colors.primary,
    fontSize: 14,
  },
  warningText: {
    ...theme.typography.caption,
    color: theme.colors.error,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  updateButton: {
    width: '100%',
  },
});
