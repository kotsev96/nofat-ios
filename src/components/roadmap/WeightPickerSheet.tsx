import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    FlatList,
    Platform,
    Dimensions,
    Animated,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { theme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface WeightPickerSheetProps {
    visible: boolean;
    onClose: () => void;
    initialWeight: number;
    onSelect: (weight: number) => void;
    minWeight?: number;
    maxWeight?: number;
}

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export const WeightPickerSheet: React.FC<WeightPickerSheetProps> = ({
    visible,
    onClose,
    initialWeight,
    onSelect,
    minWeight = 50,
    maxWeight = 500,
}) => {
    const insets = useSafeAreaInsets();
    const [selectedWeight, setSelectedWeight] = useState(initialWeight);
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const flatListRef = useRef<FlatList>(null);
    const weights = Array.from(
        { length: (maxWeight - minWeight) * 10 + 1 }, // 0.1 increments
        (_, i) => Number((minWeight + i * 0.1).toFixed(1))
    );

    useEffect(() => {
        if (visible) {
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                damping: 20,
                stiffness: 90,
            }).start();

            // Scroll to initial value after a brief delay to ensure layout
            if (flatListRef.current) {
                const index = weights.indexOf(initialWeight);
                if (index !== -1) {
                    setTimeout(() => {
                        flatListRef.current?.scrollToIndex({
                            index,
                            animated: false,
                        });
                    }, 100);
                }
            }
        } else {
            Animated.timing(slideAnim, {
                toValue: SCREEN_HEIGHT,
                duration: 250,
                useNativeDriver: true,
            }).start();
        }
    }, [visible, slideAnim, initialWeight]);

    const handleScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const index = Math.round(offsetY / ITEM_HEIGHT);
        const weight = weights[index];
        if (weight) {
            setSelectedWeight(weight);
        }
    };

    const handleConfirm = () => {
        onSelect(selectedWeight);
        onClose();
    };

    const renderItem = ({ item, index }: { item: number; index: number }) => {
        const isSelected = item === selectedWeight;
        return (
            <View style={styles.itemContainer}>
                <Text style={[styles.itemText, isSelected && styles.itemTextSelected]}>
                    {item.toFixed(1)}
                </Text>
                {isSelected && <Text style={styles.itemUnit}>lbs</Text>}
            </View>
        );
    };

    if (!visible) return null;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity
                    style={styles.backdrop}
                    onPress={onClose}
                    activeOpacity={1}
                />
                <Animated.View
                    style={[
                        styles.sheetContainer,
                        { transform: [{ translateY: slideAnim }] },
                    ]}
                >
                    {Platform.OS === 'ios' ? (
                        <BlurView intensity={80} tint="light" style={styles.blurView}>
                            <View style={styles.content}>
                                <View style={styles.header}>
                                    <Text style={styles.title}>Select Weight</Text>
                                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                        <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.pickerContainer}>
                                    {/* Selection Indicator */}
                                    <View style={styles.selectionIndicator} />

                                    <FlatList
                                        ref={flatListRef}
                                        data={weights}
                                        renderItem={renderItem}
                                        keyExtractor={(item) => item.toString()}
                                        getItemLayout={(_, index) => ({
                                            length: ITEM_HEIGHT,
                                            offset: ITEM_HEIGHT * index,
                                            index,
                                        })}
                                        snapToInterval={ITEM_HEIGHT}
                                        decelerationRate="fast"
                                        scrollEventThrottle={16}
                                        onScroll={handleScroll}
                                        showsVerticalScrollIndicator={false}
                                        contentContainerStyle={{
                                            paddingVertical: ITEM_HEIGHT * 2, // Spacer for centering
                                        }}
                                    />
                                </View>

                                <Button
                                    title="Done"
                                    onPress={handleConfirm}
                                    style={[styles.confirmButton, { marginBottom: Math.max(theme.spacing.xl, insets.bottom) }]}
                                />
                            </View>
                        </BlurView>
                    ) : (
                        <View style={[styles.blurView, styles.androidBackground]}>
                            <View style={styles.content}>
                                <View style={styles.header}>
                                    <Text style={styles.title}>Select Weight</Text>
                                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                        <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.pickerContainer}>
                                    <View style={styles.selectionIndicator} />
                                    <FlatList
                                        ref={flatListRef}
                                        data={weights}
                                        renderItem={renderItem}
                                        keyExtractor={(item) => item.toString()}
                                        getItemLayout={(_, index) => ({
                                            length: ITEM_HEIGHT,
                                            offset: ITEM_HEIGHT * index,
                                            index,
                                        })}
                                        snapToInterval={ITEM_HEIGHT}
                                        decelerationRate="fast"
                                        // scrollEventThrottle={16} // Removed duplicate
                                        onScroll={handleScroll}
                                        showsVerticalScrollIndicator={false}
                                        contentContainerStyle={{
                                            paddingVertical: ITEM_HEIGHT * 2,
                                        }}
                                    />
                                </View>

                                <Button
                                    title="Done"
                                    onPress={handleConfirm}
                                    style={[styles.confirmButton, { marginBottom: Math.max(theme.spacing.xl, insets.bottom) }]}
                                />
                            </View>
                        </View>
                    )}
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    sheetContainer: {
        borderTopLeftRadius: theme.borderRadius.xl,
        borderTopRightRadius: theme.borderRadius.xl,
        overflow: 'hidden',
        height: 480, // Fixed height to prevent layout collapse
    },
    blurView: {
        flex: 1,
    },
    androidBackground: {
        backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
        padding: theme.spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    title: {
        ...theme.typography.h3,
        color: theme.colors.text,
    },
    closeButton: {
        padding: theme.spacing.xs,
    },
    pickerContainer: {
        height: ITEM_HEIGHT * VISIBLE_ITEMS,
        position: 'relative',
        marginBottom: theme.spacing.lg,
    },
    selectionIndicator: {
        position: 'absolute',
        top: ITEM_HEIGHT * 2, // Centered
        left: 0,
        right: 0,
        height: ITEM_HEIGHT,
        backgroundColor: theme.colors.glassDark,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.primary,
    },
    itemContainer: {
        height: ITEM_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing.xs,
    },
    itemText: {
        ...theme.typography.h2,
        color: theme.colors.textSecondary,
        opacity: 0.5,
    },
    itemTextSelected: {
        ...theme.typography.h1,
        color: theme.colors.text,
        opacity: 1,
        fontSize: 32,
    },
    itemUnit: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
        marginBottom: 4,
    },
    confirmButton: {
        width: '100%',
    },
});
