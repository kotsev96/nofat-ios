import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { theme } from '../theme';
import { getLeaderboard, LeaderboardEntry } from '../api/leaderboard';

interface LeaderboardScreenProps {
  navigation: any;
}

interface LeaderboardItem {
  id: string;
  name: string;
  avatar: string;
  weightLoss: number; // проценты
  lostWeight: number; // lbs - абсолютная потеря веса
  currentWeight: number; // lbs - текущий вес
  rank: number;
  isCurrentUser: boolean;
}

/**
 * Convert API leaderboard entry to UI leaderboard item
 */
function convertLeaderboardEntry(entry: LeaderboardEntry): LeaderboardItem {
  // Валидация и дефолтные значения для защиты от ошибок
  return {
    id: String(entry.rank || 0),
    name: entry.username || 'Unknown',
    avatar: '👤', // дефолтный аватар
    weightLoss: entry.lost_percent || 0,
    lostWeight: entry.lost_weight || 0, // lbs
    currentWeight: entry.current_weight || 0, // lbs
    rank: entry.rank || 0,
    isCurrentUser: entry.is_current_user || false,
  };
}

/**
 * LeaderboardScreen — participants ranking
 * Table with avatar, name, weight loss percentage
 * Current user highlighted with accent color
 */
export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  useEffect(() => {
    if (leaderboard.length > 0) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: theme.animations.normal,
        useNativeDriver: true,
      }).start();
    }
  }, [leaderboard]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLeaderboard();

      // Валидация данных перед конвертацией
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format from server');
      }

      const convertedData = data
        .filter((entry) => entry && typeof entry === 'object') // Фильтруем валидные записи
        .map(convertLeaderboardEntry);

      setLeaderboard(convertedData);
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
      const errorMessage = err instanceof Error
        ? err.message
        : 'Failed to load leaderboard. Please check if the backend server is running.';
      setError(errorMessage);
      setLeaderboard([]); // Устанавливаем пустой массив при ошибке
    } finally {
      setLoading(false);
    }
  };

  const currentMonth = new Date().toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const LeaderboardItemComponent = React.memo(({ item, index }: { item: LeaderboardItem; index: number }) => {
    const itemAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(itemAnim, {
        toValue: 1,
        duration: theme.animations.normal,
        delay: index * 50,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.leaderboardItem,
          item.isCurrentUser && styles.leaderboardItemHighlight,
          {
            opacity: itemAnim,
            transform: [
              {
                translateY: itemAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.itemLeft}>
          <View style={styles.rankContainer}>
            {item.rank <= 3 ? (
              <Ionicons
                name={
                  item.rank === 1
                    ? 'trophy'
                    : item.rank === 2
                      ? 'medal'
                      : 'ribbon'
                }
                size={24}
                color={
                  item.rank === 1
                    ? '#FFD700'
                    : item.rank === 2
                      ? '#C0C0C0'
                      : '#CD7F32'
                }
              />
            ) : (
              <Text style={styles.rankText}>#{item.rank}</Text>
            )}
          </View>

          <View style={styles.avatarContainer}>
            <View
              style={[
                styles.avatar,
                item.isCurrentUser && styles.avatarHighlight,
              ]}
            >
              <Text style={styles.avatarEmoji}>{item.avatar}</Text>
            </View>
          </View>

          <View style={styles.nameContainer}>
            <Text
              style={[
                styles.nameText,
                item.isCurrentUser && styles.nameTextHighlight,
              ]}
            >
              {item.name}
              {item.isCurrentUser && ' (You)'}
            </Text>
            <Text style={styles.currentWeightLabel}>
              {Number(item.currentWeight || 0).toFixed(1)} lbs
            </Text>
          </View>
        </View>

        <View style={styles.itemRight}>
          <Text
            style={[
              styles.weightLossText,
              item.isCurrentUser && styles.weightLossTextHighlight,
            ]}
          >
            -{Number(item.lostWeight || 0).toFixed(1)} lbs
          </Text>
          <Text style={styles.percentageText}>
            -{Number(item.weightLoss || 0).toFixed(1)}%
          </Text>
        </View>
      </Animated.View>
    );
  });

  const renderItem = ({ item, index }: { item: LeaderboardItem; index: number }) => {
    // Дополнительная защита от ошибок при рендеринге
    if (!item || !item.rank) {
      return null;
    }
    return <LeaderboardItemComponent item={item} index={index} />;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F2F2F2', '#E8F5E9', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Back button - iPhone style */}
        <TouchableOpacity
          style={[styles.backButton, { top: insets.top + theme.spacing.xs }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={28} color={theme.colors.text} />
        </TouchableOpacity>

        <Animated.View
          style={[styles.headerContainer, { opacity: fadeAnim }]}
        >
          <Card variant="glass" style={styles.header}>
            <Text style={styles.headerTitle}>
              Top {currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)}
            </Text>
            <Text style={styles.headerSubtitle}>
              Community participants ranking
            </Text>
          </Card>
        </Animated.View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Loading leaderboard...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color={theme.colors.error} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={loadLeaderboard}
              activeOpacity={0.7}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : leaderboard.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="trophy-outline" size={48} color={theme.colors.textSecondary} />
            <Text style={styles.emptyText}>No leaderboard data available</Text>
          </View>
        ) : (
          <FlatList
            data={leaderboard}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshing={loading}
            onRefresh={loadLeaderboard}
          />
        )}
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
  backButton: {
    position: 'absolute',
    // top set dynamically
    left: theme.spacing.md,
    zIndex: 1000,
    padding: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.sm,
  },
  header: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
  },
  headerTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl + 80, // Extra padding for tab bar
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  leaderboardItemHighlight: {
    backgroundColor: theme.colors.glassDark,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    ...theme.shadows.md,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: theme.spacing.md,
  },
  rankContainer: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    ...theme.typography.bodyBold,
    color: theme.colors.textSecondary,
  },
  avatarContainer: {
    marginRight: theme.spacing.xs,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarHighlight: {
    backgroundColor: theme.colors.primary,
  },
  avatarEmoji: {
    fontSize: 24,
  },
  nameContainer: {
    flex: 1,
  },
  nameText: {
    ...theme.typography.bodyBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs / 2,
  },
  nameTextHighlight: {
    color: theme.colors.primaryDark,
  },
  currentWeightLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontSize: 13,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  weightLossText: {
    ...theme.typography.bodyBold,
    color: theme.colors.success,
    marginBottom: theme.spacing.xs,
  },
  weightLossTextHighlight: {
    color: theme.colors.primaryDark,
    fontSize: 18,
  },
  percentageText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xxl,
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.error,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  retryButtonText: {
    ...theme.typography.bodyBold,
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
});

