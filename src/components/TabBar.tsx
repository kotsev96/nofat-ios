import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps, BottomTabBar } from '@react-navigation/bottom-tabs';
import { theme } from '../theme';

/**
 * TabBar — custom bottom tab bar
 * Three buttons: Leaderboard, Profile, and Update Weight (center button)
 */
export const TabBar: React.FC<BottomTabBarProps> = (props) => {
  const { state, descriptors, navigation, insets } = props;

  // Safety check
  if (!state || !state.routes || !Array.isArray(state.routes) || !descriptors) {
    return null;
  }

  // Ensure all routes have proper descriptors
  const validRoutes = state.routes.filter((route: any) => {
    if (!route || !route.key) return false;
    const descriptor = descriptors[route.key];
    return descriptor && descriptor.options;
  });

  // For web platform, use View with CSS backdrop-filter for glass effect
  if (Platform.OS === 'web') {
    if (validRoutes.length === 0) {
      return null;
    }
    
    return (
      <View style={[styles.container, { paddingBottom: insets?.bottom || 0 }]}>
        <View style={[styles.glassContainer, styles.glassContainerWeb]}>
          <View style={styles.tabBar}>
            {validRoutes.length === 0 ? (
              <View style={{ padding: 20 }}>
                <Text style={{ color: '#000' }}>No routes found</Text>
              </View>
            ) : (
              validRoutes.map((route: any) => {
              const descriptor = descriptors[route.key];
              if (!descriptor) return null;

              const { options } = descriptor;
              if (!options) return null;

              // Skip if hidden
              if (options.tabBarButton || (options.tabBarStyle as any)?.display === 'none') {
                return null;
              }

              const routeIndex = state.routes.findIndex((r: any) => r.key === route.key);
              const isFocused = state.index === routeIndex;

              // Get label safely - ensure it's always a string
              let label: string;
              if (typeof options.tabBarLabel === 'string') {
                label = options.tabBarLabel;
              } else if (typeof options.title === 'string') {
                label = options.title;
              } else if (typeof route.name === 'string') {
                label = route.name;
              } else {
                label = 'Tab';
              }

              // Ensure route.name is a string for navigation
              const routeName = typeof route.name === 'string' ? route.name : '';
              if (!routeName) return null;

              const onPress = () => {
                if (!navigation || !routeName) return;

                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(routeName);
                }
              };

              const onLongPress = () => {
                if (navigation && route.key) {
                  navigation.emit({
                    type: 'tabLongPress',
                    target: route.key,
                  });
                }
              };

              // Special handling for Update Weight button (center)
              if (routeName === 'UpdateWeight') {
                return (
                  <TouchableOpacity
                    key={route.key}
                    accessibilityRole="button"
                    accessibilityState={isFocused ? { selected: true } : {}}
                    accessibilityLabel={options.tabBarAccessibilityLabel || 'Update Weight'}
                    testID={options.tabBarTestID}
                    onPress={onPress}
                    onLongPress={onLongPress}
                    style={styles.updateWeightButton}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={[theme.colors.primary, theme.colors.primaryDark]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.updateWeightGradient}
                    >
                      <Ionicons
                        name="scale-outline"
                        size={20}
                        color="#FFFFFF"
                      />
                      <Text style={styles.updateWeightText}>Update Weight</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                );
              }

              // Regular tab buttons (Nutritionist, Roadmap, Profile)
              const iconName: keyof typeof Ionicons.glyphMap =
                routeName === 'Nutritionist'
                  ? 'ellipse-outline'
                  : routeName === 'Roadmap'
                  ? 'map-outline'
                  : routeName === 'Profile'
                  ? 'person-outline'
                  : 'ellipse-outline';

              const activeIconName: keyof typeof Ionicons.glyphMap =
                routeName === 'Nutritionist'
                  ? 'ellipse'
                  : routeName === 'Roadmap'
                  ? 'map'
                  : routeName === 'Profile'
                  ? 'person'
                  : 'ellipse';

              return (
                <TouchableOpacity
                  key={route.key}
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel || String(label)}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  style={styles.tabButton}
                  activeOpacity={0.7}
                >
                  {iconName && (
                    <Ionicons
                      name={isFocused ? activeIconName : iconName}
                      size={24}
                      color={isFocused ? theme.colors.primary : theme.colors.textSecondary}
                    />
                  )}
                  <Text
                    style={[
                      styles.tabLabel,
                      isFocused && styles.tabLabelActive,
                    ]}
                  >
                    {String(label)}
                  </Text>
                </TouchableOpacity>
              );
            }))}
          </View>
        </View>
      </View>
    );
  }

  // For native platforms, check valid routes first
  if (validRoutes.length === 0) {
    return null;
  }

  // For native platforms, use BlurView for iOS-style glass effect
  return (
    <View style={styles.container}>
      <BlurView
        intensity={60}
        tint="light"
        style={[
          styles.glassContainer,
          insets?.bottom
            ? { marginBottom: insets.bottom > theme.spacing.md ? insets.bottom / 2 : theme.spacing.md }
            : null,
        ]}
      >
        <View style={styles.tabBar}>
          {validRoutes.map((route: any) => {
            const descriptor = descriptors[route.key];
            if (!descriptor) return null;

            const { options } = descriptor;
            if (!options) return null;

            // Skip if hidden
            if (options.tabBarButton || (options.tabBarStyle as any)?.display === 'none') {
              return null;
            }

            const routeIndex = state.routes.findIndex((r: any) => r.key === route.key);
            const isFocused = state.index === routeIndex;

            // Get label safely - ensure it's always a string
            let label: string;
            if (typeof options.tabBarLabel === 'string') {
              label = options.tabBarLabel;
            } else if (typeof options.title === 'string') {
              label = options.title;
            } else if (typeof route.name === 'string') {
              label = route.name;
            } else {
              label = 'Tab';
            }

            // Ensure route.name is a string for navigation
            const routeName = typeof route.name === 'string' ? route.name : '';
            if (!routeName) return null;

            const onPress = () => {
              if (!navigation || !routeName) return;

              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(routeName);
              }
            };

            const onLongPress = () => {
              if (navigation && route.key) {
                navigation.emit({
                  type: 'tabLongPress',
                  target: route.key,
                });
              }
            };

            // Special handling for Update Weight button (center)
            if (routeName === 'UpdateWeight') {
              return (
                <TouchableOpacity
                  key={route.key}
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel || 'Update Weight'}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  style={styles.updateWeightButton}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={[theme.colors.primary, theme.colors.primaryDark]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.updateWeightGradient}
                  >
                    <Ionicons
                      name="scale-outline"
                      size={20}
                      color="#FFFFFF"
                    />
                    <Text style={styles.updateWeightText}>Update Weight</Text>
                  </LinearGradient>
                </TouchableOpacity>
              );
            }

            // Regular tab buttons (Nutritionist, Roadmap, Profile)
            const iconName: keyof typeof Ionicons.glyphMap =
              routeName === 'Nutritionist'
                ? 'ellipse-outline'
                : routeName === 'Roadmap'
                ? 'map-outline'
                : routeName === 'Profile'
                ? 'person-outline'
                : 'ellipse-outline';

            const activeIconName: keyof typeof Ionicons.glyphMap =
              routeName === 'Nutritionist'
                ? 'ellipse'
                : routeName === 'Roadmap'
                ? 'map'
                : routeName === 'Profile'
                ? 'person'
                : 'ellipse';

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel || String(label)}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.tabButton}
                activeOpacity={0.7}
              >
                {iconName && (
                  <Ionicons
                    name={isFocused ? activeIconName : iconName}
                    size={24}
                    color={isFocused ? theme.colors.primary : theme.colors.textSecondary}
                  />
                )}
                <Text
                  style={[
                    styles.tabLabel,
                    isFocused && styles.tabLabelActive,
                  ]}
                >
                  {String(label)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  glassContainer: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderTopWidth: 0,
    borderTopColor: 'transparent',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: theme.borderRadius.pill,
    alignSelf: 'stretch',
    overflow: 'hidden',
    ...theme.shadows.lg,
  },
  glassContainerWeb: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  } as any,
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    minHeight: 52,
    width: '100%',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  tabLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  tabLabelActive: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  updateWeightButton: {
    marginHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
    flexShrink: 0,
  },
  updateWeightGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
  },
  updateWeightText: {
    ...theme.typography.bodyBold,
    color: '#FFFFFF',
    fontSize: 14,
  },
});
