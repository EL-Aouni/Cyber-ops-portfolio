# Deployment Instructions for CYBER OPS Portfolio Game

## Quick Deploy to GitHub Pages

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit: CYBER OPS interactive portfolio game"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/cyber-ops-portfolio.git
git push -u origin main
```

2. **Configure Vite for GitHub Pages:**

Add to `vite.config.ts`:
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/cyber-ops-portfolio/', // Replace with your repo name
})
```

3. **Build and Deploy:**
```bash
npm run build
npx gh-pages -d dist
```

4. **Enable GitHub Pages:**
- Go to your repository settings
- Navigate to Pages section
- Select `gh-pages` branch
- Your game will be live at: `https://YOUR-USERNAME.github.io/cyber-ops-portfolio/`

## Alternative: Netlify (Easiest)

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Connect your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Deploy! Your game will be live in ~2 minutes

## Alternative: Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Connect your repository
5. Vercel auto-detects Vite settings
6. Deploy!

## Local Testing Before Deploy

```bash
# Build production version
npm run build

# Preview the production build locally
npm run preview

# Visit http://localhost:4173 to test
```

## Performance Optimization

The game is already optimized for production:
- ✅ Canvas-based rendering (no heavy DOM)
- ✅ Efficient collision detection
- ✅ Minimal bundle size (~266KB JS)
- ✅ CSS-only animations where possible
- ✅ LocalStorage for progress (no backend needed)
- ✅ Mobile touch controls included

## Sharing Your Portfolio

Once deployed, share these links:
- 🎮 Live game demo
- 💻 GitHub repository
- 📄 LinkedIn post highlighting the interactive experience
- 📧 Include in PFE internship applications

---

**Your interactive portfolio game is ready to impress recruiters!** 🚀
