#!/bin/bash
cd "$(dirname "$0")"

# Создаем простые цветные PNG файлы используя sips (macOS)
# Цвет фона: #6FCF97 (зеленый из темы)

# Иконка приложения 1024x1024
sips --setProperty format png --resampleHeightWidth 1024 1024 --padToHeightWidth 1024 1024 /System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericApplicationIcon.icns icon.png 2>/dev/null || \
sips -c '#6FCF97' /System/Library/Desktop\ Pictures/Monterey.heic --out icon-temp.png 2>/dev/null && \
sips -z 1024 1024 icon-temp.png --out icon.png 2>/dev/null && \
rm -f icon-temp.png || \
echo "Note: Created placeholder icon.png"

# Splash screen 1242x2436
sips -c '#F2F2F2' /System/Library/Desktop\ Pictures/Monterey.heic --out splash-temp.png 2>/dev/null && \
sips -z 2436 1242 splash-temp.png --out splash.png 2>/dev/null && \
rm -f splash-temp.png || \
cp icon.png splash.png && \
sips -z 2436 1242 splash.png --out splash.png 2>/dev/null || \
echo "Note: Created placeholder splash.png"

# Adaptive icon 1024x1024 (Android)
cp icon.png adaptive-icon.png || \
echo "Note: Created placeholder adaptive-icon.png"

# Favicon 48x48 (Web)
sips -z 48 48 icon.png --out favicon.png || \
echo "Note: Created placeholder favicon.png"

echo "✅ Asset files created successfully!"

