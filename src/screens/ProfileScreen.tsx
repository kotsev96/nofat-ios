import React, { useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { theme } from '../theme';
import { useAuth } from '../contexts/AuthContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ProfileScreenProps {
  navigation: any;
}

/**
 * ProfileScreen — user profile information
 * Displays user stats and profile details
 */
export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  navigation,
}) => {
  const { signOut } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: theme.animations.normal,
      useNativeDriver: true,
    }).start();
  }, []);

  // Mock user data
  const userData = {
    name: 'Emily Davis',
    avatar: '👤',
    height: 65, // inches
    currentWeight: 145.0, // lbs
    goalWeight: 130.0, // lbs
    age: 28,
    gender: 'female',
    weightLoss: 20.9, // lbs
    startDate: '2024-01-15',
  };

  const progressPercentage = ((userData.currentWeight - userData.goalWeight) / (userData.currentWeight - userData.goalWeight + userData.weightLoss)) * 100;

  // Generate mock weight data for last 30 days
  const weightData = useMemo(() => {
    const data: { date: Date; weight: number }[] = [];
    const today = new Date();
    const startWeight = userData.currentWeight + userData.weightLoss; // Starting weight
    const endWeight = userData.currentWeight;

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Simulate gradual weight loss with some variation
      const progress = (29 - i) / 29;
      const trendWeight = startWeight - (startWeight - endWeight) * progress;
      const variation = (Math.sin(i * 0.5) * 0.8 + Math.cos(i * 0.3) * 0.5); // Natural variation
      const weight = trendWeight + variation;

      data.push({ date, weight: Math.max(endWeight - 2, Math.min(startWeight + 2, weight)) });
    }
    return data;
  }, []);

  // Calculate chart dimensions
  const chartHeight = 200;
  const chartPadding = 20; // Vertical padding for top and bottom
  const gridPadding = theme.spacing.sm; // Padding for grid lines on left and right sides

  // Calculate correct width to fit inside card with paddings
  // Screen padding (lg) + Card padding (lg) = 2 * lg per side = 4 * lg total
  const totalHorizontalPadding = theme.spacing.lg * 4;
  const chartWidth = SCREEN_WIDTH - totalHorizontalPadding;

  // Make y-axis labels more compact and shift graph left for better symmetry
  const yAxisWidth = 35;
  const rightPadding = 35; // Equal padding on right for symmetry

  // Width of the actual chart area (between Y-axis and right padding)
  const graphWidth = chartWidth - yAxisWidth - rightPadding;

  const weights = weightData.map(d => d.weight);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  const weightRange = maxWeight - minWeight || 1;
  const chartAreaHeight = chartHeight - chartPadding * 2; // Height available for graph

  // Calculate points for line graph
  const points = weightData.map((data, index) => {
    // X coordinate: distribute evenly inside the grid lines
    // gridLine has left/right: gridPadding
    // So available width for line is graphWidth - 2 * gridPadding
    const availableWidth = graphWidth - gridPadding * 2;
    const x = gridPadding + (index / (weightData.length - 1)) * availableWidth;

    // Y coordinate: normalize weight to 0-1, then map to chartAreaHeight (inverted)
    const normalizedWeight = (data.weight - minWeight) / weightRange;
    const y = chartPadding + (1 - normalizedWeight) * chartAreaHeight;

    return { x, y, weight: data.weight };
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F2F2F2', '#E8F5E9', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarEmoji}>{userData.avatar}</Text>
                </View>
              </View>
              <Text style={styles.name}>{userData.name}</Text>
              <Text style={styles.subtitle}>Member since {new Date(userData.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</Text>
            </View>

            {/* Weight Chart Card */}
            {Platform.OS === 'web' ? (
              <View style={[styles.chartCard, styles.chartCardWeb]}>
                <Text style={styles.sectionTitle}>Weight Change (Last 30 Days)</Text>

                {/* Chart */}
                <View style={styles.chartContainer}>
                  <View style={[styles.chart, { height: chartHeight, width: chartWidth }]}>
                    {/* Y-axis labels */}
                    <View style={styles.yAxisLabels}>
                      <Text style={styles.yAxisLabel}>{maxWeight.toFixed(1)}</Text>
                      <Text style={styles.yAxisLabel}>{minWeight.toFixed(1)}</Text>
                    </View>

                    {/* Chart area */}
                    <View style={[styles.chartArea, { marginRight: rightPadding }]}>
                      {/* Grid lines - horizontal */}
                      {[0, 1, 2, 3, 4].map((i) => (
                        <View
                          key={`grid-${i}`}
                          style={[
                            styles.gridLine,
                            {
                              top: (chartHeight - chartPadding * 2) * (i / 4) + chartPadding,
                            },
                          ]}
                        />
                      ))}

                      {/* Area fill under line - like in the image */}
                      <View style={styles.areaFill}>
                        {points.map((point, index) => {
                          if (index === 0) return null;
                          const prevPoint = points[index - 1];
                          const bottomY = chartHeight - chartPadding;
                          const minY = Math.min(prevPoint.y, point.y);

                          return (
                            <LinearGradient
                              key={`fill-${index}`}
                              colors={[
                                theme.colors.primary + '25',
                                theme.colors.primary + '15',
                                'transparent',
                              ]}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 0, y: 1 }}
                              style={[
                                styles.fillSegment,
                                {
                                  left: prevPoint.x,
                                  top: minY,
                                  width: point.x - prevPoint.x,
                                  height: bottomY - minY,
                                },
                              ]}
                            />
                          );
                        })}
                      </View>

                      {/* Main line - smooth and simple */}
                      <View style={styles.chartLine}>
                        {points.map((point, index) => {
                          if (index === 0) return null;
                          const prevPoint = points[index - 1];
                          const dx = point.x - prevPoint.x;
                          const dy = point.y - prevPoint.y;
                          const length = Math.sqrt(dx * dx + dy * dy);
                          const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

                          return (
                            <View
                              key={`line-${index}`}
                              style={[
                                styles.lineSegment,
                                {
                                  left: prevPoint.x,
                                  top: prevPoint.y - 2,
                                  width: length,
                                  height: 3,
                                  transform: [{ rotate: `${angle}deg` }],
                                },
                              ]}
                            />
                          );
                        })}
                      </View>

                      {/* Single marker point - like in the image */}
                      {points.map((point, index) => {
                        // Show only the last point (current weight) as a white marker
                        if (index !== points.length - 1) return null;

                        return (
                          <View
                            key={`marker-${index}`}
                            style={[
                              styles.markerPoint,
                              {
                                left: point.x - 6,
                                top: point.y - 6,
                              },
                            ]}
                          />
                        );
                      })}
                    </View>
                  </View>

                  {/* X-axis labels */}
                  <View style={[styles.xAxisLabels, { marginRight: rightPadding, paddingHorizontal: gridPadding }]}>
                    <Text style={styles.xAxisLabel}>
                      {weightData[0].date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Text>
                    <Text style={styles.xAxisLabel}>
                      {weightData[Math.floor(weightData.length / 2)].date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Text>
                    <Text style={styles.xAxisLabel}>
                      {weightData[weightData.length - 1].date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Text>
                  </View>
                </View>

                {/* Summary stats */}
                <View style={styles.summaryStats}>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Current</Text>
                    <Text style={styles.summaryValue}>{userData.currentWeight.toFixed(1)} lbs</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Change</Text>
                    <Text style={[styles.summaryValue, styles.summaryChange]}>
                      {(weightData[weightData.length - 1].weight - weightData[0].weight < 0 ? '-' : '+')}
                      {Math.abs(weightData[weightData.length - 1].weight - weightData[0].weight).toFixed(1)} lbs
                    </Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Goal</Text>
                    <Text style={styles.summaryValue}>{userData.goalWeight.toFixed(1)} lbs</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.updateWeightButton}
                  onPress={() => navigation.navigate('UpdateWeight')}
                  activeOpacity={0.7}
                >
                  <Ionicons name="scale-outline" size={20} color={theme.colors.primary} />
                  <Text style={styles.updateWeightButtonText}>Update Weight</Text>
                  <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.leaderboardButton}
                  onPress={() => navigation.navigate('Leaderboard')}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trophy-outline" size={20} color={theme.colors.primary} />
                  <Text style={styles.leaderboardButtonText}>View Leaderboard</Text>
                  <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.signOutButton}
                  onPress={signOut}
                  activeOpacity={0.7}
                >
                  <Ionicons name="log-out-outline" size={20} color={theme.colors.error} />
                  <Text style={styles.signOutButtonText}>Sign Out</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <BlurView intensity={80} tint="light" style={styles.chartCard}>
                <Text style={styles.sectionTitle}>Weight Change (Last 30 Days)</Text>

                {/* Chart */}
                <View style={styles.chartContainer}>
                  <View style={[styles.chart, { height: chartHeight, width: chartWidth }]}>
                    {/* Y-axis labels */}
                    <View style={styles.yAxisLabels}>
                      <Text style={styles.yAxisLabel}>{maxWeight.toFixed(1)}</Text>
                      <Text style={styles.yAxisLabel}>{minWeight.toFixed(1)}</Text>
                    </View>

                    {/* Chart area */}
                    <View style={[styles.chartArea, { marginRight: rightPadding }]}>
                      {/* Grid lines - horizontal */}
                      {[0, 1, 2, 3, 4].map((i) => (
                        <View
                          key={`grid-${i}`}
                          style={[
                            styles.gridLine,
                            {
                              top: (chartHeight - chartPadding * 2) * (i / 4) + chartPadding,
                            },
                          ]}
                        />
                      ))}

                      {/* Area fill under line - like in the image */}
                      <View style={styles.areaFill}>
                        {points.map((point, index) => {
                          if (index === 0) return null;
                          const prevPoint = points[index - 1];
                          const bottomY = chartHeight - chartPadding;
                          const minY = Math.min(prevPoint.y, point.y);

                          return (
                            <LinearGradient
                              key={`fill-${index}`}
                              colors={[
                                theme.colors.primary + '25',
                                theme.colors.primary + '15',
                                'transparent',
                              ]}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 0, y: 1 }}
                              style={[
                                styles.fillSegment,
                                {
                                  left: prevPoint.x,
                                  top: minY,
                                  width: point.x - prevPoint.x,
                                  height: bottomY - minY,
                                },
                              ]}
                            />
                          );
                        })}
                      </View>

                      {/* Main line - smooth and simple */}
                      <View style={styles.chartLine}>
                        {points.map((point, index) => {
                          if (index === 0) return null;
                          const prevPoint = points[index - 1];
                          const dx = point.x - prevPoint.x;
                          const dy = point.y - prevPoint.y;
                          const length = Math.sqrt(dx * dx + dy * dy);
                          const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

                          return (
                            <View
                              key={`line-${index}`}
                              style={[
                                styles.lineSegment,
                                {
                                  left: prevPoint.x,
                                  top: prevPoint.y - 2,
                                  width: length,
                                  height: 3,
                                  transform: [{ rotate: `${angle}deg` }],
                                },
                              ]}
                            />
                          );
                        })}
                      </View>

                      {/* Single marker point - like in the image */}
                      {points.map((point, index) => {
                        // Show only the last point (current weight) as a white marker
                        if (index !== points.length - 1) return null;

                        return (
                          <View
                            key={`marker-${index}`}
                            style={[
                              styles.markerPoint,
                              {
                                left: point.x - 6,
                                top: point.y - 6,
                              },
                            ]}
                          />
                        );
                      })}
                    </View>
                  </View>

                  {/* X-axis labels */}
                  <View style={[styles.xAxisLabels, { marginRight: rightPadding, paddingHorizontal: gridPadding }]}>
                    <Text style={styles.xAxisLabel}>
                      {weightData[0].date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Text>
                    <Text style={styles.xAxisLabel}>
                      {weightData[Math.floor(weightData.length / 2)].date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Text>
                    <Text style={styles.xAxisLabel}>
                      {weightData[weightData.length - 1].date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Text>
                  </View>
                </View>

                {/* Summary stats */}
                <View style={styles.summaryStats}>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Current</Text>
                    <Text style={styles.summaryValue}>{userData.currentWeight.toFixed(1)} lbs</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Change</Text>
                    <Text style={[styles.summaryValue, styles.summaryChange]}>
                      {(weightData[weightData.length - 1].weight - weightData[0].weight < 0 ? '-' : '+')}
                      {Math.abs(weightData[weightData.length - 1].weight - weightData[0].weight).toFixed(1)} lbs
                    </Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Goal</Text>
                    <Text style={styles.summaryValue}>{userData.goalWeight.toFixed(1)} lbs</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.updateWeightButton}
                  onPress={() => navigation.navigate('UpdateWeight')}
                  activeOpacity={0.7}
                >
                  <Ionicons name="scale-outline" size={20} color={theme.colors.primary} />
                  <Text style={styles.updateWeightButtonText}>Update Weight</Text>
                  <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.leaderboardButton}
                  onPress={() => navigation.navigate('Leaderboard')}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trophy-outline" size={20} color={theme.colors.primary} />
                  <Text style={styles.leaderboardButtonText}>View Leaderboard</Text>
                  <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.signOutButton}
                  onPress={signOut}
                  activeOpacity={0.7}
                >
                  <Ionicons name="log-out-outline" size={20} color={theme.colors.error} />
                  <Text style={styles.signOutButtonText}>Sign Out</Text>
                </TouchableOpacity>
              </BlurView>
            )}

            {/* Profile Details */}
            {Platform.OS === 'web' ? (
              <View style={[styles.detailsCard, styles.detailsCardWeb]}>
                <Text style={styles.sectionTitle}>Profile Details</Text>

                <View style={styles.detailRow}>
                  <Ionicons name="person-outline" size={20} color={theme.colors.textSecondary} />
                  <Text style={styles.detailLabel}>Gender</Text>
                  <Text style={styles.detailValue}>
                    {userData.gender === 'male' ? 'Male' : 'Female'}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={20} color={theme.colors.textSecondary} />
                  <Text style={styles.detailLabel}>Age</Text>
                  <Text style={styles.detailValue}>{userData.age} years</Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="resize-outline" size={20} color={theme.colors.textSecondary} />
                  <Text style={styles.detailLabel}>Height</Text>
                  <Text style={styles.detailValue}>
                    {Math.floor(userData.height / 12)}'{userData.height % 12}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="flag-outline" size={20} color={theme.colors.textSecondary} />
                  <Text style={styles.detailLabel}>Goal Weight</Text>
                  <Text style={styles.detailValue}>{userData.goalWeight.toFixed(1)} lbs</Text>
                </View>
              </View>
            ) : (
              <BlurView intensity={80} tint="light" style={styles.detailsCard}>
                <Text style={styles.sectionTitle}>Profile Details</Text>

                <View style={styles.detailRow}>
                  <Ionicons name="person-outline" size={20} color={theme.colors.textSecondary} />
                  <Text style={styles.detailLabel}>Gender</Text>
                  <Text style={styles.detailValue}>
                    {userData.gender === 'male' ? 'Male' : 'Female'}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={20} color={theme.colors.textSecondary} />
                  <Text style={styles.detailLabel}>Age</Text>
                  <Text style={styles.detailValue}>{userData.age} years</Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="resize-outline" size={20} color={theme.colors.textSecondary} />
                  <Text style={styles.detailLabel}>Height</Text>
                  <Text style={styles.detailValue}>
                    {Math.floor(userData.height / 12)}'{userData.height % 12}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="flag-outline" size={20} color={theme.colors.textSecondary} />
                  <Text style={styles.detailLabel}>Goal Weight</Text>
                  <Text style={styles.detailValue}>{userData.goalWeight.toFixed(1)} lbs</Text>
                </View>
              </BlurView>
            )}
          </Animated.View>
        </ScrollView>
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
  scrollContent: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl + 80, // Extra padding for tab bar
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  avatarContainer: {
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.md,
  },
  avatarEmoji: {
    fontSize: 48,
  },
  name: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  chartCard: {
    marginBottom: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: Platform.OS === 'web'
      ? 'rgba(255, 255, 255, 0.65)'
      : 'rgba(255, 255, 255, 0.5)',
    borderRadius: theme.borderRadius.lg,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
  },
  chartCardWeb: {
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  } as any,
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  chartContainer: {
    marginBottom: theme.spacing.lg,
  },
  chart: {
    position: 'relative',
    marginBottom: theme.spacing.sm,
  },
  yAxisLabels: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 35,
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingRight: 8,
    alignItems: 'flex-end',
  },
  yAxisLabel: {
    ...theme.typography.caption,
    fontSize: 10,
    color: theme.colors.textSecondary,
  },
  chartArea: {
    flex: 1,
    marginLeft: 35,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    left: theme.spacing.sm,
    right: theme.spacing.sm,
    height: 1,
    backgroundColor: theme.colors.textSecondary,
    opacity: 0.15,
  },
  areaFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  fillSegment: {
    position: 'absolute',
  },
  chartLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
  lineSegment: {
    position: 'absolute',
    backgroundColor: theme.colors.primary,
    borderRadius: 1.5,
  },
  markerPoint: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: theme.colors.primary,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  xAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 35,
    paddingHorizontal: theme.spacing.sm,
  },
  xAxisLabel: {
    ...theme.typography.caption,
    fontSize: 10,
    color: theme.colors.textSecondary,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.secondary,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  summaryValue: {
    ...theme.typography.h3,
    fontSize: 18,
    color: theme.colors.text,
  },
  summaryChange: {
    color: theme.colors.primary,
  },
  updateWeightButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.secondary,
    gap: theme.spacing.md,
  },
  updateWeightButtonText: {
    ...theme.typography.bodyBold,
    color: theme.colors.primary,
    flex: 1,
  },
  detailsCard: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: Platform.OS === 'web'
      ? 'rgba(255, 255, 255, 0.65)'
      : 'rgba(255, 255, 255, 0.5)',
    borderRadius: theme.borderRadius.lg,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
  },
  detailsCardWeb: {
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  } as any,
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.md,
  },
  detailLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  detailValue: {
    ...theme.typography.bodyBold,
    color: theme.colors.text,
  },
  leaderboardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.secondary,
    gap: theme.spacing.md,
  },
  leaderboardButtonText: {
    ...theme.typography.bodyBold,
    color: theme.colors.primary,
    flex: 1,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.secondary,
    gap: theme.spacing.md,
  },
  signOutButtonText: {
    ...theme.typography.bodyBold,
    color: theme.colors.error,
    flex: 1,
  },
});

