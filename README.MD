# 🌸 Ovia — Period Tracker App

A full-stack mobile application built with **React Native (Expo)** for the frontend and a separate backend service. This app helps users track their menstrual cycle, manage PCOS/PCOD, plan pregnancies, get AI-powered health insights, and more.

---

## 📱 Features

### Main Features
- 🤖 AI Chatbot for health queries
- 🔔 Period reminders & notifications
- 🩺 Doctor section (Dr. Sect)
- 📊 Period tracking & cycle insights
- 🏥 PCOS/PCOD management
- 🤰 Pregnancy tracking
- 💊 Medicine reminders
- 📅 Appointment reminders
- 🏃 Exercise modules
- 🥗 Meal suggestions

### Additional Features
- 💬 In-app chat
- 🐦 Twitter integration
- 👫 Partner mode

---

## 🗂️ Project Structure

```
Tracker-App/
├── backend/              # Backend service (API)
├── frontend/
│   └── ovia/             # React Native Expo app
│       ├── assets/       # Images, icons, fonts
│       ├── src/
│       │   ├── components/    # Reusable UI components
│       │   ├── navigation/    # App navigation setup
│       │   │   └── AppNavigator.js
│       │   ├── screens/       # All app screens
│       │   │   ├── SplashScreen.js
│       │   │   └── OnboardingScreen.js
│       │   └── theme/         # Colors, fonts, styles
│       │       └── colors.js
│       ├── App.js
│       ├── app.json
│       └── package.json
└── README.MD
```

---

## ⚙️ Prerequisites

Make sure you have the following installed before starting:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 18 or above | [nodejs.org](https://nodejs.org) |
| npm | comes with Node.js | — |
| Expo CLI | latest | `npm install -g expo-cli` |
| Git | latest | [git-scm.com](https://git-scm.com) |
| Expo Go (mobile) | latest | [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) / [App Store](https://apps.apple.com/app/expo-go/id982107779) |

---

## 🚀 Getting Started

### Step 1: Clone the Repository

```bash
git clone https://github.com/LakshuCodes/Tracker-App.git
cd Tracker-App
```

### Step 2: Navigate to the Frontend

```bash
cd frontend/ovia
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Install Expo-specific Dependencies

```bash
npx expo install expo-linear-gradient
npx expo install react-native-screens
npx expo install react-native-safe-area-context
npx expo install react-native-gesture-handler
```

### Step 5: Install Navigation Libraries

```bash
npm install @react-navigation/native @react-navigation/stack
```

### Step 6: Start the Development Server

```bash
npx expo start --clear
```

---

## 📲 Running on Your Device

### Option A: Physical Device (Recommended)
1. Install **Expo Go** from Play Store or App Store
2. Run `npx expo start --clear`
3. Scan the QR code shown in terminal using Expo Go

### Option B: Android Emulator
1. Install [Android Studio](https://developer.android.com/studio)
2. Set up a virtual device (Pixel 7, API 34 recommended)
3. Start the emulator
4. Run `npx expo start --clear` then press `a`

### Option C: iOS Simulator (Mac only)
1. Install Xcode from the App Store
2. Run `npx expo start --clear` then press `i`

---

## 📦 All Dependencies

Here is a full list of dependencies used in this project:

```json
"dependencies": {
  "expo": "~52.0.0",
  "expo-linear-gradient": "~14.0.0",
  "expo-splash-screen": "~0.29.0",
  "expo-status-bar": "~2.0.0",
  "react": "18.3.1",
  "react-native": "0.76.5",
  "react-native-gesture-handler": "~2.20.2",
  "react-native-safe-area-context": "4.12.0",
  "react-native-screens": "~4.4.0",
  "@react-navigation/native": "^6.1.18",
  "@react-navigation/stack": "^6.4.1"
}
```

Install all at once:
```bash
npm install
npx expo install expo-linear-gradient expo-splash-screen react-native-screens react-native-safe-area-context react-native-gesture-handler
```

---

## 🛠️ Common Errors & Fixes

### ❌ "Project is incompatible with this version of Expo Go"
**Fix:** Update Expo Go app on your phone from Play Store / App Store.

### ❌ "Unable to resolve asset ./assets/splash.png"
**Fix:** Make sure `splash.png` and `logo.png` exist in `frontend/ovia/assets/`

### ❌ "Something went wrong" on Expo Go
**Fix:** Run with cache cleared:
```bash
npx expo start --clear
```

### ❌ Logo not showing
**Fix:** Verify the path in `SplashScreen.js`:
```js
source={require('../../assets/logo.png')}
```
Make sure `logo.png` is in `ovia/assets/` folder.

---

## 👥 Team & Roles

| Role | Responsibility |
|------|---------------|
| Frontend Developer | React Native UI, screens, navigation |
| Backend Developer | API, database, authentication |

---

## 🌿 Git Workflow

```bash
# Always pull latest before starting work
git pull origin main

# Create a new branch for your feature
git checkout -b feature/your-feature-name

# After making changes
git add .
git commit -m "feat: describe what you did"
git push origin feature/your-feature-name

# Then open a Pull Request on GitHub
```

### Branch Naming Convention
- `feature/screen-name` — for new screens
- `fix/bug-description` — for bug fixes
- `chore/task-name` — for setup or config changes

---

## 📁 Adding New Screens

1. Create your screen file in `src/screens/YourScreen.js`
2. Import and add it to `src/navigation/AppNavigator.js`:
```js
import YourScreen from '../screens/YourScreen';

// Inside Stack.Navigator:
<Stack.Screen name="YourScreen" component={YourScreen} />
```
3. Navigate to it from any screen:
```js
navigation.navigate('YourScreen');
```

---

