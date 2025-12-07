import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { theme } from '../theme';

interface LoginScreenProps {
  navigation: any;
}

const { width } = Dimensions.get('window');

/**
 * LoginScreen — welcome screen with gradient and blur effect
 * Modern 2025 design: neural blur, soft gradients
 */
export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Smooth element appearance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: theme.animations.slow,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleContinue = (provider: 'google' | 'apple' | 'facebook' = 'google') => {
    // In a real app, authentication would happen here
    console.log(`Continue with ${provider}`);
    navigation.navigate('ProfileSetup');
  };

  return (
    <LinearGradient
      colors={['#F2F2F2', '#E8F5E9', '#FFFFFF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Logo and welcome */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.logoCircle}>
              <Ionicons name="barbell" size={48} color={theme.colors.primary} />
            </View>
            <Text style={styles.title}>No Fat Community</Text>
            <Text style={styles.subtitle}>
              Get Motivated. Compete. Lose Weight.
            </Text>
          </Animated.View>

          {/* Glass morphism panel with buttons */}
          <Animated.View
            style={[
              styles.buttonContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {Platform.OS === 'web' ? (
              <View style={[styles.blurCard, styles.blurCardWeb]}>
                <View style={styles.buttonsWrapper}>
                  <Button
                    title="Continue with Google"
                    onPress={() => handleContinue('google')}
                    size="large"
                    icon={
                      <Ionicons
                        name="logo-google"
                        size={24}
                        color="#FFFFFF"
                        style={styles.buttonIcon}
                      />
                    }
                    style={styles.authButton}
                  />
                  
                  <Button
                    title="Continue with Apple"
                    onPress={() => handleContinue('apple')}
                    size="large"
                    icon={
                      <Ionicons
                        name="logo-apple"
                        size={24}
                        color="#FFFFFF"
                        style={styles.buttonIcon}
                      />
                    }
                    style={styles.authButton}
                  />
                  
                  <Button
                    title="Continue with Facebook"
                    onPress={() => handleContinue('facebook')}
                    size="large"
                    icon={
                      <Ionicons
                        name="logo-facebook"
                        size={24}
                        color="#FFFFFF"
                        style={styles.buttonIcon}
                      />
                    }
                    style={styles.authButton}
                  />
                </View>
              </View>
            ) : (
              <BlurView intensity={30} tint="light" style={styles.blurCard}>
                <View style={styles.buttonsWrapper}>
                  <Button
                    title="Continue with Google"
                    onPress={() => handleContinue('google')}
                    size="large"
                    icon={
                      <Ionicons
                        name="logo-google"
                        size={24}
                        color="#FFFFFF"
                        style={styles.buttonIcon}
                      />
                    }
                    style={styles.authButton}
                  />
                  
                  <Button
                    title="Continue with Apple"
                    onPress={() => handleContinue('apple')}
                    size="large"
                    icon={
                      <Ionicons
                        name="logo-apple"
                        size={24}
                        color="#FFFFFF"
                        style={styles.buttonIcon}
                      />
                    }
                    style={styles.authButton}
                  />
                  
                  <Button
                    title="Continue with Facebook"
                    onPress={() => handleContinue('facebook')}
                    size="large"
                    icon={
                      <Ionicons
                        name="logo-facebook"
                        size={24}
                        color="#FFFFFF"
                        style={styles.buttonIcon}
                      />
                    }
                    style={styles.authButton}
                  />
                </View>
              </BlurView>
            )}
          </Animated.View>
        </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.glass,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.lg,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
  },
  blurCard: {
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  blurCardWeb: {
    backgroundColor: 'transparent',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
  },
  buttonsWrapper: {
    width: '100%',
    gap: theme.spacing.md,
  },
  authButton: {
    width: '100%',
  },
  buttonIcon: {
    marginRight: 0,
  },
});

