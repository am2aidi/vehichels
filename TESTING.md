# HURANOW MOTORS – Testing & Installation Guide

This guide explains how to install and test **Huranow Motors** on your **iPhone**, **Windows PC (Lenovo)**, and other devices completely **FREE**.

---

## 1. iPhone (Safari PWA) – Test the New Logo & App

Your web app is configured as a Progressive Web App (PWA) with the official orange/purple Huranow logo, full-screen standalone mode, interactive 3D studio, and safe-area notch padding.

### How to Install on iPhone:
1. **Remove Old Icon (if already installed):**
   - On your iPhone home screen, press and hold the existing Huranow icon.
   - Tap **Delete Bookmark** (or **Remove App**) -> **Delete**.
2. **Open in Safari:**
   - Open **Safari** on your iPhone.
   - Go to your Huranow Motors site URL (or your Vercel deployment URL for `am2aidi/vehichels`).
3. **Add to Home Screen:**
   - Tap the **Share** button at the bottom (the square icon with an arrow pointing up).
   - Scroll down and tap **Add to Home Screen**.
   - You will see the orange/purple **Huranow** logo and name `huranow`.
   - Tap **Add** in the top-right corner.
4. **Launch the App:**
   - Tap the new **Huranow** icon on your home screen.
   - It will open in standalone app mode without Safari browser toolbars, with smooth scrolling, 3D studio controls, and notch-safe spacing.

---

## 2. Windows PC (Lenovo) – Desktop App

You have two simple ways to get and run the Windows desktop application:

### Option A: Download the Installer from GitHub Actions (Recommended, 100% Free)
1. Go to your repository on GitHub.
2. Click the **Actions** tab at the top.
3. Click on the latest workflow run: **Build Desktop Apps (Windows & macOS)**.
4. Scroll down to the **Artifacts** section at the bottom.
5. Click **huranow-windows** to download the ZIP file.
6. Unzip the downloaded file and double-click the `.exe` or `.msi` installer.
7. Install and launch **Huranow** on your Windows PC!

### Option B: Test Locally on your Windows PC
From the terminal in your project directory:
```bash
npm run desktop:dev
```
This compiles and launches the native Windows desktop app window on your computer.

---

## 3. macOS Desktop App (Free, No Mac Needed)

Even though you do not own a Mac, GitHub's free cloud runners build the macOS app for you automatically:
1. In your GitHub repository **Actions** tab, open the latest **Build Desktop Apps (Windows & macOS)** run.
2. Under **Artifacts**, download **huranow-macos**.
3. Inside is the compiled `.dmg` installer and `.app` bundle ready for any Mac user.

---

## 4. Android Debug APK (Optional)

If you or a friend ever want to test the app on an Android phone:
1. Go to your GitHub repository **Actions** tab.
2. Click on the workflow: **Build Android APK (Debug)**.
3. Under **Artifacts**, download **huranow-android-debug-apk**.
4. Unzip to find `app-debug.apk`. Transfer it to any Android device to install and test immediately (no Google Play account or Android Studio needed).

---

## 5. Summary of Redeployment to Vercel

To publish all the new icons, manifest, and service worker to your live site:
```bash
git add .
git commit -m "Update PWA with official orange Huranow logo, Tauri v2 desktop, and Capacitor Android"
git push origin main
```
Vercel will automatically build and deploy within 1–2 minutes on your connected domain for this repository.
