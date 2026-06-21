# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Platform permissions & builds (for Phase 6 features)

This project uses background location and camera (delivery proof). To test those features you must configure platform permissions and perform a native build.

- Install dependencies:

```bash
npm install
```

- iOS (recommended):
   - The required `Info.plist` keys have been added to `app.json` under the `ios.infoPlist` section.
   - Background location requires a native build. Create a development build or production build with EAS:

```bash
eas build --platform ios --profile development
```

- Android (recommended):
   - Required permissions were added to `app.json` under `android.permissions` (including `ACCESS_BACKGROUND_LOCATION` and `CAMERA`).
   - Background location and foreground service notifications require a development build or production build:

```bash
eas build --platform android --profile development
```

- Notes:
   - Expo Go does not support background location or some native permission behaviors — use dev/prod builds.
   - When testing on iOS, ensure the device Settings allow Background App Refresh and Location Always/Always and When In Use.
   - For Android 11+ background location requires the user to grant foreground location first, then background.

If you want I can add an `app.json` checklist or helper scripts to streamline EAS builds.
