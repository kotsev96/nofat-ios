import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { getProductsForWeek } from '../../utils/roadmapData';
import { Button } from '../Button';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ProductsModalProps {
  visible: boolean;
  onClose: () => void;
  replacedProducts: Record<string, Record<number, { name: string; amount: string }>>;
  onProductPress: (product: { category: string; index: number; originalProduct: any }) => void;
  onSave: () => void;
  onMealPrepPress: (days: number | '3-4') => void;
}

export const ProductsModal: React.FC<ProductsModalProps> = ({
  visible,
  onClose,
  replacedProducts,
  onProductPress,
  onSave,
  onMealPrepPress,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  useEffect(() => {
    if (visible) {
      fadeAnim.setValue(1);
      translateX.setValue(SCREEN_WIDTH);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 0,
            speed: 14,
          }).start();
        });
      });
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(translateX, {
      toValue: SCREEN_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onClose();
      translateX.setValue(SCREEN_WIDTH);
    });
  };

  const handleMealPrepNav = (days: number | '3-4') => {
    onMealPrepPress(days);
  };

  const productsData = getProductsForWeek(replacedProducts);
  const hasReplacements = Object.keys(replacedProducts).length > 0;

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <LinearGradient
            colors={['#F2F2F2', '#E8F5E9', '#FFFFFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          <SafeAreaView style={styles.safeArea} edges={['top']}>
            <Animated.View
              style={[
                styles.contentContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateX }],
                },
              ]}
            >
              <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={handleClose}
                  activeOpacity={0.7}
                >
                  <Ionicons name="chevron-back" size={28} color={theme.colors.text} />
                </TouchableOpacity>

                <View style={styles.header}>
                  <Text style={styles.title}>Products and Meal Prep</Text>
                  <Text style={styles.subtitle}>Weekly shopping list and prep tips</Text>
                </View>

                {/* Meal Prep Tips */}
                <MealPrepTips onNavigate={handleMealPrepNav} />

                {/* Products by Category */}
                {Object.entries(productsData).map(([category, products]) => (
                  <ProductCategory
                    key={category}
                    category={category}
                    products={products as any[]}
                    onProductPress={(product, index) => onProductPress({
                      category,
                      index,
                      originalProduct: product,
                    })}
                  />
                ))}

                {/* Save Button */}
                {hasReplacements && (
                  <View style={styles.saveButtonContainer}>
                    <Button
                      title="Save"
                      onPress={onSave}
                      style={styles.saveButton}
                    />
                  </View>
                )}
              </ScrollView>
            </Animated.View>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
};

const MealPrepTips = ({ onNavigate }: { onNavigate: (days: number | '3-4') => void }) => {
  const Content = () => (
    <>
      <View style={styles.mealPrepTipsHeader}>
        <Ionicons name="bulb-outline" size={24} color={theme.colors.primary} />
        <Text style={styles.mealPrepTipsTitle}>Meal Prep Instructions</Text>
      </View>
      <View style={styles.mealPrepButtonsContainer}>
        <TouchableOpacity
          style={styles.mealPrepButton}
          activeOpacity={0.7}
          onPress={() => onNavigate('3-4')}
        >
          <Text style={styles.mealPrepButtonText}>3-4 Days</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.mealPrepButton}
          activeOpacity={0.7}
          onPress={() => onNavigate(7)}
        >
          <Text style={styles.mealPrepButtonText}>7 days</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  if (Platform.OS === 'web') {
    return (
      <View style={styles.mealPrepTipsCard}>
        <Content />
      </View>
    );
  }

  return (
    <BlurView intensity={80} tint="light" style={styles.mealPrepTipsCard}>
      <Content />
    </BlurView>
  );
};

const ProductCategory = ({
  category,
  products,
  onProductPress,
}: {
  category: string;
  products: Array<{ name: string; amount: string; canReplace: boolean }>;
  onProductPress: (product: any, index: number) => void;
}) => {
  const getIconName = (cat: string) => {
    switch (cat) {
      case 'proteins': return 'fish-outline';
      case 'vegetables': return 'leaf-outline';
      case 'carbs': return 'nutrition-outline';
      case 'fruits': return 'rose-outline';
      default: return 'cube-outline';
    }
  };

  return (
    <View style={styles.productsCategory}>
      <View style={styles.categoryHeader}>
        <Ionicons
          name={getIconName(category)}
          size={20}
          color={theme.colors.primary}
        />
        <Text style={styles.categoryTitle}>
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Text>
      </View>
      {products.map((product, index) => (
        <TouchableOpacity
          key={index}
          style={styles.productItemWrapper}
          activeOpacity={0.8}
          onPress={() => {
            if (product.canReplace) {
              onProductPress(product, index);
            }
          }}
        >
          <ProductItem product={product} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const ProductItem = ({ product }: { product: any }) => {
  const Content = () => (
    <>
      <View style={styles.productItemContent}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productAmount}>{product.amount}</Text>
      </View>
      {product.canReplace && (
        <Ionicons
          name="swap-horizontal-outline"
          size={20}
          color={theme.colors.textSecondary}
        />
      )}
    </>
  );

  if (Platform.OS === 'web') {
    return (
      <View style={styles.productItem}>
        <Content />
      </View>
    );
  }

  return (
    <BlurView intensity={60} tint="light" style={styles.productItem}>
      <Content />
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  backButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
    alignSelf: 'flex-start',
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    fontWeight: '700',
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  mealPrepTipsCard: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    backgroundColor: Platform.OS === 'web'
      ? 'rgba(255, 255, 255, 0.4)'
      : 'rgba(255, 255, 255, 0.25)',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    ...theme.shadows.md,
    ...(Platform.OS === 'web' && {
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    }),
  },
  mealPrepTipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  mealPrepTipsTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    fontWeight: '600',
  },
  mealPrepButtonsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  mealPrepButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.sm,
  },
  mealPrepButtonText: {
    ...theme.typography.bodyBold,
    color: '#FFFFFF',
    fontSize: 16,
  },
  productsCategory: {
    marginBottom: theme.spacing.xl,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  categoryTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    fontWeight: '600',
  },
  productItemWrapper: {
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: Platform.OS === 'web'
      ? 'rgba(255, 255, 255, 0.4)'
      : 'rgba(255, 255, 255, 0.25)',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    ...(Platform.OS === 'web' && {
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    }),
  },
  productItemContent: {
    flex: 1,
  },
  productName: {
    ...theme.typography.bodyBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  productAmount: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  saveButtonContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  saveButton: {
    width: '100%',
  },
});

