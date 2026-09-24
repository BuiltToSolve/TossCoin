# 🪙 TossCoin

An interactive, physics-driven 3D coin toss mobile application built with React Native and Expo. TossCoin delivers a fluid tactile experience with realistic coin flipping animations, device motion sensors, haptic feedback, and gesture interactions.

---

## ✨ Features

- **Realistic 3D Flip Physics**: Multi-rotational 3D flip animation along the X-axis combined with dynamic vertical parabolic toss trajectories powered by React Native Reanimated.
- **Gesture-Driven Interactions**:
  - **Swipe Up to Toss**: Natural upward flick gesture using gesture velocity detection (`react-native-gesture-handler`) to toss the coin into the air.
  - **Secret Tilt Control (Long Press)**: Long-press on the coin (800ms) with haptic feedback enables manual mode where device pitch/tilt determines mid-air whether the coin lands on Heads or Tails.
  - **Swipe Edge to Exit**: Fast edge-swipe gesture from the left screen boundary to quickly exit the application on Android.
- **Device Sensor Integration**: Tracks real-time device orientation and tilt pitch angles via `expo-sensors` (`DeviceMotion`).
- **Tactile Haptic Feedback**: Medium-impact haptic responses triggered via `expo-haptics` during mode toggles.
- **Sleek Minimalist Aesthetic**: Dark-themed UI with metallic gold coin textures, realistic drop shadows, elevation, and typography.
- **Modern Architecture**: Leverages React Native's New Architecture (`newArchEnabled`) and React Compiler optimizations.

---

## 🛠️ Tech Stack

### Core & Framework
- **[React Native](https://reactnative.dev/)** (`0.81.5`) – Cross-platform native mobile application framework with New Architecture enabled.
- **[React](https://react.dev/)** (`19.1.0`) – Modern component-based UI library with experimental React Compiler support.
- **[Expo](https://expo.dev/)** (`SDK 54`) – Managed workflow and runtime ecosystem for iOS and Android.
- **[Expo Router](https://docs.expo.dev/router/introduction/)** (`v6`) – File-system based routing for React Native.
- **[TypeScript](https://www.typescriptlang.org/)** (`~5.9.2`) – Type safety and developer ergonomics.

### Animation & Gesture Handling
- **[React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)** (`~4.1.1`) – Smooth 60/120 FPS animations executed on the UI thread.
- **[React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)** (`~2.28.0`) – Native gesture recognition (Pan, Long Press, Race gestures).
- **[React Native Worklets](https://github.com/software-mansion/react-native-worklets)** (`0.5.1`) – Off-thread scheduling and UI worklet management.

### Sensors & Device Capabilities
- **[Expo Sensors](https://docs.expo.dev/versions/latest/sdk/sensors/)** (`~15.0.8`) – `DeviceMotion` sensor listener for device pitch, roll, and orientation monitoring.
- **[Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)** (`~15.0.8`) – Native vibration and haptic feedback.

### Build & Tooling
- **[EAS Build](https://docs.expo.dev/build/introduction/)** – Cloud and local build tooling for generating Android (APK/AAB) and iOS binaries.
- **[ESLint](https://eslint.org/)** – Code linting and style enforcement with `eslint-config-expo`.

---

## 🎮 How to Use & Gesture Guide

| Gesture | Action | Description |
|---|---|---|
| **Swipe Up** | Toss Coin | Flick the coin upwards to start the 3D flip animation. |
| **Long Press (800ms)** | Toggle Secret Control | Activates/deactivates tilt control with haptic confirmation. |
| **Tilt Device Forward/Backward** | Control Mid-Flight Result | *(In Secret Control Mode)* Tilting the phone forward sets result to Heads, tilting backward sets Tails. |
| **Edge Swipe Right** | Exit App | Swipe rapidly from the left screen edge (< 50px) to dismiss and close the application. |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn
- [Expo Go](https://expo.dev/go) app on your physical iOS/Android device or an Android/iOS simulator

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd TossCoin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

Start the Expo development server:

```bash
npx expo start
```

- Press `a` in the terminal to run on an Android emulator / connected device.
- Press `i` to run on an iOS simulator.
- Press `w` to run in the web browser.
- Scan the QR code with **Expo Go** (Android) or the Camera app (iOS).

---

## 📦 Building for Production

This project is configured with [EAS Build](https://docs.expo.dev/build/introduction/):

- **Build Android APK (Preview)**:
  ```bash
  npm run build:android
  ```
- **Build iOS**:
  ```bash
  npm run build:ios
  ```

---

## 📂 Project Structure

```
TossCoin/
├── app/                  # Expo Router directory
│   ├── _layout.tsx       # Root layout, theme provider, and navigation stack
│   ├── index.tsx         # Main interactive coin toss screen
│   └── modal.tsx         # Modal presentation route
├── assets/               # App icons, splash screens, and images
├── components/           # Reusable UI components and themed text/views
├── constants/            # Theme colors and constants
├── hooks/                # Custom React hooks (theming, color scheme)
├── app.json              # Expo application configuration & New Architecture settings
├── eas.json              # EAS Build configuration profiles
└── package.json          # Project dependencies and npm scripts
```

