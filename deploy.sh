#!/bin/bash
# Quick deployment script for CYBER OPS Portfolio

echo "🎮 CYBER OPS - Building and deploying..."

# Build the project
echo "📦 Building production bundle..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors and try again."
    exit 1
fi

echo "✅ Build successful!"
echo ""
echo "📤 To deploy to GitHub Pages, run:"
echo ""
echo "   git add dist"
echo "   git commit -m 'build: update production build'"
echo "   git push"
echo ""
echo "OR use gh-pages for automatic deployment:"
echo ""
echo "   npm install -g gh-pages"
echo "   npx gh-pages -d dist"
echo ""
echo "🌐 Your site will be live at:"
echo "   https://el-aouni.github.io/Cyber-ops-portfolio/"
echo ""
echo "✨ Done!"
