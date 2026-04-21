# Grocify

A mobile grocery list manager built with React Native and Expo. Add items, check them off as you shop, archive completed lists, and configure your preferred store — all with dark mode support.

## Features

- **Grocery list** — add multiple items at once (one per line), check items off, remove individual items, or clear the whole list
- **Archive** — archive all checked items as a completed shopping run; undo within 5 seconds if you change your mind
- **Receipts tab** — view past archived lists (in progress)
- **Store preference** — choose a preferred store (Tesco, Lidl, Aldi) saved locally with AsyncStorage
- **Dark mode** — full light/dark theme support that follows the system setting
- **Haptic feedback** — subtle tap feedback on tab bar buttons (iOS)

## Tech stack

| Layer | Library |
|---|---|
| Framework | [Expo](https://expo.dev) ~53 / React Native 0.79 |
| Routing | [Expo Router](https://expo.github.io/router) v5 (file-based) |
| State | [Redux Toolkit](https://redux-toolkit.js.org) + React Redux |
| Storage | [@react-native-async-storage/async-storage](https://github.com/react-native-async-storage/async-storage) |
| Icons | [@expo/vector-icons](https://docs.expo.dev/guides/icons/) (Ionicons) |
| Animation | React Native `Animated` API |
| Language | TypeScript (strict) |

## Project structure

```
grocify/
├── app/
│   ├── _layout.tsx          # Root layout: Redux provider, theme context, nav
│   ├── index.tsx            # Redirect → /(tabs)/grocery
│   └── (tabs)/
│       ├── _layout.tsx      # Bottom tab navigator
│       ├── grocery.tsx      # Main grocery list screen
│       ├── receipts.tsx     # Archived lists screen
│       └── settings.tsx     # Store preference screen
├── components/
│   ├── AddItemModal.tsx     # Modal for adding items
│   ├── HapticTab.tsx        # Tab bar button with haptic feedback
│   └── ui/
│       ├── IconSymbol.ios.tsx       # SF Symbols wrapper (iOS)
│       ├── IconSymbol.tsx           # Ionicons fallback (other platforms)
│       ├── TabBarBackground.ios.tsx # Blur tab bar (iOS)
│       └── TabBarBackground.tsx    # Default tab bar background
├── src/state/
│   ├── store.ts             # Redux store
│   └── grocerySlice.ts      # Grocery state: items + archived lists
├── types/
│   └── grocery.ts           # TypeScript interfaces
├── styles/
│   └── theme.ts             # Color palette + createStyles factory
├── hooks/
│   ├── useColorScheme.ts    # Re-export from react-native
│   └── useThemeColor.ts     # Theme-aware color helper
└── assets/
    ├── fonts/               # SpaceMono
    └── images/              # App icon, splash, adaptive icon
```

## Getting started

### Prerequisites

- Node.js 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/): `npm install -g expo-cli`
- For iOS: Xcode 15+ and CocoaPods (`gem install cocoapods`)
- For Android: Android Studio with an emulator configured

### Install dependencies

```bash
npm install
```

### Run in Expo Go (quickest start)

```bash
npx expo start
```

Scan the QR code with the Expo Go app (iOS / Android) or press `i` for the iOS simulator, `a` for Android.

### Run a native development build

Use this when you need access to native modules (the default for this project since it uses `expo-dev-client`).

**iOS**

```bash
# Install CocoaPods dependencies (first time or after native changes)
cd ios && pod install && cd ..

npx expo run:ios
```

**Android**

```bash
npx expo run:android
```

**Web**

```bash
npx expo start --web
```

## State management

Redux Toolkit manages all grocery state in a single slice (`src/state/grocerySlice.ts`).

| Action | Description |
|---|---|
| `addItems(names: string[])` | Add one or more items to the list |
| `toggleItem(id)` | Toggle the checked state of an item |
| `removeItem(id)` | Remove a single item |
| `markAllPurchased()` | Check every item |
| `archivePurchasedItems(archiveId)` | Move all checked items into an archived list |
| `removeArchive(archiveId)` | Remove an archived list (used by undo) |
| `clearItems()` | Remove all items from the active list |

Store preference (selected store) is persisted directly with AsyncStorage outside of Redux, keyed as `storePreference`.

## Configuration

`app.json` controls the Expo build configuration. Key settings:

| Key | Value | Notes |
|---|---|---|
| `newArchEnabled` | `true` | React Native New Architecture enabled |
| `ios.bundleIdentifier` | `com.abhijitmisra.grocify` | Change for your own distribution |
| `scheme` | `grocify` | Deep-link URL scheme |

The iOS native build reads its JS engine setting from `ios/Podfile.properties.json` (`expo.jsEngine: "hermes"`). Hermes is required when New Architecture is enabled.
