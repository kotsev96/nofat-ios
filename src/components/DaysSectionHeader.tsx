import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface DaysSectionHeaderProps {
    title: string;
    totalTime: string;
}

/**
 * DaysSectionHeader — displays a section header for meal prep days
 */
export const DaysSectionHeader: React.FC<DaysSectionHeaderProps> = ({ title, totalTime }) => {
    return (
        <View style={styles.daysSectionHeader}>
            <Text style={styles.daysSectionTitle}>{title}</Text>
            <View style={styles.daysSectionTimeContainer}>
                <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={styles.daysSectionTime}>{totalTime}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    daysSectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.md,
        paddingBottom: theme.spacing.sm,
        borderBottomWidth: 2,
        borderBottomColor: theme.colors.primary,
    },
    daysSectionTitle: {
        ...theme.typography.h2,
        color: theme.colors.text,
        fontWeight: '700',
    },
    daysSectionTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
        backgroundColor: Platform.OS === 'web'
            ? 'rgba(255, 255, 255, 0.4)'
            : 'rgba(255, 255, 255, 0.25)',
        borderRadius: theme.borderRadius.sm,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderWidth: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    daysSectionTime: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        fontWeight: '600',
    },
});
