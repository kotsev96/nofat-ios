import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme';

interface LoadingOverlayProps {
  isLoading: boolean;
  loadingOpacity: Animated.Value;
  loadingScale: Animated.Value;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  loadingOpacity,
  loadingScale,
}) => {
  const spinnerRotation = useRef(new Animated.Value(0)).current;
  const spinnerPulse = useRef(new Animated.Value(1)).current;
  const spinAnimationRef = useRef<Animated.CompositeAnimation | null>(null);
  const pulseAnimationRef = useRef<Animated.CompositeAnimation | null>(null);

  const spin = spinnerRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    if (isLoading) {
      // Continuous spinner rotation
      spinAnimationRef.current = Animated.loop(
        Animated.timing(spinnerRotation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      );
      spinAnimationRef.current.start();

      // Pulsing animation for spinner
      pulseAnimationRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(spinnerPulse, {
            toValue: 1.15,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(spinnerPulse, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimationRef.current.start();
    } else {
      // Stop animations
      if (spinAnimationRef.current) {
        spinAnimationRef.current.stop();
      }
      if (pulseAnimationRef.current) {
        pulseAnimationRef.current.stop();
      }
      spinnerRotation.setValue(0);
      spinnerPulse.setValue(1);
    }

    return () => {
      if (spinAnimationRef.current) {
        spinAnimationRef.current.stop();
      }
      if (pulseAnimationRef.current) {
        pulseAnimationRef.current.stop();
      }
    };
  }, [isLoading]);

  if (!isLoading && loadingOpacity['_value'] === 0) return null;

  return (
    <Animated.View
      style={[
        styles.loadingOverlay,
        {
          opacity: loadingOpacity,
        },
      ]}
      pointerEvents={isLoading ? 'auto' : 'none'}
    >
      <LinearGradient
        colors={['rgba(242, 242, 242, 0.95)', 'rgba(232, 245, 233, 0.95)', 'rgba(255, 255, 255, 0.95)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <Animated.View
        style={[
          styles.loadingContent,
          {
            transform: [{ scale: loadingScale }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.spinnerContainer,
            {
              transform: [
                { rotate: spin },
                { scale: spinnerPulse },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.spinnerGradient}
          >
            <View style={styles.spinnerInner}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.spinnerInnerGradient}
              />
            </View>
          </LinearGradient>
        </Animated.View>
        <Text style={styles.loadingText}>
          AI nutritionist is preparing your weight loss plan for the first week
        </Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  spinnerContainer: {
    width: 80,
    height: 80,
    marginBottom: theme.spacing.xl,
  },
  spinnerGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  spinnerInnerGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  loadingText: {
    ...theme.typography.h3,
    color: theme.colors.text,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 28,
    letterSpacing: 0.2,
  },
});

