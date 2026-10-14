#!/bin/bash
# Auto-download free pixel art assets for CYBER OPS

echo "🎨 Downloading free pixel art assets..."

mkdir -p public/assets/{characters,tiles,ui,effects}

# Download Kenney assets (CC0 - Public Domain)
echo "📦 Downloading character sprites..."
curl -L "https://kenney.nl/content/3-assets/11/topdown-shooter.zip" -o temp_chars.zip 2>/dev/null

echo "📦 Downloading tileset..."
curl -L "https://kenney.nl/content/3-assets/63/space-shooter-redux.zip" -o temp_tiles.zip 2>/dev/null

echo "📦 Downloading UI elements..."
curl -L "https://kenney.nl/content/3-assets/419/ui-pack-space-expansion.zip" -o temp_ui.zip 2>/dev/null

# Extract (you'll need to manually organize)
echo "✅ Assets downloaded! Please extract and organize into public/assets/"
echo ""
echo "OR manually download from:"
echo "  - https://kenney.nl/assets/topdown-shooter"
echo "  - https://kenney.nl/assets/space-shooter-redux"
echo "  - https://kenney.nl/assets/ui-pack-space-expansion"
echo ""
echo "Extract to:"
echo "  public/assets/characters/"
echo "  public/assets/tiles/"
echo "  public/assets/ui/"
