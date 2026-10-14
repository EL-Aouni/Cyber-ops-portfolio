# CYBER OPS - Interactive Cybersecurity Portfolio Game

🎮 **Play the portfolio:** An immersive 2D top-down browser game showcasing Mohammed El-Aouni's cybersecurity projects and skills.

## 🚀 About This Project

CYBER OPS transforms a traditional portfolio into a **playable browser game** where visitors explore a virtual Security Operations Center. Each room represents real cybersecurity projects, skills, and experiences.

**Developer:** Mohammed El-Aouni  
**Education:** Cybersecurity Engineering Student at ENSA Oujda  
**Status:** Seeking PFE (Projet de Fin d'Études) Internship

## 🎯 Game Features

### Real Gameplay Mechanics
- ✅ **Working player movement** with WASD/Arrow keys
- ✅ **Collision detection** - can't walk through walls
- ✅ **Interactive objects** - terminals, stations, doors
- ✅ **Mission progression system** with XP rewards
- ✅ **Mobile touch controls** - joystick + interact button
- ✅ **Pause menu** with restart functionality
- ✅ **Progress saving** using localStorage
- ✅ **Smooth animations** and camera following

### Explorable Locations

1. **SOC Room** - Security Operations Center with SIEM platforms
2. **Red Team Laboratory** - Reconnaissance tools and penetration testing
3. **Security Research Room** - Active Directory lab and security experiments
4. **Mission Control** - Technical skills and education profile
5. **Recruitment Office** - Contact info and PFE internship availability

### Portfolio Content Integration

- **SOC/SIEM Projects:** Wazuh, Splunk, threat intelligence, TheHive
- **Offensive Security:** Reconnaissance framework, OSINT, web app security
- **Infrastructure:** Active Directory, Windows Server, Exchange, log collection
- **Certifications:** HackTheBox, TryHackMe
- **Skills:** Security operations, penetration testing, automation, scripting

## 🕹️ Controls

**Desktop:**
- `W` `A` `S` `D` or Arrow Keys - Move operator
- `E` or `SPACE` - Interact with terminals/doors
- `ESC` - Pause menu

**Mobile:**
- Virtual joystick (bottom left) - Movement
- `E` button (bottom right) - Interact

## 🛠️ Tech Stack

- **React 19** + **TypeScript** - UI framework
- **Vite** - Build tool and dev server
- **HTML5 Canvas** - Custom 2D game renderer
- **No external game engine** - Built from scratch for performance
- **CSS3** - Cyberpunk-themed UI styling

## 📦 Installation & Running

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The game will open at `http://localhost:5173`

## 🌐 Deployment

This project can be deployed to any static hosting platform:

### GitHub Pages
```bash
npm run build
# Upload the dist/ folder to GitHub Pages
```

### Netlify / Vercel
- Connect your repository
- Build command: `npm run build`
- Publish directory: `dist`

### Other Static Hosts
Just upload the contents of the `dist/` folder after running `npm run build`.

## 🎮 Game Design Philosophy

This isn't just a portfolio with game-like animations — it's a **real game** with:
- Actual collision physics
- State management and progression
- Interactive gameplay loops
- Mission objectives and rewards
- Multiple interconnected rooms
- Persistent progress tracking

The game serves as both an engaging experience AND a complete portfolio, ensuring recruiters can easily access all information while enjoying the unique presentation.

## 🎯 Mission System

6 missions guide visitors through the portfolio:
1. ✓ Operator Training (SOC Introduction)
2. ✓ Security Alert Investigation (SIEM Analysis)
3. ✓ Red Team Operations (Reconnaissance)
4. ✓ Threat Intelligence (Research Lab)
5. ✓ Skills Assessment (Mission Control Profile)
6. ✓ Recruitment Contact (Connect for PFE)

Each completed mission awards XP and unlocks portfolio content.

## 📱 Mobile Optimized

Fully responsive design with:
- Touch controls for mobile devices
- Adaptive UI layouts
- Optimized canvas rendering
- Smooth performance on ordinary devices

## 🔗 Connect with Mohammed

- **GitHub:** [@Spinoza-ao](https://github.com/Spinoza-ao)
- **LinkedIn:** [Mohammed El-Aouni](https://linkedin.com/in/mohammed-el-aouni)
- **Certifications:** HackTheBox, TryHackMe
- **Seeking:** PFE Internship in SOC, Threat Intelligence, or Security Operations

## 📄 License

This portfolio project is created by Mohammed El-Aouni. Feel free to be inspired, but please create your own unique implementation.

---

**Built with passion for cybersecurity and interactive experiences** 🛡️🎮

*Last Updated: October 2026*
