import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  Animated,
} from 'react-native';
import { theme } from '../theme';

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
  helperText?: string;
}

/**
 * Floating label input with smooth animation
 * Modern design without standard borders
 */
export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  helperText,
  value,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [animatedValue] = useState(new Animated.Value(value ? 1 : 0));

  const handleFocus = (e: any) => {
    setIsFocused(true);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: theme.animations.normal,
      useNativeDriver: false,
    }).start();
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (!value) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: theme.animations.normal,
        useNativeDriver: false,
      }).start();
    }
    onBlur?.(e);
  };

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: theme.animations.normal,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const labelTop = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [26, -12],
  });

  const labelSize = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12],
  });

  const labelColor = isFocused
    ? theme.colors.primary
    : value
    ? theme.colors.textSecondary
    : theme.colors.textLight;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
        ]}
        collapsable={false}
      >
        <Animated.View
          style={[
            styles.labelContainer,
            isFocused && styles.labelContainerFocused,
            {
              top: labelTop,
              pointerEvents: 'none' as const,
            },
          ]}
        >
          <Animated.Text
            style={[
              styles.label,
              isFocused && styles.labelFocused,
              {
                fontSize: labelSize,
                color: labelColor,
              },
            ]}
            numberOfLines={1}
          >
            {label}
          </Animated.Text>
        </Animated.View>
        <View style={[styles.inputWrapper, { pointerEvents: 'box-none' as const }]}>
          <TextInput
            style={styles.input}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholderTextColor="transparent"
            editable={true}
            autoCorrect={false}
            autoCapitalize="none"
            {...props}
          />
        </View>
      </View>
      {(error || helperText) && (
        <Text style={[styles.helperText, error && styles.helperTextError]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  inputContainer: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingTop: 20,
    paddingBottom: theme.spacing.sm,
    minHeight: 68,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
    justifyContent: 'center',
    overflow: 'visible',
  },
  inputContainerFocused: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.background,
    ...theme.shadows.sm,
  },
  labelContainerFocused: {
    backgroundColor: theme.colors.background,
  },
  labelFocused: {
    // Keep label visible when focused
  },
  inputContainerError: {
    borderColor: theme.colors.error,
  },
  labelContainer: {
    position: 'absolute',
    left: theme.spacing.md - 4,
    paddingHorizontal: 8,
    backgroundColor: theme.colors.backgroundSecondary,
    zIndex: 10,
    borderRadius: 4,
  },
  label: {
    color: theme.colors.textLight,
    fontWeight: '500',
  },
  inputWrapper: {
    flex: 1,
    justifyContent: 'center',
    zIndex: 2,
  },
  input: {
    ...theme.typography.body,
    color: theme.colors.text,
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 0,
    marginTop: 0,
    minHeight: 44,
    width: '100%',
  },
  helperText: {
    ...theme.typography.small,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.md,
  },
  helperTextError: {
    color: theme.colors.error,
  },
});

