import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { ChatMessage } from '../../types/chat';
import { theme } from '../../theme';

interface ChatMessageItemProps {
    message: ChatMessage;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
    const isUser = message.sender === 'user';

    return (
        <View
            style={[
                styles.messageWrapper,
                isUser ? styles.userMessageWrapper : styles.aiMessageWrapper,
            ]}
        >
            <View
                style={[
                    styles.messageBubble,
                    isUser ? styles.userBubble : styles.aiBubble,
                ]}
            >
                {message.imageUri && (
                    <Image source={{ uri: message.imageUri }} style={styles.messageImage} />
                )}
                {message.text ? (
                    <Text
                        style={[
                            styles.messageText,
                            isUser && styles.userMessageText,
                        ]}
                    >
                        {message.text}
                    </Text>
                ) : null}
                <Text
                    style={[
                        styles.messageTime,
                        isUser && styles.userMessageTime,
                    ]}
                >
                    {message.timestamp}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    messageWrapper: {
        marginBottom: theme.spacing.lg,
        flexDirection: 'row',
    },
    aiMessageWrapper: {
        justifyContent: 'flex-start',
    },
    userMessageWrapper: {
        justifyContent: 'flex-end',
    },
    messageBubble: {
        maxWidth: '80%',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
    },
    aiBubble: {
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        ...theme.shadows.sm,
    },
    userBubble: {
        backgroundColor: theme.colors.primary,
        borderBottomRightRadius: 4,
    },
    messageText: {
        ...theme.typography.body,
        color: theme.colors.text,
        lineHeight: 22,
    },
    userMessageText: {
        color: '#FFFFFF',
    },
    messageTime: {
        fontSize: 11,
        color: theme.colors.textSecondary,
        marginTop: 4,
        opacity: 0.6,
        alignSelf: 'flex-end',
    },
    userMessageTime: {
        color: '#FFFFFF',
        opacity: 0.7,
    },
    messageImage: {
        width: 200,
        height: 200,
        borderRadius: 12,
        marginBottom: theme.spacing.xs,
        resizeMode: 'cover',
    },
});
