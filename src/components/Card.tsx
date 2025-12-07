import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { theme } from '../theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'elevated';
  style?: ViewStyle;
}

/**
 * Universal card component with glass morphism support
 */
export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  style,
}) => {
  if (variant === 'glass') {
    // BlurView doesn't work on web, use fallback View
    if (Platform.OS === 'web') {
      return (
        <View style={[styles.card, styles.cardGlass, styles.cardGlassWeb, style]}>
          {children}
        </View>
      );
    }
    return (
      <BlurView intensity={20} tint="light" style={[styles.card, styles.cardGlass, style]}>
        {children}
      </BlurView>
    );
  }

  return (
    <View
      style={[
        styles.card,
        variant === 'elevated' && styles.cardElevated,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  cardGlass: {
    backgroundColor: theme.colors.glass,
    overflow: 'hidden',
  },
  cardGlassWeb: {
    backgroundColor: theme.colors.glass,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  },
  cardElevated: {
    ...theme.shadows.lg,
    backgroundColor: theme.colors.background,
  },
});

