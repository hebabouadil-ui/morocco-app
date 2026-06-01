# Dead Zone Shooter — Advanced 3D Survival Game

Full 3D WebGL game built with **Three.js** r160. Works in any modern browser and can be packaged as a native **APK (Android)** or **IPA (iOS)** via Capacitor.

---

## Try it RIGHT NOW in your phone browser

1. Enable **GitHub Pages** in repo Settings → Pages → Branch: `claude/3ds-survival-shooter-game-hHUgz` → folder `/shooter-game/www`
2. Open the URL on your phone — plays instantly, no install needed

---

## Build Android APK

```bash
cd shooter-game
npm install
npm run build:android
# Opens Android Studio → Build → Generate Signed APK
```

**Requirements:** Node 18+, Android Studio, Java 17

---

## Build iOS IPA

```bash
cd shooter-game
npm install
npm run build:ios
# Opens Xcode → Product → Archive → Distribute
```

**Requirements:** macOS, Xcode 14+, Apple Developer account

---

## Game Features

| Feature | Detail |
|---------|--------|
| Engine | Three.js WebGL (real 3D) |
| Perspective | Bird's-eye 3/4 camera like the screenshot |
| Enemies | 3D zombie models with walk anim + glowing eyes |
| Boss zombies | 1.85× scale, crown, red point light, 9 extra HP |
| Bullets | Glowing cylinders + motion trail per soldier |
| Explosions | 32-particle burst + point light flash |
| Lighting | Moon, red danger lights, lamppost oranges, blink antennas |
| City | 10 buildings with randomised glowing windows + rooftop antennas |
| Effects | Camera shake, muzzle flash, blood pools, damage border flash |
| Controls | Drag anywhere to strafe (touch + mouse) |
| Waves | Infinite; every 10×wave kills advances, spawn rate increases |
| HUD | Score, wave, kill count, health bar, wave banner |

---

## Controls

- **Drag left/right** → move 3-soldier squad
- **Auto-aim** → squad always fires at nearest zombie
- **Auto-fire** → 3 streams every 230 ms
