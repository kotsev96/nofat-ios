import React from 'react';
import { Platform, ActivityIndicator, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LoginScreen } from '../screens/LoginScreen';
import { ProfileSetupScreen } from '../screens/ProfileSetupScreen';
import { WeightUpdateScreen } from '../screens/WeightUpdateScreen';
import { LeaderboardScreen } from '../screens/LeaderboardScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { NutritionistScreen } from '../screens/NutritionistScreen';
import { RoadmapScreen } from '../screens/RoadmapScreen';
import { MealPrepInstructionsScreen } from '../screens/MealPrepInstructionsScreen';
import { ProductsScreen } from '../screens/ProductsScreen';
import { TabBar } from '../components/TabBar';
import { theme } from '../theme';
import { useAuth } from '../contexts/AuthContext';

export type RootStackParamList = {
  Login: undefined;
  ProfileSetup: undefined;
  MainTabs: undefined;
  Leaderboard: undefined;
  UpdateWeight: undefined;
  MealPrepInstructions: { days: number | '3-4' };
  Products: undefined;
};

export type MainTabParamList = {
  Nutritionist: undefined;
  Roadmap: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * MainTabNavigator — bottom tab navigator with Roadmap, Nutritionist, and Profile
 */
const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="Nutritionist"
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
      }}
    >
      <Tab.Screen
        name="Roadmap"
        component={RoadmapScreen}
        options={{
          tabBarLabel: 'Roadmap',
          tabBarAccessibilityLabel: 'Roadmap',
          tabBarShowLabel: true,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'map' : 'map-outline'}
              size={24}
              color={focused ? theme.colors.primary : theme.colors.textSecondary}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Nutritionist"
        component={NutritionistScreen}
        options={{
          tabBarLabel: 'Nutritionist',
          tabBarAccessibilityLabel: 'Nutritionist',
          tabBarShowLabel: true,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'restaurant' : 'restaurant-outline'}
              size={24}
              color={focused ? theme.colors.primary : theme.colors.textSecondary}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarAccessibilityLabel: 'Profile',
          tabBarShowLabel: true,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={24}
              color={focused ? theme.colors.primary : theme.colors.textSecondary}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

/**
 * AppNavigator — app navigation with smooth transition animations
 * React Navigation 6 Native Stack with custom animations
 */
export const AppNavigator: React.FC = () => {
  const { user, profile, loading } = useAuth();

  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'transparent',
    },
  };

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F2F2F2' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: {
            backgroundColor: 'white', // Set explicit white background to avoid grey overlay on swipe back
          },
          // Enable swipe back gesture for iOS
          gestureEnabled: true,
          fullScreenGestureEnabled: Platform.OS === 'ios',
        }}
      >
        {!user ? (
          // 1. Not authenticated -> Login
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : !profile ? (
          // 2. Authenticated but no profile -> Setup
          <Stack.Screen
            name="ProfileSetup"
            component={ProfileSetupScreen}
            options={{
              animation: 'slide_from_right',
              gestureEnabled: true,
              fullScreenGestureEnabled: Platform.OS === 'ios',
            }}
          />
        ) : (
          // 3. Authenticated and has profile -> Main App
          <>
            <Stack.Screen
              name="MainTabs"
              component={MainTabNavigator}
              options={{
                animation: 'slide_from_right',
                // Remove contentStyle transparent to ensure correct background
                gestureEnabled: false, // Disable for main tabs
              }}
            />
            <Stack.Screen
              name="Leaderboard"
              component={LeaderboardScreen}
              options={{
                animation: 'slide_from_right',
                gestureEnabled: true,
                fullScreenGestureEnabled: Platform.OS === 'ios',
              }}
            />
            <Stack.Screen
              name="UpdateWeight"
              component={WeightUpdateScreen}
              options={{
                animation: 'slide_from_right',
                gestureEnabled: true,
                fullScreenGestureEnabled: Platform.OS === 'ios',
              }}
            />
            <Stack.Screen
              name="MealPrepInstructions"
              component={MealPrepInstructionsScreen}
              options={{
                animation: 'none', // Disable native animation - we use custom translateX animation
                gestureEnabled: true,
                fullScreenGestureEnabled: Platform.OS === 'ios',
              }}
            />
            <Stack.Screen
              name="Products"
              component={ProductsScreen}
              options={{
                animation: 'none', // Disable native animation - we use custom translateX animation
                headerShown: false,
                gestureEnabled: true,
                fullScreenGestureEnabled: Platform.OS === 'ios',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

