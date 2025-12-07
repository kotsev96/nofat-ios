import { useRef, useEffect } from 'react';
import { Animated, Platform, Keyboard } from 'react-native';

export const useKeyboardOffset = (initialOffset: number = 104) => {
  const bottomPadding = useRef(new Animated.Value(initialOffset)).current;

  // React to initialOffset changes (supports dynamic updates & HMR)
  useEffect(() => {
    // Only update if we're at the "resting" position (approx)
    // Since we don't track keyboard state explicitly here, 
    // we'll just animate to the new offset. 
    // This fixes the HMR issue where useRef held the old value.
    Animated.timing(bottomPadding, {
      toValue: initialOffset,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [initialOffset]);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        // Add small offset for Android to prevent keyboard overlap
        const extraOffset = Platform.OS === 'android' ? 35 : 0;
        Animated.timing(bottomPadding, {
          toValue: e.endCoordinates.height + extraOffset,
          duration: Platform.OS === 'ios' ? e.duration : 250,
          useNativeDriver: false, // Layout animation
        }).start();
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      (e) => {
        Animated.timing(bottomPadding, {
          toValue: initialOffset, // Return to initial position
          duration: Platform.OS === 'ios' ? e.duration : 250,
          useNativeDriver: false,
        }).start();
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, [initialOffset]);

  return bottomPadding;
};
