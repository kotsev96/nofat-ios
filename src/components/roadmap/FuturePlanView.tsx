import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { theme } from '../../theme';

export const FuturePlanView: React.FC = () => {
    const Content = () => (
        <View style={styles.innerContent}>
            <Text style={styles.title}>
                Plan in Progress
            </Text>
            <Text style={styles.message}>
                We are currently analyzing your progress from the previous days to craft a personalized weight loss plan for the upcoming period.
            </Text>
            <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>Coming Soon</Text>
            </View>
        </View>
    );

    if (Platform.OS === 'web') {
        return (
            <View style={styles.container}>
                <View style={styles.webContainer}>
                    <Content />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <BlurView intensity={80} tint="light" style={styles.blurContainer}>
                <Content />
            </BlurView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: theme.spacing.lg,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: theme.spacing.xl,
    },
    blurContainer: {
        borderRadius: theme.borderRadius.xl,
        overflow: 'hidden',
        width: '100%',
        borderWidth: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
    webContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        borderRadius: theme.borderRadius.xl,
        overflow: 'hidden',
        width: '100%',
        borderWidth: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    innerContent: {
        padding: theme.spacing.xl,
        alignItems: 'center',
    },
    title: {
        ...theme.typography.h2,
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
        textAlign: 'center',
    },
    message: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginBottom: theme.spacing.lg,
    },
    badgeContainer: {
        backgroundColor: theme.colors.glassDark,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.pill,
    },
    badgeText: {
        ...theme.typography.caption,
        fontWeight: '600',
        color: theme.colors.primaryDark,
    }
});
