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
import { PanGestureHandler } from 'react-native-gesture-handler';
import { theme } from '../../theme';
import { getAlternativeProducts } from '../../utils/roadmapData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ReplaceProductModalProps {
  visible: boolean;
  onClose: () => void;
  product: {
    category: string;
    index: number;
    originalProduct: { name: string; amount: string; canReplace: boolean };
  } | null;
  onSelectProduct: (product: { name: string; amount: string }) => void;
}

export const ReplaceProductModal: React.FC<ReplaceProductModalProps> = ({
  visible,
  onClose,
  product,
  onSelectProduct,
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

  const handleSelect = (newProduct: { name: string; amount: string }) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onSelectProduct(newProduct);
    });
  };

  const onGestureEvent = (event: any) => {
    const { translationX } = event.nativeEvent;
    if (translationX > 0) {
      translateX.setValue(translationX);
    }
  };

  const onHandlerStateChange = (event: any) => {
    const { translationX, state } = event.nativeEvent;
    if (state === 5) {
      if (translationX > 100) {
        handleClose();
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  if (!product) return null;

  const alternatives = getAlternativeProducts(product.category, product.originalProduct.name);

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
            <PanGestureHandler
              onGestureEvent={onGestureEvent}
              onHandlerStateChange={onHandlerStateChange}
              activeOffsetX={10}
              failOffsetY={[-10, 10]}
            >
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
                    <Text style={styles.title}>Replace Product</Text>
                    <Text style={styles.subtitle}>
                      Choose an alternative for {product.originalProduct.name}
                    </Text>
                  </View>

                  {/* Current Product */}
                  <View style={styles.currentProductCard}>
                    <CurrentProductContent product={product.originalProduct} />
                  </View>

                  {/* Alternative Products */}
                  <View style={styles.alternativeProductsSection}>
                    <Text style={styles.alternativeProductsTitle}>Alternative Options</Text>
                    {alternatives.map((altProduct, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.alternativeProductCard}
                        activeOpacity={0.8}
                        onPress={() => handleSelect(altProduct)}
                      >
                        <AlternativeProductContent product={altProduct} />
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </Animated.View>
            </PanGestureHandler>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
};

const CurrentProductContent = ({ product }: { product: { name: string; amount: string } }) => {
  const Content = () => (
    <>
      <View style={styles.currentProductInfo}>
        <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
        <View style={styles.currentProductTextContainer}>
          <Text style={styles.currentProductLabel}>Current</Text>
          <Text style={styles.currentProductName}>{product.name}</Text>
          <Text style={styles.currentProductAmount}>{product.amount}</Text>
        </View>
      </View>
      <View style={styles.productAccent} />
    </>
  );

  if (Platform.OS === 'web') {
    return (
      <View style={styles.currentProductContent}>
        <Content />
      </View>
    );
  }

  return (
    <BlurView intensity={60} tint="light" style={styles.currentProductContent}>
      <Content />
    </BlurView>
  );
};

const AlternativeProductContent = ({ product }: { product: { name: string; amount: string } }) => {
  const Content = () => (
    <>
      <Text style={styles.alternativeProductName}>{product.name}</Text>
      <Text style={styles.alternativeProductAmount}>{product.amount}</Text>
      <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
    </>
  );

  if (Platform.OS === 'web') {
    return (
      <View style={styles.alternativeProductContent}>
        <Content />
      </View>
    );
  }

  return (
    <BlurView intensity={60} tint="light" style={styles.alternativeProductContent}>
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
  currentProductCard: {
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  currentProductContent: {
    flexDirection: 'row',
    backgroundColor: Platform.OS === 'web'
      ? 'rgba(255, 255, 255, 0.4)'
      : 'rgba(255, 255, 255, 0.25)',
    borderRadius: theme.borderRadius.lg,
    // padding removed to allow accent bar to flush right
    borderWidth: 2,
    borderColor: theme.colors.primary,
    overflow: 'hidden',
  },
  currentProductInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg, // moved padding here
    gap: theme.spacing.md,
  },
  currentProductTextContainer: {
    flex: 1,
  },
  currentProductLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  currentProductName: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    fontWeight: '600',
  },
  currentProductAmount: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  productAccent: {
    width: 6,
    backgroundColor: theme.colors.primary,
  },
  alternativeProductsSection: {
    marginTop: theme.spacing.md,
  },
  alternativeProductsTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    fontWeight: '600',
  },
  alternativeProductCard: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  alternativeProductContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    backgroundColor: Platform.OS === 'web'
      ? 'rgba(255, 255, 255, 0.4)'
      : 'rgba(255, 255, 255, 0.25)',
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.secondary,
  },
  alternativeProductName: {
    ...theme.typography.bodyBold,
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.md,
  },
  alternativeProductAmount: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.sm,
  },
});

