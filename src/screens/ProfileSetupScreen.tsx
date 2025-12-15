import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { InputField } from '../components/InputField';
import { Button } from '../components/Button';
import { theme } from '../theme';
import { createProfile } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface ProfileSetupScreenProps {
  navigation: any;
}

/**
 * ProfileSetupScreen — user profile form with floating labels
 * Clean input fields without standard TextInput borders
 */
export const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({
  navigation,
}) => {
  const { user, refreshProfile, signOut } = useAuth();
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [goal, setGoal] = useState('');
  const [saving, setSaving] = useState(false);

  const [errors, setErrors] = useState<{
    height?: string;
    weight?: string;
    age?: string;
    goal?: string;
  }>({});

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: theme.animations.normal,
      useNativeDriver: true,
    }).start();
  }, []);

  // Validation functions
  const validateHeight = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'Height is required';
    }

    // Check format: should be like 5'1 or 5'11
    const heightPattern = /^(\d+)'(\d{1,2})$/;
    const match = value.trim().match(heightPattern);

    if (!match) {
      return "Height must be in format 5'1 (feet'inches)";
    }

    const feet = parseInt(match[1], 10);
    const inches = parseInt(match[2], 10);

    if (feet < 3 || feet > 8) {
      return 'Feet must be between 3 and 8';
    }

    if (inches < 0 || inches > 11) {
      return 'Inches must be between 0 and 11';
    }

    return undefined;
  };

  const validateWeight = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'Weight is required';
    }
    const num = parseFloat(value);
    if (isNaN(num)) {
      return 'Weight must be a number';
    }
    if (num < 50 || num > 500) {
      return 'Weight must be between 50 and 500 lbs';
    }
    return undefined;
  };

  const validateAge = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'Age is required';
    }
    const num = parseInt(value, 10);
    if (isNaN(num) || !Number.isInteger(parseFloat(value))) {
      return 'Age must be a whole number';
    }
    if (num < 13 || num > 120) {
      return 'Age must be between 13 and 120 years';
    }
    return undefined;
  };

  const validateGoalWeight = (value: string, currentWeight?: string): string | undefined => {
    if (!value.trim()) {
      return 'Goal weight is required';
    }
    const num = parseFloat(value);
    if (isNaN(num)) {
      return 'Goal weight must be a number';
    }
    if (num < 50 || num > 500) {
      return 'Goal weight must be between 50 and 500 lbs';
    }
    // Check if goal weight is greater than or equal to current weight
    if (currentWeight && currentWeight.trim()) {
      const currentWeightNum = parseFloat(currentWeight);
      if (!isNaN(currentWeightNum) && num >= currentWeightNum) {
        return 'Goal weight must be less than current weight';
      }
    }
    return undefined;
  };

  // Sanitize input to only allow numbers and decimal point
  const sanitizeNumericInput = (text: string, allowDecimal: boolean = true): string => {
    if (allowDecimal) {
      // Allow numbers and one decimal point
      const parts = text.split('.');
      if (parts.length > 2) {
        return parts[0] + '.' + parts.slice(1).join('');
      }
      return text.replace(/[^0-9.]/g, '');
    } else {
      // Only allow whole numbers
      return text.replace(/[^0-9]/g, '');
    }
  };

  // Sanitize height input to allow format 5'1
  const sanitizeHeightInput = (text: string): string => {
    // Allow numbers and single apostrophe
    // Only allow one apostrophe
    const parts = text.split("'");
    if (parts.length > 2) {
      return parts[0] + "'" + parts.slice(1).join('');
    }
    // Allow digits and one apostrophe
    return text.replace(/[^0-9']/g, '');
  };

  const handleHeightChange = (text: string) => {
    const sanitized = sanitizeHeightInput(text);
    setHeight(sanitized);
    if (errors.height) {
      const error = validateHeight(sanitized);
      setErrors((prev) => ({ ...prev, height: error }));
    }
  };

  const handleWeightChange = (text: string) => {
    const sanitized = sanitizeNumericInput(text, true);
    setWeight(sanitized);
    if (errors.weight) {
      const error = validateWeight(sanitized);
      setErrors((prev) => ({ ...prev, weight: error }));
    }
    // Revalidate goal weight when current weight changes
    if (goal && goal.trim()) {
      const goalError = validateGoalWeight(goal, sanitized);
      setErrors((prev) => ({ ...prev, goal: goalError }));
    }
  };

  const handleAgeChange = (text: string) => {
    const sanitized = sanitizeNumericInput(text, false);
    setAge(sanitized);
    if (errors.age) {
      const error = validateAge(sanitized);
      setErrors((prev) => ({ ...prev, age: error }));
    }
  };

  const handleGoalChange = (text: string) => {
    const sanitized = sanitizeNumericInput(text, true);
    setGoal(sanitized);
    if (errors.goal) {
      const error = validateGoalWeight(sanitized, weight);
      setErrors((prev) => ({ ...prev, goal: error }));
    }
  };

  const handleBlur = (field: 'height' | 'weight' | 'age' | 'goal', value?: string) => {
    let error: string | undefined;
    switch (field) {
      case 'height':
        error = validateHeight(height);
        break;
      case 'weight':
        error = validateWeight(value || weight);
        // Revalidate goal weight when current weight changes
        if (goal && goal.trim()) {
          const goalError = validateGoalWeight(goal, value || weight);
          setErrors((prev) => ({ ...prev, goal: goalError }));
        }
        break;
      case 'age':
        error = validateAge(value || age);
        break;
      case 'goal':
        error = validateGoalWeight(value || goal, weight);
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSave = async () => {
    // Validate all fields
    const heightError = validateHeight(height);
    const weightError = validateWeight(weight);
    const ageError = validateAge(age);
    const goalError = validateGoalWeight(goal, weight);

    const newErrors = {
      height: heightError,
      weight: weightError,
      age: ageError,
      goal: goalError,
    };

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error !== undefined);

    if (hasErrors) {
      // Scroll to first error field
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      }, 100);
      return;
    }

    // All valid, proceed with save
    setSaving(true);
    try {
      // Convert height from feet'inches to cm
      const heightPattern = /^(\d+)'(\d{1,2})$/;
      const match = height.trim().match(heightPattern);
      if (!match) {
        throw new Error('Invalid height format');
      }
      const feet = parseInt(match[1], 10);
      const inches = parseInt(match[2], 10);
      const totalInches = feet * 12 + inches;
      const heightCm = Math.round(totalInches * 2.54);

      // Determine username from auth data
      let autoUsername = 'user';
      if (user?.user_metadata?.name) {
        autoUsername = user.user_metadata.name;
      } else if (user?.email) {
        autoUsername = user.email.split('@')[0];
      }

      await createProfile({
        username: autoUsername,
        height_cm: heightCm,
        age: parseInt(age, 10),
        gender,
        initial_weight_lbs: parseFloat(weight),
        goal_weight_lbs: parseFloat(goal),
      });

      // Refresh profile in Auth Context
      await refreshProfile();

      // Navigate to main app
      navigation.navigate('MainTabs');
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.message || 'Failed to create profile. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with back button and title */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Setup</Text>
        <View style={styles.backButtonPlaceholder} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <Animated.View style={{ opacity: fadeAnim, pointerEvents: 'box-none' as const }}>
            {/* Subtitle */}
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitle}>
                Fill in your details to start tracking your progress
              </Text>
            </View>

            {/* Gender (Toggle) */}
            <View style={styles.genderContainer}>
              <Text style={styles.genderLabel}>Gender</Text>
              <View style={styles.genderToggle}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === 'male' && styles.genderButtonActive,
                  ]}
                  onPress={() => setGender('male')}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="male"
                    size={24}
                    color={gender === 'male' ? '#FFFFFF' : theme.colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.genderText,
                      gender === 'male' && styles.genderTextActive,
                    ]}
                  >
                    Male
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === 'female' && styles.genderButtonActive,
                  ]}
                  onPress={() => setGender('female')}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="female"
                    size={24}
                    color={gender === 'female' ? '#FFFFFF' : theme.colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.genderText,
                      gender === 'female' && styles.genderTextActive,
                    ]}
                  >
                    Female
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Input fields */}
            <View style={styles.form}>
              <InputField
                label="Height (ft'in)"
                value={height}
                onChangeText={handleHeightChange}
                onFocus={() => {
                  if (errors.height) {
                    setErrors((prev) => ({ ...prev, height: undefined }));
                  }
                }}
                onBlur={() => handleBlur('height')}
                keyboardType="default"
                placeholder="5'1"
                error={errors.height}
              />

              <InputField
                label="Weight (lbs)"
                value={weight}
                onChangeText={handleWeightChange}
                onFocus={() => {
                  if (errors.weight) {
                    setErrors((prev) => ({ ...prev, weight: undefined }));
                  }
                }}
                onBlur={() => handleBlur('weight', weight)}
                keyboardType="decimal-pad"
                placeholder=""
                error={errors.weight}
              />

              <InputField
                label="Age"
                value={age}
                onChangeText={handleAgeChange}
                onFocus={() => {
                  if (errors.age) {
                    setErrors((prev) => ({ ...prev, age: undefined }));
                  }
                  setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                  }, 300);
                }}
                onBlur={() => handleBlur('age', age)}
                keyboardType="numeric"
                placeholder=""
                error={errors.age}
              />

              <InputField
                label="Goal Weight (lbs)"
                value={goal}
                onChangeText={handleGoalChange}
                onFocus={() => {
                  if (errors.goal) {
                    setErrors((prev) => ({ ...prev, goal: undefined }));
                  }
                  setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                  }, 300);
                }}
                onBlur={() => handleBlur('goal', goal)}
                keyboardType="decimal-pad"
                placeholder=""
                error={errors.goal}
                helperText={!errors.goal ? "Target weight you want to achieve" : undefined}
              />
            </View>

            {/* CTA button */}
            <Button
              title="Save Data"
              onPress={handleSave}
              loading={saving}
              size="large"
              style={styles.saveButton}
            />

            <Button
              title="Sign out"
              onPress={async () => {
                try {
                  await supabase.auth.signOut();
                  await signOut();
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  });
                } catch (e) {
                  console.log('Sign out error', e);
                }
              }}
              size="medium"
              style={styles.signOutButton}
              variant="secondary"
            />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
    minHeight: 44,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  backButtonPlaceholder: {
    width: 44,
    height: 44,
    flexShrink: 0,
  },
  headerTitle: {
    ...theme.typography.h3,
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
    textAlign: 'center',
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
    flexGrow: 1,
  },
  subtitleContainer: {
    marginBottom: theme.spacing.xl,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  genderContainer: {
    marginBottom: theme.spacing.lg,
  },
  genderLabel: {
    ...theme.typography.bodyBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  genderToggle: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.backgroundSecondary,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  genderButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primaryDark,
    ...theme.shadows.sm,
  },
  genderText: {
    ...theme.typography.bodyBold,
    color: theme.colors.textSecondary,
  },
  genderTextActive: {
    color: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  form: {
    marginBottom: theme.spacing.lg,
  },
  saveButton: {
    marginTop: 0,
  },
  signOutButton: {
    marginTop: theme.spacing.md,
  },
});

