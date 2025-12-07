import React, { useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
    StyleSheet,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { theme } from '../../theme';

interface ChatInputProps {
    onSend: (text: string) => void;
    onCameraPress: () => void;
    isAnalyzing: boolean;
    bottomPadding: Animated.Value;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    onSend,
    onCameraPress,
    isAnalyzing,
    bottomPadding,
}) => {
    const [inputText, setInputText] = useState('');
    const [contentHeight, setContentHeight] = useState(0);

    const handleSend = () => {
        if (inputText.trim()) {
            onSend(inputText);
            setInputText('');
            setContentHeight(0);
        }
    };

    const renderInputContent = () => (
        <>
            <TouchableOpacity
                style={styles.cameraButton}
                onPress={onCameraPress}
                activeOpacity={0.7}
                disabled={isAnalyzing}
            >
                {isAnalyzing ? (
                    <ActivityIndicator size="small" color={theme.colors.textSecondary} />
                ) : (
                    <Ionicons
                        name="camera-outline"
                        size={28}
                        color={theme.colors.textSecondary}
                    />
                )}
            </TouchableOpacity>
            <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={(text) => {
                    setInputText(text);
                    if (text === '') setContentHeight(0);
                }}
                placeholder="Message AI Nutritionist..."
                placeholderTextColor={theme.colors.textSecondary}
                multiline
                maxLength={500}
                onContentSizeChange={(e) => setContentHeight(e.nativeEvent.contentSize.height)}
                scrollEnabled={contentHeight > 100}
            />
            <TouchableOpacity
                style={[
                    styles.sendButton,
                    !inputText.trim() && styles.sendButtonDisabled,
                ]}
                onPress={handleSend}
                disabled={!inputText.trim()}
                activeOpacity={0.7}
            >
                <Ionicons
                    name="arrow-up"
                    size={18}
                    color={inputText.trim() ? '#FFFFFF' : theme.colors.textSecondary}
                />
            </TouchableOpacity>
        </>
    );

    return (
        <Animated.View style={[styles.inputContainer, { bottom: bottomPadding }]}>
            {Platform.OS === 'web' ? (
                <View style={[styles.inputWrapper, styles.inputWrapperWeb]}>
                    {renderInputContent()}
                </View>
            ) : (
                <BlurView intensity={60} tint="light" style={styles.inputWrapper}>
                    {renderInputContent()}
                </BlurView>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        paddingHorizontal: theme.spacing.lg,
        paddingTop: 0,
        paddingBottom: 0,
        backgroundColor: 'transparent',
        zIndex: 10,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderRadius: 26,
        paddingLeft: theme.spacing.sm,
        paddingRight: theme.spacing.sm, // Reduced from md for symmetry
        paddingVertical: 10,
        borderWidth: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        minHeight: 52,
        overflow: 'hidden',
        ...theme.shadows.sm,
    },
    inputWrapperWeb: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    } as any,
    input: {
        flex: 1,
        color: theme.colors.text,
        fontSize: 16,
        lineHeight: 22,
        minHeight: 32,
        maxHeight: 120,
        paddingTop: 5,
        paddingBottom: 5,
        margin: 0,
        textAlignVertical: 'top',
        includeFontPadding: false,
        outlineStyle: 'none',
    } as any, // Cast to any to include web-only styles if Typescript complains, or standard RN styles
    cameraButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.xs,
        marginBottom: 0,
    },
    sendButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: theme.spacing.sm,
        marginBottom: 0,
    },
    sendButtonDisabled: {
        backgroundColor: '#E0E0E0',
    },
});
