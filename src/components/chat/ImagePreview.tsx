import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { theme } from '../../theme';

interface ImagePreviewProps {
    imageUri: string;
    onCancel: () => void;
    onSend: () => void;
    bottomPadding: Animated.Value;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
    imageUri,
    onCancel,
    onSend,
    bottomPadding,
}) => {
    return (
        <Animated.View style={[
            styles.previewContainer,
            { bottom: Animated.add(bottomPadding, 70) }
        ]}>
            <BlurView intensity={60} tint="light" style={styles.previewWrapper}>
                <Image source={{ uri: imageUri }} style={styles.previewImage} />
                <View style={styles.previewActions}>
                    <TouchableOpacity
                        style={styles.previewCancelButton}
                        onPress={onCancel}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="close" size={20} color={theme.colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.previewSendButton}
                        onPress={onSend}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-up" size={18} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </BlurView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    previewContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        paddingHorizontal: theme.spacing.lg,
        zIndex: 9,
        marginBottom: theme.spacing.sm,
    },
    previewWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderRadius: 16,
        padding: theme.spacing.sm,
        borderWidth: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        ...theme.shadows.sm,
    },
    previewImage: {
        width: 60,
        height: 60,
        borderRadius: 12,
        marginRight: theme.spacing.sm,
    },
    previewActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    previewCancelButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewSendButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
