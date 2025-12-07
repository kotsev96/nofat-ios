import { useState } from 'react';
import { Platform, Alert, ActionSheetIOS } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export interface ImageSelection {
    uri: string;
}

export const useImagePicker = () => {
    const [selectedImage, setSelectedImage] = useState<ImageSelection | null>(null);

    const handleCameraPress = async () => {
        // Camera is not available on web
        if (Platform.OS === 'web') {
            Alert.alert('Information', 'Camera is not available in web version. Please use gallery.');
            return;
        }

        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Camera Permission',
                    'Camera permission is required to scan food.'
                );
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                allowsEditing: false,
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                // On web, uri might be base64, handle both cases
                const imageUri = result.assets[0].uri;
                setSelectedImage({ uri: imageUri.startsWith('data:') ? imageUri : imageUri });
            }
        } catch (error) {
            console.error('Error launching camera:', error);
            Alert.alert('Error', 'Failed to open camera');
        }
    };

    const handleGalleryPress = async () => {
        try {
            // On web, permissions might not be needed or work differently
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert(
                        'Gallery Permission',
                        'Gallery permission is required to select photos.'
                    );
                    return;
                }
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: false,
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                // On web, uri might be base64, handle both cases
                const imageUri = result.assets[0].uri;
                setSelectedImage({ uri: imageUri.startsWith('data:') ? imageUri : imageUri });
            }
        } catch (error) {
            console.error('Error launching gallery:', error);
            Alert.alert('Error', 'Failed to open gallery');
        }
    };

    const showImagePickerOptions = () => {
        // Use ActionSheetIOS only on iOS native, for web and Android use Alert
        if (Platform.OS === 'ios' && ActionSheetIOS) {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: ['Cancel', 'Camera', 'Gallery'],
                    cancelButtonIndex: 0,
                },
                (buttonIndex) => {
                    if (buttonIndex === 1) {
                        handleCameraPress();
                    } else if (buttonIndex === 2) {
                        handleGalleryPress();
                    }
                }
            );
        } else {
            // For Android and Web, show Alert with options
            // On web, only show gallery option
            const options = Platform.OS === 'web'
                ? [
                    { text: 'Cancel', style: 'cancel' as const },
                    { text: 'Choose from Gallery', onPress: handleGalleryPress },
                ]
                : [
                    { text: 'Cancel', style: 'cancel' as const },
                    { text: 'Camera', onPress: handleCameraPress },
                    { text: 'Gallery', onPress: handleGalleryPress },
                ];

            Alert.alert('Choose Source', '', options);
        }
    };

    const clearSelection = () => {
        setSelectedImage(null);
    };

    return {
        selectedImage,
        showImagePickerOptions,
        clearSelection,
        setSelectedImage,
    };
};
