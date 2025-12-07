import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface InstructionItemProps {
    instruction: string;
}

/**
 * InstructionItem — displays a single instruction with a bullet point
 */
export const InstructionItem: React.FC<InstructionItemProps> = ({ instruction }) => {
    return (
        <View style={styles.instructionItem}>
            <View style={styles.instructionBullet} />
            <Text style={styles.instructionText}>{instruction}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    instructionItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: theme.spacing.sm,
    },
    instructionBullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: theme.colors.primary,
        marginTop: 8,
        flexShrink: 0,
    },
    instructionText: {
        ...theme.typography.body,
        color: theme.colors.text,
        flex: 1,
        lineHeight: 24,
    },
});
