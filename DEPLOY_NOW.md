# Quick Deploy Guide

## After Making Changes

1. **Build the updated version:**
   ```bash
   npm run build
   ```

2. **Commit and push:**
   ```bash
   git add .
   git commit -m "Update portfolio game"
   git push
   ```

3. **Deploy to GitHub Pages:**
   ```bash
   npx gh-pages -d dist
   ```

4. **Wait 1-2 minutes**, then visit:
   https://el-aouni.github.io/Cyber-ops-portfolio/

---

## If the site is stuck on "Initializing CYBER OPS..."

This usually means there's a JavaScript error. Check:

1. **Open browser console** (F12) on your live site
2. Look for red error messages
3. Common issues:
   - Missing asset files (check base path in `vite.config.ts`)
   - CORS issues (shouldn't happen on GitHub Pages)
   - localStorage not working (check browser privacy settings)

## Testing Locally Before Deploy

```bash
# Build production version
npm run build

# Test the production build
npm run preview

# Open http://localhost:4173 in your browser
```

This tests the EXACT same build that will go live on GitHub Pages.

---

## Current Status

✅ Game built successfully (267 KB bundle)
✅ Base path configured: `/Cyber-ops-portfolio/`
✅ GitHub Pages URL: https://el-aouni.github.io/Cyber-ops-portfolio/

**Next Step:** Push your latest `dist/` folder to GitHub and redeploy!
