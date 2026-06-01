# Dead Zone Shooter — 3DS Survival Shooter

A 3DS-style perspective zombie survival shooter built with **React Native + Expo**.
Runs on both **iOS** and **Android**.

## Gameplay

- Drag left/right to move your 3-soldier squad
- Squad auto-aims and fires at the nearest zombie
- Zombies scale up as they approach (perspective 3D effect)
- Survive waves — each wave spawns faster, tougher enemies
- BOSS zombies appear with extra HP
- Score multiplies with wave number

## Quick Start

```bash
cd zombie-shooter
npm install
npx expo start
```

Scan the QR code with **Expo Go** on your phone.

## Build APK / IPA

```bash
# Install EAS CLI
npm install -g eas-cli
eas login

# Android APK
npm run build:android

# iOS IPA
npm run build:ios
```

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | React Native 0.73 + Expo 50 |
| Graphics | View-based perspective rendering (no WebGL) |
| Animation | `requestAnimationFrame` game loop |
| Haptics | `expo-haptics` on zombie hits |
| Touch | `PanResponder` drag controls |

## Game Constants (easy to tweak)

Edit `src/GameScreen.js` top section:

| Constant | Default | Effect |
|----------|---------|--------|
| `Z_BASE_SPD` | 1.3 | Zombie base speed |
| `Z_BASE_HP` | 3 | Zombie base health |
| `SPAWN_MS` | 1700 | Spawn interval (ms) |
| `FIRE_MS` | 260 | Fire rate (ms) |
| `KILLS_PER_WAVE` | 10 | Kills needed to advance wave |
