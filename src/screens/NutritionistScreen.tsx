import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';

// Hooks & Types
import { useChat } from '../hooks/useChat';
import { useImagePicker } from '../hooks/useImagePicker';
import { useKeyboardOffset } from '../hooks/useKeyboardOffset';

// Components
import { ChatMessageItem } from '../components/chat/ChatMessageItem';
import { ChatInput } from '../components/chat/ChatInput';
import { ImagePreview } from '../components/chat/ImagePreview';

interface NutritionistScreenProps {
  navigation: any;
}

/**
 * NutritionistScreen — minimalist chat interface inspired by ChatGPT
 */
export const NutritionistScreen: React.FC<NutritionistScreenProps> = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Custom Hooks
  const { messages, isAnalyzing, sendMessage, sendImageMessage } = useChat();
  const { selectedImage, showImagePickerOptions, clearSelection, setSelectedImage } = useImagePicker();
  const bottomPadding = useKeyboardOffset();

  // Initial Fade In Animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: theme.animations.normal,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, []);

  // Auto-scroll effects
  useEffect(() => {
    // Initial scroll
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: false });
    }, 100);
  }, []);

  useEffect(() => {
    // Scroll on new message
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const handleSendPhoto = () => {
    if (selectedImage) {
      sendImageMessage(selectedImage.uri);
      clearSelection();
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F2F2F2', '#E8F5E9', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <Text style={styles.headerTitle}>Sarah</Text>
          <Text style={styles.headerSubtitle}>Your personal AI nutrition assistant</Text>
        </Animated.View>

        {/* Messages */}
        {/* Messages Wrapper with overflow hidden */}
        <View style={styles.messagesContainer}>
          <Animated.View
            style={{
              flex: 1,
              transform: [
                {
                  translateY: Animated.subtract(104, bottomPadding)
                }
              ]
            }}
          >
            <ScrollView
              ref={scrollViewRef}
              style={{ flex: 1 }}
              contentContainerStyle={styles.messagesContent}
              showsVerticalScrollIndicator={false}
            >
              <Animated.View style={{ opacity: fadeAnim }}>
                {messages.map((message) => (
                  <ChatMessageItem key={message.id} message={message} />
                ))}
              </Animated.View>
              {/* Spacer for input area + keyboard */}
              <Animated.View style={{ height: Animated.add(bottomPadding, 52) }} />
            </ScrollView>
          </Animated.View>
        </View>

        {/* Photo Preview */}
        {selectedImage && (
          <ImagePreview
            imageUri={selectedImage.uri}
            onCancel={clearSelection}
            onSend={handleSendPhoto}
            bottomPadding={bottomPadding}
          />
        )}

        {/* Input Bar */}
        <ChatInput
          onSend={sendMessage}
          onCameraPress={showImagePickerOptions}
          isAnalyzing={isAnalyzing}
          bottomPadding={bottomPadding}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.secondary,
    alignItems: 'center',
  },
  headerTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  messagesContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  messagesContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
});

