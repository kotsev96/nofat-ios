import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { InstructionItem } from './InstructionItem';

export interface MealPrepStep {
    title: string;
    time: string;
    instructions: string[];
}

interface StepCardProps {
    step: MealPrepStep;
    stepIndex: number;
}

/**
 * StepCard — displays a meal prep step with instructions
 */
export const StepCard: React.FC<StepCardProps> = ({ step, stepIndex }) => {
    const content = (
        <>
            <View style={styles.stepHeader}>
                <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{stepIndex + 1}</Text>
                </View>
                <View style={styles.stepTitleContainer}>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                    <View style={styles.stepTimeContainer}>
                        <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
                        <Text style={styles.stepTime}>{step.time}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.stepInstructions}>
                {step.instructions.map((instruction, instIndex) => (
                    <InstructionItem key={instIndex} instruction={instruction} />
                ))}
            </View>
        </>
    );

    return (
        <View style={styles.stepCard}>
            {Platform.OS === 'web' ? (
                <View style={styles.stepContent}>{content}</View>
            ) : (
                <BlurView intensity={60} tint="light" style={styles.stepContent}>
                    {content}
                </BlurView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    stepCard: {
        marginBottom: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        ...theme.shadows.md,
    },
    stepContent: {
        backgroundColor: Platform.OS === 'web'
            ? 'rgba(255, 255, 255, 0.4)'
            : 'rgba(255, 255, 255, 0.25)',
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        borderWidth: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    stepHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.md,
        gap: theme.spacing.md,
    },
    stepNumber: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    stepNumberText: {
        ...theme.typography.bodyBold,
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
    stepTitleContainer: {
        flex: 1,
    },
    stepTitle: {
        ...theme.typography.h3,
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
        fontWeight: '600',
    },
    stepTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    stepTime: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        fontWeight: '500',
    },
    stepInstructions: {
        gap: theme.spacing.sm,
    },
});
